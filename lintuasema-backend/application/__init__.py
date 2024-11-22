import os
import requests
import json
from datetime import timedelta


from flask import (Flask, render_template,
    request, redirect, session, url_for,
    make_response, jsonify, json)
from flask_login import (
    LoginManager
)
from flask_sqlalchemy import SQLAlchemy

from werkzeug.middleware.proxy_fix import ProxyFix

from sqlalchemy.engine import create_engine

from application.api import bp as api_blueprint
from application.api.classes.account.classes import LoggedInUser, get_logged_in_user

from application.api.classes.observatory import models
from application.api.classes.account import models
from application.api.classes.observatoryday import models
from application.api.classes.location import models
from application.api.classes.type import models
from application.api.classes.observationperiod import models
from application.api.classes.shorthand import models
from application.api.classes.observation import models
from application.api.classes.catch import models

from application.api.classes.observationperiod import views
from application.api.classes.location import views, services
from application.api.classes.observatory import views, services
from application.api.classes.observatoryday import views
from application.api.classes.account import views
from application.api.classes.shorthand import views
from application.api.classes.observation import views
from application.api.classes.type import services
from application.api.classes.catch import views, services


from application.api.classes.account.models import Account
from application.api.classes.observatory.models import Observatory

from application.api.classes.observatory.services import createObservatory, getObservatoryId

from application.api.classes.location.services import createLocation
from application.api.classes.type.services import createType


from application.db import db
from application.custom_json_provider import CustomJSONProvider

from os import urandom

from flask_cors import CORS #siirretty vikaksi tietokantatestijärjestelmän debuggausta varten

def init_app(database, print_db_echo):

    #importtaa oracle tarvittaessa
    if database == "oracle":
        import cx_Oracle #siirretty oracle importit tänne, koska pytest ei tykkää niistä tuolla ylhäällä
        import application.oracleConfig

    #määritä app
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    if os.getenv('BEHIND_PROXY') == 'True':
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)
    cors = CORS(app)

    app.json = CustomJSONProvider(app)

    #kirjautuminen
    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=3)
    app.config["SESSION_REFRESH_EACH_REQUEST"] = True
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    login_manager = LoginManager()
    login_manager.init_app(app)
    app.config["SECRET_KEY"] = os.environ['SECRET_KEY']
    app.config['LOGIN_DISABLED'] = False

    @login_manager.user_loader
    def load_user(user_data):
        user = get_logged_in_user(user_data)

        # check if the account exists if using a non-persistent database
        if database != 'oracle' and user is not None:
            account = Account.query.filter_by(userId=user.user_id).first()
            if account is None:
                return None

        return user

    #määrittele tietokantayhteys
    if database == "oracle":
        dnsStr = cx_Oracle.makedsn('oracle.luomus.fi', 1521, service_name='oracle.luomus.fi')
        dnsStr = dnsStr.replace('SID', 'SERVICE_TYPE')
        try:
            app.config["SQLALCHEMY_DATABASE_URI"] = "oracle://"+oracleConfig.username+":"+oracleConfig.password+"@"+dnsStr
            app.config["SQLALCHEMY_ECHO"] = print_db_echo
            print('Tietokantayhteys luotu.')
        except Exception as e:
            print(e)
    else:
        try:
            if (database == "persistent_sqlite") :
                app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + os.path.join(os.getcwd(), 'app.db')
            else:
                app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///:memory:'
            app.config["SQLALCHEMY_ECHO"] = print_db_echo
            print('Testitietokantayhteys luotu.')
        except Exception as e:
            print(e)

    #Tietokannan luonti
    app.register_blueprint(api_blueprint)
    db.init_app(app) #db siirretty omaksi luokaksi, että se näkyy kaikille, jostain syystä init_app() systeemillä tehtäessä se ei näy. kaikkiin models.py tiedostoihin from application.db import db

    with app.app_context(): #appioliota käyttäen luodaan tietokantataulut, tämä googlesta
        try:
            #Määritellään tyhjennetäänkö tietokanta sovelluksen alussa
            if database == "oracle" or database == "persistent_sqlite":
                #db.reflect()
                #db.drop_all()
                db.create_all()
            else:
                db.reflect()
                db.drop_all()
                db.create_all()
            print('Taulut luotu')

            #Lisätään tiedot tiedostosta
            SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
            filename = os.path.join(SITE_ROOT, '', 'locations.json')
            with open(filename) as json_file:
                data = json.load(json_file)
                for o in data["observatories"]:
                    createObservatory(o['observatory'], "actiontest")
                    obsId = getObservatoryId(o['observatory'])
                    for l in o["locations"]:
                        createLocation(l, obsId)
                    for t in o["types"]:
                        createType(t, obsId)

            print('Lintuasema luotu')

        except Exception as e:
            print(e)

    return app
