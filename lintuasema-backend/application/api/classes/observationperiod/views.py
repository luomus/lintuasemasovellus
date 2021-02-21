from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observatoryday.models import Observatoryday
from application.api.classes.type.models import Type
from application.api.classes.observatory.models import Observatory
from application.api.classes.location.services import getLocationId, getLocationName
from application.api.classes.observationperiod.services import getObsPerId, getObservationPeriodsByDayId
from application.api.classes.observatoryday.services import getDay
from application.api.classes.type.services import getTypeIdByName, getTypeNameById, createType

from application.api import bp
from application.db import db
from sqlalchemy.sql import text


from datetime import datetime

@bp.route('/api/addObservationPeriod', methods=['POST'])
@login_required
def addObservationPeriod():
    req = request.get_json()
    '''
    Ainakin sqlite-moottorissa tietokanta hyväksyy vain
    Pythonin omia datetime-olioita...
    '''

    obsday = getDay(req['day_id'])
    obsId = obsday.observatory_id
    locId = getLocationId(req['location'], obsId)

    createType(req['observationType'], obsId)

    obsp = Observationperiod(
        start_time=datetime.strptime(req['startTime'], '%H:%M'),
        end_time=datetime.strptime(req['endTime'], '%H:%M'),
        type_id=getTypeIdByName(req['observationType']),
        location_id=locId, observatoryday_id=req['day_id'])#Tähän pitää lisätä pikakirjoitus sitten, kun se on frontissa tehty. Olio pitää luoda ennen tätä kohtaa (shorthand_id=req['shorthand_id'])
    db.session().add(obsp)
    #db.session().flush()
    #db.session().refresh(obsp)
    db.session().commit()

    #obspId = obsp.id
    obspId = getObsPerId(obsp.start_time, obsp.end_time, obsp.location_id, obsp.observatoryday_id)
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
            'startTime': obsPeriod.start_time,
            'endTime': obsPeriod.end_time,
            'type_id': getTypeNameById(obsPeriod.type_id),
            'location': getLocationName(obsPeriod.location_id),
            'day_id': obsPeriod.observatoryday_id
        })

    return jsonify(ret)


@bp.route('/api/getDaysObservationPeriods/<day_id>/', methods=["GET"]) 
@login_required
def getDaysObservationPeriods(day_id):

    ret = getObservationPeriodsByDayId(day_id)
    return ret


@bp.route("/api/deleteObservationperiod", methods=["DELETE"])
@login_required
def observationperiod_delete():
    req = request.get_json()
    obsperiod_id = req['obsperiod_id']
    Observationperiod.query.filter_by(id=obsperiod_id).delete()
    db.session.commit()
    return jsonify(req)