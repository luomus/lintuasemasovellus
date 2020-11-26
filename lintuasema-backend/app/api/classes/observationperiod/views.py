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

    day = getDay(req['day_id'])
    obsId = day.observatory_id
    locId = getLocationId(req['location'], obsId)

    createType(req['observationType'], obsId)

    obsp = Observationperiod(
        start_time=datetime.strptime(req['startTime'], '%H:%M'),
        end_time=datetime.strptime(req['endTime'], '%H:%M'),
        type_id=getTypeIdByName(req['observationType']),
        location_id=locId, day_id=req['day_id'])#Tähän pitää lisätä pikakirjoitus sitten, kun se on frontissa tehty. Olio pitää luoda ennen tätä kohtaa (shorthand_id=req['shorthand_id'])
    db.session().add(obsp)
    #db.session().flush()
    #db.session().refresh(obsp)
    db.session().commit()

    #obspId = obsp.id
    obspId = getObsPerId(obsp.start_time, obsp.end_time, obsp.location_id, obsp.day_id)
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
            'day_id': obsPeriod.day_id
        })

    return jsonify(ret)


@bp.route('/api/getDaysObservationPeriods/<day_id>/', methods=["GET"]) #tietyn aseman tietyn päivän, tietyn tyypin havaintojaksot
@login_required
def getDaysObservationPeriods(day_id):

    stmt = text(" SELECT Observationperiod.id AS obsperiod_id,"
                " Observationperiod.start_time, Observationperiod.end_time,"
                " Type.name AS typename, Location.name AS locationname, Day.id AS day_id,"
                " COUNT(DISTINCT Observation.species) AS speciescount"
                " FROM Observationperiod"
                " JOIN Type ON Type.id = Observationperiod.type_id"
                " JOIN Location ON Location.id = Observationperiod.location_id"
                " JOIN Day ON Day.id = Observationperiod.day_id"
                " JOIN Observation ON Observation.observationperiod_id = Observationperiod.id"
                " WHERE Day.id = :dayId"
                " GROUP BY Observationperiod.id, Observationperiod.start_time,"
                " Observationperiod.end_time, Type.name, Location.name, Day.id"
                " ORDER BY Observationperiod.start_time").params(dayId = day_id)

    res = db.engine.execute(stmt)

    response = []

    for row in res:
        response.append({
            'id': row.obsperiod_id,
            'startTime': row.start_time,
            'endTime': row.end_time,
            'observationType': row.typename,
            'location': row.locationname,
            'day_id': row.day_id,
            'speciesCount': row.speciescount
        })
  
    return jsonify(response)



    type_id = getTypeIdByName(observationType)

    console.log('Tyypin id: ', type_id)

    daysObservationPeriods = Observationperiod.query.filter_by(day_id = day_id)
    ret = []
    for obsPeriod in daysObservationPeriods:
        ret.append({
            'id': obsPeriod.id,
            'startTime': obsPeriod.start_time,
            'endTime': obsPeriod.end_time,
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
                'startTime': obsPeriod.start_time,
                'endTime': obsPeriod.end_time,
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
                'startTime': obsPeriod.start_time,
                'endTime': obsPeriod.end_time,
                'observationType': obspType,
                'location': getLocationName(obsPeriod.location_id),
                'day_id': obsPeriod.day_id
            })

    return jsonify(ret)