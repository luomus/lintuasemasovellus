from flask import Flask, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.engine import create_engine
from app.api import bp as api_blueprint

import cx_Oracle
import app.oracleConfig

def init_app():
    app = Flask(__name__, static_folder='../build', static_url_path='/')

    dnsStr = cx_Oracle.makedsn('oracle.luomus.fi', 1521, service_name='oracle.luomus.fi')
    dnsStr = dnsStr.replace('SID', 'SERVICE_TYPE')
    
    app.config["SQLALCHEMY_DATABASE_URI"] = "oracle://"+oracleConfig.username+":"+oracleConfig.password+"@"+dnsStr
    app.config["SQLALCHEMY_ECHO"] = True

   
    app.register_blueprint(api_blueprint)
    db = SQLAlchemy(app)

    from app.classes.day import models
    from app.classes.location import models
    from app.classes.observationsession import models
    from app.classes.observationstation import models
    from app.classes.user import models
    
    db.create_all()
    res = db.engine.execute("SELECT 1 FROM DUAL") #oraclen erikoistietokantataulu, jossa aina yksi rivi ja yksi sarake
    print (res)
    return app
