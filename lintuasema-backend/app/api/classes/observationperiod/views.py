from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.observationperiod.models import Observationperiod
from app.api.classes.day.models import Day
from app.api.classes.observatory.models import Observatory
from app.api.classes.location.services import getLocationId, getLocationName
from app.api.classes.observationperiod.services import getObsPerId
from app.api.classes.day.services import getDay

from app.api import bp
from app.db import db

from datetime import datetime

@bp.route('/api/addObservationPeriod', methods=['POST'])
@login_required
def addObservationPeriod():
    req = request.get_json()
    '''
    Ainakin sqlite-moottorissa tietokanta hyväksyy vain
    Pythonin omia datetime-olioita...
    '''

    day = getDay(req['day_id'])
    obsId = day.observatory_id
    locId = getLocationId(req['location'], obsId)

    obsp = Observationperiod(
        startTime=datetime.strptime(req['startTime'], '%H:%M'),
        endTime=datetime.strptime(req['endTime'], '%H:%M'),
        observationType=req['observationType'],
        location_id=locId, day_id=req['day_id'])
    db.session().add(obsp)
    db.session().commit()

    obspId = getObsPerId(obsp.startTime, obsp.endTime, obsp.location_id, obsp.day_id)
    print(obspId)
    return jsonify({ 'id': obspId })

@bp.route('/api/getObservationPeriods', methods=["GET"])
@login_required
def getObservationPeriods():
    observationPeriods = Observationperiod.query.all()
    ret = []
    for obsPeriod in observationPeriods:
        ret.append({ 'startTime': obsPeriod.startTime, 'endTime': obsPeriod.endTime,
        'observationType': obsPeriod.observationType, 'location': getLocationName(obsPeriod.location_id), 'day_id': obsPeriod.day_id })

    return jsonify(ret)

