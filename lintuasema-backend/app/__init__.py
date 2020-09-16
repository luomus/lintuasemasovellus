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

import cx_Oracle
import app.oracleConfig


def init_app():
    
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    return app

    dnsStr = cx_Oracle.makedsn('oracle.luomus.fi', 1521, service_name='oracle.luomus.fi')
    dnsStr = dnsStr.replace('SID', 'SERVICE_TYPE')

    app.config["SQLALCHEMY_DATABASE_URI"] = "oracle://"+oracleConfig.username+":"+oracleConfig.password+"@"+dnsStr
    app.config["SQLALCHEMY_ECHO"] = True


    app.register_blueprint(api_blueprint)
    
    db.init_app(app) #db siirretty omaksi luokaksi, että se näkyy kaikille, jostain syystä init_app() systeemillä tehtäessä se ei näy. kaikkiin models.py tiedostoihin from app.db import db
    with app.app_context(): #appioliota käyttäen luodaan tietokantataulut
        db.create_all()
  
    return app
