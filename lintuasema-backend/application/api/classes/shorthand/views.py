from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from application.api.classes.shorthand.models import Shorthand
from application.api.classes.observation.models import Observation
from application.api.classes.observation.services import deleteObservation
from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.shorthand.services import editShorthand

from application.api import bp
from application.db import db, prefix

from sqlalchemy.sql import text


@bp.route('/api/addShorthand', methods=['POST'])
@login_required
def addShorthand():
    req = request.get_json()
    shorthand = Shorthand(shorthandblock=req['block'],
        observationperiod_id=req['observationperiod_id'])
    db.session().add(shorthand)
    db.session().commit()

    shorthand_id = Shorthand.query.filter_by(
        shorthandblock=req['block'], observationperiod_id=req['observationperiod_id']).first().id

    return jsonify({'id': shorthand_id})


@bp.route('/api/getShorthands', methods=["GET"])
@login_required
def getShorthands():
    shorthands = Shorthand.query.filter(is_deleted=0).all()
    ret = []
    for shorthand in shorthands:
        ret.append({'id': shorthand.id, 'block': shorthand.shorthandblock,
                   'observationperiod_id': shorthand.observationperiod_id})

    return jsonify(ret)


#TO BE REFACTORED TOGETHER WITH FRONTEND CHANGES
@bp.route('/api/getShorthandText/<obsday_id>/<type_name>/<location_name>', methods=["GET"])
@login_required
def getShorthandsForEditing(obsday_id, type_name, location_name):
    stmt = text("SELECT " + prefix + "Shorthand.id AS shorthand_id,"
                " " + prefix + "Shorthand.shorthandblock,"
                " " + prefix + "Shorthand.observationperiod_id,"
                " " + prefix + "Observation.id AS observation_id,"
                " " + prefix + "Observationperiod.start_time, " + prefix + "Observationperiod.end_time"
                " FROM " + prefix + "Shorthand"
                " JOIN " + prefix + "Observationperiod ON " + prefix + "Observationperiod.id = " + prefix + "Shorthand.observationperiod_id"
                " JOIN " + prefix + "Type ON " + prefix + "Observationperiod.type_id = " + prefix + "Type.id"
                " JOIN " + prefix + "Location ON " + prefix + "Observationperiod.location_id = " + prefix + "Location.id"
                " JOIN " + prefix + "Observation ON " + prefix + "Observation.shorthand_id = " + prefix + "Shorthand.id"
                " JOIN " + prefix + "Observatoryday ON " + prefix + "Observatoryday.id = " + prefix + "Observationperiod.observatoryday_id"
                " WHERE " + prefix + "Observatoryday.id = :dayId"
                " AND " + prefix + "Type.name = :type"
                " AND " + prefix + "Location.name = :location"
                " AND " + prefix + "Shorthand.is_deleted = 0"
                " AND " + prefix + "Observationperiod.is_deleted = 0"
                " AND " + prefix + "Type.is_deleted = 0"
                " AND " + prefix + "Location.is_deleted = 0"
                " AND " + prefix + "Observation.is_deleted = 0"
                " AND " + prefix + "Observatoryday.is_deleted = 0"
                " ORDER BY " + prefix + "Observationperiod.id, shorthand_id").params(dayId=obsday_id, type=type_name, location=location_name)

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
            shorthandText = row.shorthandblock

        index = index + 1

        if row.shorthand_id != shorthandId:

            addToShorthandList(shorthandList, shorthandId,
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
        shorthandText = row.shorthandblock

    addToShorthandList(shorthandList, shorthandId, shorthandText, observationList)
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


def addToShorthandList(shorthandlist, id, text, observations):
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
    ret.append({ 'id': shorthand.id, 'block': shorthand.shorthandblock, 'observationperiod_id': shorthand.observationperiod_id})
    return jsonify(ret)

@bp.route('/api/getShorthandByObsPeriod/<obsperiod_id>/', methods=["GET"])
@login_required
def getShorthandByObsPeriod(obsperiod_id):
    shorthandblocks = Shorthand.query.filter(Shorthand.observationperiod_id == obsperiod_id, Shorthand.is_deleted == 0).order_by(Shorthand.id).all()
    ret = []
    for row in shorthandblocks:
        ret.append({ 'id': row.id, 'shorthandBlock': row.shorthandblock })
    return jsonify(ret)

@bp.route("/api/deleteShorthand", methods=["DELETE"])
@login_required
def shorthand_delete():
    req = request.get_json()
    shorthand_id = req['shorthand_id']
    deleted_shorthand = Shorthand.query.get(shorthand_id)
    deleted_shorthand.is_deleted = 1
    db.session.commit()
    return jsonify(req)

@bp.route('/api/editShorthand/<shorthand_id>', methods=['POST'])
@login_required
def edit_shorthand(shorthand_id):
    req = request.get_json()
    new_block = req['block']

    id = editShorthand(shorthand_id, new_block)

    return jsonify({"id" : id})
