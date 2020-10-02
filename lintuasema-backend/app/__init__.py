import os
import requests
import cx_Oracle
import app.oracleConfig

from flask import (Flask, render_template, 
    request, redirect, session, url_for,
    make_response, jsonify)
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from sqlalchemy.engine import create_engine

from app.api import bp as api_blueprint

from app.api.classes.observatory import models
from app.api.classes.day import models
from app.api.classes.location import models
from app.api.classes.observationsession import models
from app.api.classes.user import models

from app.api.classes.observationsession import views
from app.api.classes.observatory import views, services
from app.api.classes.day import views
from app.api.classes.user import views

from app.api.classes.user.models import User
from app.api.classes.observatory.models import Observatory

from app.db import db

from os import urandom

def init_app():

    app = Flask(__name__, static_folder='../build', static_url_path='/')
    cors = CORS(app)

    login_manager = LoginManager()
    login_manager.init_app(app)
    app.config["SECRET_KEY"] = urandom(32)
    app.config['LOGIN_DISABLED'] = True

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    dnsStr = cx_Oracle.makedsn('oracle.luomus.fi', 1521, service_name='oracle.luomus.fi')
    dnsStr = dnsStr.replace('SID', 'SERVICE_TYPE')
    
    try:
        app.config["SQLALCHEMY_DATABASE_URI"] = "oracle://"+oracleConfig.username+":"+oracleConfig.password+"@"+dnsStr
        app.config["SQLALCHEMY_ECHO"] = True
        print('Tietokantayhteys luotu.')
    except Exception as e:
        print(e)
    
    

    app.register_blueprint(api_blueprint)
    
    db.init_app(app) #db siirretty omaksi luokaksi, että se näkyy kaikille, jostain syystä init_app() systeemillä tehtäessä se ei näy. kaikkiin models.py tiedostoihin from app.db import db
    with app.app_context(): #appioliota käyttäen luodaan tietokantataulut, tämä googlesta
       try:
           db.drop_all()
           db.create_all()
           print('Taulut luotu')
           observationStation = Observatory(name="Hangon Lintuasema")
           observationStation2 = Observatory(name="Jurmon Lintuasema")
           db.session().add(observationStation)
           db.session().add(observationStation2)
           db.session().commit()
           print('Lintuasema luotu')
       except Exception as e:
           print(e)

    return app


def init_testapp():

    app = Flask(__name__, static_folder='../build', static_url_path='/')
    cors = CORS(app)

    login_manager = LoginManager()
    login_manager.init_app(app)
    app.config["SECRET_KEY"] = urandom(32)
    app.config['LOGIN_DISABLED'] = True

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    try:
        app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///:memory:'
        app.config["SQLALCHEMY_ECHO"] = True
        print('Tietokantayhteys luotu.')
    except Exception as e:
        print(e)
    
    

    app.register_blueprint(api_blueprint)
    
    db.init_app(app) #db siirretty omaksi luokaksi, että se näkyy kaikille, jostain syystä init_app() systeemillä tehtäessä se ei näy. kaikkiin models.py tiedostoihin from app.db import db
    with app.app_context(): #appioliota käyttäen luodaan tietokantataulut, tämä googlesta
       try:
           db.drop_all()
           db.create_all()
           print('Taulut luotu')
           observationStation = Observatory(name="Hangon Lintuasema")
           observationStation2 = Observatory(name="Jurmon Lintuasema")
           db.session().add(observationStation)
           db.session().add(observationStation2)
           db.session().commit()
           print('Lintuasema luotu')
       except Exception as e:
           print(e)

    return app
