from application.api.classes.account.models import Account
from application.api.classes.account.classes import LoggedInUser

from application.api import bp
from application.db import db

import os
import requests
from flask import (
    request, redirect,
    make_response, jsonify)
from flask_login import login_user, logout_user, current_user, login_required, user_logged_in


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

    user_account = Account.query.filter_by(userId=userId).first()
    if not user_account:
        user_account = Account(userId=userId, fullName=name, email=email)
        db.session().add(user_account)
        db.session().commit()

    user = LoggedInUser(personToken, userId)
    login_user(user)

    return redirect('/')


@bp.route('/logout', methods=['POST', 'GET'])
def logoutCleanup():
    req = requests.delete('{}person-token/{}'.format(LAJI_API_URL, current_user.person_token), params={ 'access_token': AUTH_TOKEN })
    logout_user()
    return redirect('/')

@bp.route('/get/token', methods=['GET', 'POST'])
@login_required
def getSessionToken():
    return jsonify(token=current_user.person_token)

@bp.route('/api/getPerson', methods=['GET'])
@login_required
def getPersonFromLaji():
    return requests.get('{}person/{}'.format(LAJI_API_URL, current_user.person_token), params={ 'access_token': AUTH_TOKEN }).json()

@bp.route('/loginRedirect', methods=['POST', 'GET'])
def login():
    return redirect('{}login?target={}&redirectMethod=GET&next='.format(LAJI_AUTH_URL, TARGET))

@bp.route('/api/getUser', methods=['GET'])
def getcurrentUser():
    if not current_user.is_authenticated:
        return jsonify('no user')
    user = Account.query.filter_by(userId=current_user.user_id).first()
    ret = []
    ret.append({'id': user.userId, 'name': user.fullName, 'email':user.email, 'observatory':user.observatory })
    return jsonify(ret)

@bp.route('/api/setUserObservatory', methods=['POST'])
@login_required
def setUserObservatory():
    req = request.get_json()
    user = Account.query.filter_by(userId=current_user.user_id).first()
    user.observatory = req['observatory']

    db.session().commit()

    ret = []
    ret.append({'id': user.userId, 'name': user.fullName, 'email':user.email, 'observatory':user.observatory })
    return jsonify(ret)
