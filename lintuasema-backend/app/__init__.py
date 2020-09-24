from flask import Flask, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.engine import create_engine
from app.api import bp as api_blueprint
from app.api.classes.day import models
from app.api.classes.location import models
from app.api.classes.observationsession import models
from app.api.classes.observationstation import models
from app.api.classes.user import models
from app.db import db

from app.api.classes.observationsession import views
from app.api.classes.day import views

import cx_Oracle
import app.oracleConfig

def init_app():
    
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    

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
       except Exception as e:
           print(e)

    return app