from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from application.api.classes.shorthand.models import Shorthand
from application.api.classes.observation.models import Observation
from application.api.classes.observation.services import deleteObservation
from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.shorthand.services import deleteShorthand, editShorthand

from application.api import bp
from application.db import db

from sqlalchemy.sql import text


@bp.route('/api/addShorthand', methods=['POST'])
@login_required
def addShorthand():
    req = request.get_json()
    shorthand = Shorthand(shorthandrow=req['row'],
        observationperiod_id=req['observationperiod_id'])
    db.session().add(shorthand)
    db.session().commit()

    shorthand_id = Shorthand.query.filter_by(
        shorthandrow=req['row'], observationperiod_id=req['observationperiod_id']).first().id

    return jsonify({'id': shorthand_id})


@bp.route('/api/getShorthands', methods=["GET"])
@login_required
def getShorthands():
    shorthands = Shorthand.query.all()
    ret = []
    for shorthand in shorthands:
        ret.append({'id': shorthand.id, 'row': shorthand.shorthandrow,
                   'observationperiod_id': shorthand.observationperiod_id})

    return jsonify(ret)


@bp.route('/api/getShorthandText/<day_id>/<type_name>/<location_name>', methods=["GET"])
@login_required
def getShorthandsForEditing(day_id, type_name, location_name):
    stmt = text("SELECT v2_Shorthand.id AS shorthand_id,"
                " v2_Shorthand.shorthandrow,"
                " v2_Shorthand.observationperiod_id,"
                " v2_Observation.id AS observation_id,"
                " v2_Observationperiod.start_time, v2_Observationperiod.end_time"
                " FROM v2_Shorthand"
                " JOIN v2_Observationperiod ON v2_Observationperiod.id = v2_Shorthand.observationperiod_id"
                " JOIN v2_Type ON v2_Observationperiod.type_id = v2_Type.id"
                " JOIN v2_Location ON v2_Observationperiod.location_id = v2_Location.id"
                " JOIN v2_Observation ON v2_Observation.shorthand_id = v2_Shorthand.id"
                " JOIN v2_Day ON v2_Day.id = v2_Observationperiod.day_id"
                " WHERE v2_Day.id = :dayId"
                " AND v2_Type.name = :type"
                " AND v2_Location.name = :location"
                " AND v2_Shorthand.is_deleted = 0"
                " AND v2_Observationperiod.is_deleted = 0"
                " AND v2_Type.is_deleted = 0"
                " AND v2_Location.is_deleted = 0"
                " AND v2_Observation.is_deleted = 0"
                " AND v2_Day.is_deleted = 0"
                " ORDER BY v2_Observationperiod.id, shorthand_id").params(dayId=day_id, type=type_name, location=location_name)

    res = db.engine.execute(stmt)

    obsPeriodList = createObsperiodList(res)

    return jsonify(obsPeriodList)

def createObsperiodList(res):

    index = 0
    shorthandId = 0
    obsPeriodId = 0
    startTime = ''
    endTime = ''
    shorthandText = ''
    observationList = []
    shorthandList = []
    obsPeriodList = []

    for row in res:

        if index == 0:

            shorthandId = row.shorthand_id
            obsPeriodId = row.observationperiod_id
            startTime = formatTime(row.start_time)
            endTime = formatTime(row.end_time)
            shorthandText = row.shorthandrow

        index = index + 1

        if row.shorthand_id != shorthandId:

            addShorthand(shorthandList, shorthandId,
                         shorthandText, observationList)
            observationList.clear()
            shorthandId = row.shorthand_id

        if row.observationperiod_id != obsPeriodId:

            addObsPeriod(obsPeriodList, obsPeriodId,
                         startTime, endTime, shorthandList)
            shorthandList.clear()
            obsPeriodId = row.observationperiod_id

        observationList.append({'id': row.observation_id})
        startTime = formatTime(row.start_time)
        endTime = formatTime(row.end_time)
        shorthandText = row.shorthandrow

    addShorthand(shorthandList, shorthandId, shorthandText, observationList)
    observationList.clear()

    addObsPeriod(obsPeriodList, obsPeriodId, startTime, endTime, shorthandList)
    shorthandList.clear()

    return obsPeriodList


def formatTime(time):
    hours = ""
    minutes = ""

    if isinstance(time, str):
        timeArray = time.split(':')
        hours = timeArray[0][-2:]
        minutes = timeArray[1][0:2]
    else:
        hours = time.strftime('%H')
        minutes = time.strftime('%M')

    return hours + ':' + minutes


def addShorthand(shorthandlist, id, text, observations):
    shorthandlist.append({
        'shorthand_id': id,
        'shorthand_text': text,
        'observations': observations.copy()
        })

def addObsPeriod(obsperiodlist, id, start, end, shorthands):
    obsperiodlist.append({
        'obsPeriodId': id,
        'startTime': start,
        'endTime': end,
        'shorthands': shorthands.copy()
        })

@bp.route('/api/getShorthand/<shorthand_id>', methods=["GET"])
@login_required
def getShorthandById(shorthand_id):
    shorthand = Shorthand.query.get(shorthand_id)
    ret = []
    ret.append({ 'id': shorthand.id, 'row': shorthand.shorthandrow, 'observationperiod_id': shorthand.observationperiod_id})
    return jsonify(ret)

@bp.route("/api/deleteShorthand", methods=["DELETE"])
@login_required
def shorthand_delete():
    req = request.get_json()
    shorthand_id = req['shorthand_id']
    Shorthand.query.filter_by(id=shorthand_id).delete()
    db.session.commit()
    return jsonify(req)
    #req = request.get_json()
    #shorthand_id = req['shorthand_id']
    #deleteShorthand(shorthand_id)
    #return jsonify("")

@bp.route('/api/editShorthand/<shorthand_id>', methods=['POST'])
@login_required
def edit_shorthand(shorthand_id):
    req = request.get_json()
    new_row = req['shorthandrow']

    id = editShorthand(shorthand_id)

    return jsonify({"id" : id})
