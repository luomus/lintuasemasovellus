from app.api.classes.user.models import User

from app.api import bp
from app.db import db

import os
import requests
from flask import (Flask, render_template, 
    request, redirect, session, url_for,
    make_response, jsonify)


AUTH_TOKEN = os.getenv('AUTH_TOKEN')
TARGET = os.getenv('TARGET')


@bp.route('/login', methods=['POST', 'GET'])
def loginconfirm():
    personToken = request.args.get('token')

    req = requests.get('https://apitest.laji.fi/v0/person/' + personToken + '?access_token=' + AUTH_TOKEN)

    #print(req.text)
    values=req.text.split(',')
    userId = values[0].split(':')[1]
    name = values[1].split(':')[1]
    email = values[2].split(':')[1]
    user = User(userId=userId, fullName=name, email=email)

    db.session().add(user)
    db.session().commit()

    session['token'] = request.args.get('token')
    
    return redirect('/')

@bp.route('/logout', methods=['POST', 'GET'])
def logoutCleanup():
    session.pop('token', None)
    return redirect('/')

@bp.route('/get/token', methods=['GET', 'POST'])
def getSessionToken():
    return jsonify(token=session['token'], auth_token=AUTH_TOKEN)

@bp.route('/loginRedirect', methods=['POST', 'GET'])
def login():
    return redirect('https://fmnh-ws-test.it.helsinki.fi/laji-auth/login?target=%s&redirectMethod=GET&next=' % (TARGET))
    # return redirect('https://login.laji.fi/login?target=%s&redirectMethod=POST&next=/index' % (TARGET))