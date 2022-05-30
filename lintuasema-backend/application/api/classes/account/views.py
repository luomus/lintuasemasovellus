from application.api.classes.account.models import Account
from application.api.classes.observatory.models import Observatory

from application.api.classes.observatory.services import getObservatoryName

from application.api import bp
from application.db import db

import os
import requests
from flask import (Flask, render_template, 
    request, redirect, session, url_for,
    make_response, jsonify)
from flask_login import login_user, logout_user , current_user, login_required


AUTH_TOKEN = os.getenv('AUTH_TOKEN')
TARGET = os.getenv('TARGET')
allowedRoles = os.getenv('ALLOWED_ROLES', 'MA.haukkaUser,MA.admin').split(',')


@bp.route('/login', methods=['POST', 'GET'])
def loginconfirm():

    personToken = request.args.get('token')

    if personToken is None:
        return redirect('/')

    req = requests.get('https://apitest.laji.fi/v0/person/' + personToken + '?access_token=' + AUTH_TOKEN).json()

    userId = req['id']
    name = req['fullName']
    email = req['emailAddress']
    hasRole = any(x in req['role'] for x in allowedRoles)

    if not hasRole and allowedRoles != ['']:
        response = make_response(redirect('/'))
        response.set_cookie('showUserMessage', 'noRequiredRoles', max_age=120)
        return response

    user = Account.query.filter_by(userId=userId).first()
    if not user:
        user = Account(userId=userId, fullName=name, email=email)
        db.session().add(user)
        db.session().commit()

    login_user(user)

    session.permanent = True

    session['token'] = personToken
    
    return redirect('/')


@bp.route('/logout', methods=['POST', 'GET'])
def logoutCleanup():

    req = requests.delete('https://apitest.laji.fi/v0/person-token/' + session['token'] + '?access_token=' + AUTH_TOKEN)

    session.clear()
    session.pop('token', None)
    logout_user()
    return redirect('/')

@bp.route('/get/token', methods=['GET', 'POST'])
def getSessionToken():
    return jsonify(token=session['token'])

@bp.route('/api/getPerson', methods=['GET'])
def getPersonFromLaji():
    return requests.get('https://apitest.laji.fi/v0/person/' + session['token'] + '?access_token=' + AUTH_TOKEN).json()

@bp.route('/loginRedirect', methods=['POST', 'GET'])
def login():
    return redirect('https://fmnh-ws-test.it.helsinki.fi/laji-auth/login?target=%s&redirectMethod=GET&next=' % (TARGET))

@bp.route('/api/getUser', methods=['GET'])
def getcurrentUser():
    u = current_user.get_id()
    if not u:
        return jsonify('no user')
    user = Account.query.filter_by(id=u).first()
    ret = []
    ret.append({'id': user.userId, 'name': user.fullName, 'email':user.email, 'observatory':user.observatory })
    return jsonify(ret)

@bp.route('/api/setUserObservatory', methods=['POST'])
@login_required
def setUserObservatory():
    req = request.get_json()
    u = current_user.get_id()
    if not u:
        return jsonify('no user')
    user = Account.query.filter_by(id=u).first()
    user.observatory = req['observatory']

    db.session().commit()

    ret = []
    ret.append({'id': user.userId, 'name': user.fullName, 'email':user.email, 'observatory':user.observatory })
    return jsonify(ret)

# tarvitaan cypress testejä varten
@bp.route('/testlogin', methods=['POST', 'GET'])
def testloginconfirm():

    personToken = request.args.get('token')

    if personToken != "MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw":
        return redirect('/')

    userId = 'asdf'
    name = 'Lintu Asema'
    email = 'lintuasema@lintuasema.com'

    user = Account.query.filter_by(userId=userId).first()
    if not user:
        user = Account(userId=userId, fullName=name, email=email)
        db.session().add(user)
        db.session().commit()

    login_user(user)

    session.permanent = True

    session['token'] = personToken
    
    return redirect('/')

