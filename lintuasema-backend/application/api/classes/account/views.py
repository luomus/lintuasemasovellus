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
LAJI_AUTH_URL = os.getenv('LAJI_AUTH_URL')
LAJI_API_URL = os.getenv('LAJI_API_URL')


@bp.route('/login', methods=['POST', 'GET'])
def loginconfirm():

    personToken = request.args.get('token')

    if personToken is None:
        return redirect('/')

    req = requests.get('{}person/{}'.format(LAJI_API_URL, personToken), params={ 'access_token': AUTH_TOKEN }).json()
    userId = req['id']
    name = req['fullName']
    email = req['emailAddress']
    hasRole = any(x in req['role'] for x in allowedRoles) if "role" in req else False

    if not hasRole and allowedRoles != ['']:
        try:
            requests.delete('{}person-token/{}'.format(LAJI_API_URL, personToken), params={ 'access_token': AUTH_TOKEN })
        except:
            print("Error while logging out without roles")
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

    req = requests.delete('{}person-token/{}'.format(LAJI_API_URL, session['token']), params={ 'access_token': AUTH_TOKEN })

    session.clear()
    session.pop('token', None)
    logout_user()
    return redirect('/')

@bp.route('/get/token', methods=['GET', 'POST'])
def getSessionToken():
    return jsonify(token=session['token'])

@bp.route('/api/getPerson', methods=['GET'])
def getPersonFromLaji():
    return requests.get('{}person/{}'.format(LAJI_API_URL, session['token']), params={ 'access_token': AUTH_TOKEN }).json()

@bp.route('/loginRedirect', methods=['POST', 'GET'])
def login():
    return redirect('{}login?target={}&redirectMethod=GET&next='.format(LAJI_AUTH_URL, TARGET))

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
