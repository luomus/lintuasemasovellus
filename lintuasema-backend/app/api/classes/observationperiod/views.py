from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.observationperiod.models import Observationperiod
from app.api.classes.day.models import Day
from app.api.classes.type.models import Type
from app.api.classes.observatory.models import Observatory
from app.api.classes.location.services import getLocationId, getLocationName
from app.api.classes.observationperiod.services import getObsPerId
from app.api.classes.day.services import getDay
from app.api.classes.type.services import getTypeIdByName, getTypeNameById, createType

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

    createType(req['observationType'], obsId)

    obsp = Observationperiod(
        startTime=datetime.strptime(req['startTime'], '%H:%M'),
        endTime=datetime.strptime(req['endTime'], '%H:%M'),
        type_id=getTypeIdByName(req['observationType']),
        location_id=locId, day_id=req['day_id'])#Tähän pitää lisätä pikakirjoitus sitten, kun se on frontissa tehty. Olio pitää luoda ennen tätä kohtaa (shorthand_id=req['shorthand_id'])
    db.session().add(obsp)
    #db.session().flush()
    #db.session().refresh(obsp)
    db.session().commit()

    #obspId = obsp.id
    obspId = getObsPerId(obsp.startTime, obsp.endTime, obsp.location_id, obsp.day_id)
    #print("havaintojakson id on", obspId)
    return jsonify({ 'id': obspId })

@bp.route('/api/getObservationPeriods', methods=["GET"])
@login_required
def getObservationPeriods():
    observationPeriods = Observationperiod.query.all()
    ret = []
    for obsPeriod in observationPeriods:
        ret.append(
        {
            'id': obsPeriod.id,
            'startTime': obsPeriod.startTime,
            'endTime': obsPeriod.endTime,
            'type_id': getTypeNameById(obsPeriod.type_id),
            'location': getLocationName(obsPeriod.location_id),
            'day_id': obsPeriod.day_id
        })

    return jsonify(ret)


@bp.route('/api/getDaysObservationPeriods/<day_id>/', methods=["GET"]) #tietyn aseman tietyn päivän, tietyn tyypin havaintojaksot
@login_required
def getDaysObservationPeriods(day_id):

    #type_id = getTypeIdByName(observationType)

    #console.log('Tyypin id: ', type_id)

    daysObservationPeriods = Observationperiod.query.filter_by(day_id = day_id)
    ret = []
    for obsPeriod in daysObservationPeriods:
        ret.append({
            'id': obsPeriod.id,
            'startTime': obsPeriod.startTime,
            'endTime': obsPeriod.endTime,
            'observationType': getTypeNameById(obsPeriod.type_id),
            'location': getLocationName(obsPeriod.location_id),
            'day_id': obsPeriod.day_id
        })

    return jsonify(ret)


@bp.route('/api/getDaysObservationPeriods/<day_id>/standard', methods=["GET"]) #tietyn aseman tietyn päivän, tietyn tyypin havaintojaksot
@login_required
def getDaysObservationPeriodsStandard(day_id):


    daysObservationPeriods = Observationperiod.query.filter_by(day_id = day_id)
    ret = []
    for obsPeriod in daysObservationPeriods:
        obspType = getTypeNameById(obsPeriod.type_id)
        if obspType == "Vakio":
            ret.append({
                'id': obsPeriod.id,
                'startTime': obsPeriod.startTime,
                'endTime': obsPeriod.endTime,
                'observationType': obspType,
                'location': getLocationName(obsPeriod.location_id),
                'day_id': obsPeriod.day_id
            })

    return jsonify(ret)

@bp.route('/api/getDaysObservationPeriods/<day_id>/other', methods=["GET"]) #tietyn aseman tietyn päivän, tietyn tyypin havaintojaksot
@login_required
def getDaysObservationPeriodsOther(day_id):


    daysObservationPeriods = Observationperiod.query.filter_by(day_id = day_id)
    ret = []
    for obsPeriod in daysObservationPeriods:
        obspType = getTypeNameById(obsPeriod.type_id)
        if obspType != "Vakio":
            ret.append({
                'id': obsPeriod.id,
                'startTime': obsPeriod.startTime,
                'endTime': obsPeriod.endTime,
                'observationType': obspType,
                'location': getLocationName(obsPeriod.location_id),
                'day_id': obsPeriod.day_id
            })

    return jsonify(ret)