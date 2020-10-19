import os
import requests


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


from sqlalchemy.engine import create_engine

from app.api import bp as api_blueprint

from app.api.classes.observatory import models
from app.api.classes.user import models
from app.api.classes.day import models
from app.api.classes.location import models
from app.api.classes.observationperiod import models
from app.api.classes.observation import models

from app.api.classes.observationperiod import views
from app.api.classes.location import views, services
from app.api.classes.observatory import views, services
from app.api.classes.day import views
from app.api.classes.user import views
from app.api.classes.observation import views

from app.api.classes.user.models import User
from app.api.classes.observatory.models import Observatory

from app.api.classes.observatory.services import createObservatory

from app.api.classes.location.services import createLocation

from app.db import db

from os import urandom

from flask_cors import CORS #siirretty vikaksi tietokantatestijärjestelmän debuggausta varten

def init_app(database):

    #importtaa oracle tarvittaessa
    if database == "oracle":
        import cx_Oracle #siirretty oracle importit tänne, koska pytest ei tykkää niistä tuolla ylhäällä
        import app.oracleConfig

    #määritä app
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    cors = CORS(app)

    #kirjautuminen
    if database == "oracle":
        login_manager = LoginManager()
        login_manager.init_app(app)
        app.config["SECRET_KEY"] = urandom(32)
        app.config['LOGIN_DISABLED'] = False
    else:
        login_manager = LoginManager()
        login_manager.init_app(app)
        app.config["SECRET_KEY"] = urandom(32)
        app.config['LOGIN_DISABLED'] = True

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    #Kayttajaroolit (alustava, kopioitu vanhasta projektista)
    # from functools import wraps
    # def login_required(_func=None, *, role="ANY"):
    #     def wrapper(func):
    #         @wraps(func)
    #         def decorated_view(*args, **kwargs):
    #             if not (current_user and current_user.is_authenticated):
    #                 return login_manager.unauthorized()

    #             acceptable_roles = set(("ANY", current_user.getRole()))

    #             if role not in acceptable_roles:
    #                 return login_manager.unauthorized()

    #             return func(*args, **kwargs)
    #         return decorated_view
    #     return wrapper if _func is None else wrapper(_func)

    #määrittele tietokantayhteys
    if database == "oracle":
        dnsStr = cx_Oracle.makedsn('oracle.luomus.fi', 1521, service_name='oracle.luomus.fi')
        dnsStr = dnsStr.replace('SID', 'SERVICE_TYPE')
        try:
            app.config["SQLALCHEMY_DATABASE_URI"] = "oracle://"+oracleConfig.username+":"+oracleConfig.password+"@"+dnsStr
            app.config["SQLALCHEMY_ECHO"] = True
            print('Tietokantayhteys luotu.')
        except Exception as e:
            print(e)
    else: 
        try:
            app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///:memory:'
            app.config["SQLALCHEMY_ECHO"] = True
            print('Testitietokantayhteys luotu.')
        except Exception as e:
            print(e)
    
    #Tietokannan luonti
    app.register_blueprint(api_blueprint)
    db.init_app(app) #db siirretty omaksi luokaksi, että se näkyy kaikille, jostain syystä init_app() systeemillä tehtäessä se ei näy. kaikkiin models.py tiedostoihin from app.db import db
  
    with app.app_context(): #appioliota käyttäen luodaan tietokantataulut, tämä googlesta
        try:

            #Määrittellään tyhjennetäänkö tietokanta sovelluksen alussa
            if database == "oracle":
                #db.reflect()
                db.drop_all()
                db.create_all()
            else:
                db.reflect()
                db.drop_all()
                db.create_all()
            print('Taulut luotu')

            #Lisätään kovakoodatut tiedot
            createObservatory("Hangon Lintuasema")
            createObservatory("Jurmon Lintuasema")
            createLocation("Bunkkeri", 1)
            createLocation("Piha", 1)
            createLocation("Etelakarki", 1)
            createLocation("Metsa", 1)
            createLocation("Luoto Gou", 1)
            createLocation("Korkein kohta", 2)
            createLocation("Lansireitti", 2)
            print('Lintuasema luotu')

        except Exception as e:
            print(e)

    return app


#vanha init-toiminnallisuus

# def init_app():
#     import cx_Oracle #siirretty oracle importit tänne, koska pytest ei tykkää niistä tuolla ylhäällä
#     import app.oracleConfig

#     app = Flask(__name__, static_folder='../build', static_url_path='/')
#     cors = CORS(app)

#     login_manager = LoginManager()
#     login_manager.init_app(app)
#     app.config["SECRET_KEY"] = urandom(32)
#     app.config['LOGIN_DISABLED'] = False

#     @login_manager.user_loader
#     def load_user(user_id):
#         return User.query.get(user_id)

#     dnsStr = cx_Oracle.makedsn('oracle.luomus.fi', 1521, service_name='oracle.luomus.fi')
#     dnsStr = dnsStr.replace('SID', 'SERVICE_TYPE')
    
#     try:
#         app.config["SQLALCHEMY_DATABASE_URI"] = "oracle://"+oracleConfig.username+":"+oracleConfig.password+"@"+dnsStr
#         app.config["SQLALCHEMY_ECHO"] = True
#         print('Tietokantayhteys luotu.')
#     except Exception as e:
#         print(e)
    
    

#     app.register_blueprint(api_blueprint)
    
#     db.init_app(app) #db siirretty omaksi luokaksi, että se näkyy kaikille, jostain syystä init_app() systeemillä tehtäessä se ei näy. kaikkiin models.py tiedostoihin from app.db import db
#     with app.app_context(): #appioliota käyttäen luodaan tietokantataulut, tämä googlesta
#        try:
#            db.reflect()
#            db.drop_all()
#            db.create_all()
#            print('Taulut luotu')
#            createObservatory("Hangon Lintuasema")
#            createObservatory("Jurmon Lintuasema")
#            createLocation("Bunkkeri", 1)
#            createLocation("Piha", 1)
#            createLocation("Etelakarki", 1)
#            createLocation("Metsa", 1)
#            createLocation("Luoto Gou", 1)
#            createLocation("Korkein kohta", 2)
#            createLocation("Lansireitti", 2)
#            print('Lintuasema luotu')
#        except Exception as e:
#            print(e)

#     return app


# def init_testapp():

#     app = Flask(__name__, static_folder='../build', static_url_path='/')
#     cors = CORS(app)

#     login_manager = LoginManager()
#     login_manager.init_app(app)
#     app.config["SECRET_KEY"] = urandom(32)
#     app.config['LOGIN_DISABLED'] = True

#     @login_manager.user_loader
#     def load_user(user_id):
#         return User.query.get(user_id)

#     try:
#         app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///:memory:'
#         app.config["SQLALCHEMY_ECHO"] = True
#         print('Testitietokantayhteys luotu.')
#     except Exception as e:
#         print(e)
    
    

#     app.register_blueprint(api_blueprint)
    
#     db.init_app(app) #db siirretty omaksi luokaksi, että se näkyy kaikille, jostain syystä init_app() systeemillä tehtäessä se ei näy. kaikkiin models.py tiedostoihin from app.db import db
#     with app.app_context(): #appioliota käyttäen luodaan tietokantataulut, tämä googlesta
#        try:
#            #db.reflect()
#            #db.drop_all()
#            db.create_all()
#            print('Taulut luotu')
#            createObservatory("Hangon Lintuasema")
#            createObservatory("Jurmon Lintuasema")
#            createLocation("Bunkkeri", 1)
#            createLocation("Piha", 1)
#            createLocation("Etelakarki", 1)
#            createLocation("Metsa", 1)
#            createLocation("Luoto Gou", 1)
#            createLocation("Korkein kohta", 2)
#            createLocation("Lansireitti", 2)
#            print('Testilintuasema luotu')
#        except Exception as e:
#            print(e)

#     return app
