from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.shorthand.models import Shorthand
from app.api.classes.observation.models import Observation
from app.api.classes.observationperiod.models import Observationperiod

from app.api import bp
from app.db import db

from sqlalchemy.sql import text

@bp.route('/api/addShorthand', methods=['POST'])
@login_required
def addShorthand():
    req = request.get_json()
    shorthand = Shorthand(shorthandrow=req['row'],
        observationperiod_id=req['observationperiod_id'])
    db.session().add(shorthand)
    db.session().commit()

    shorthand_id = Shorthand.query.filter_by(shorthandrow = req['row'], observationperiod_id = req['observationperiod_id']).first().id

    return jsonify({ 'id': shorthand_id })

@bp.route('/api/getShorthands', methods=["GET"])
@login_required
def getShorthands():
    shorthands = Shorthand.query.all()
    ret = []
    for shorthand in shorthands:
        ret.append({ 'id': shorthand.id, 'row': shorthand.shorthandrow, 'observationperiod_id': shorthand.observationperiod_id})

    return jsonify(ret)

@bp.route('/api/getShorthandText/<day_id>', methods=["GET"])
@login_required
def getShorthandsForEditing(day_id):
    stmt = text("SELECT Shorthand.id AS shorthand_id,"
                " Shorthand.shorthandrow,"
                " Shorthand.observationperiod_id,"
                " Observation.id AS observation_id,"
                " Observationperiod.start_time, Observationperiod.end_time" 
                " FROM Shorthand"
                " JOIN Observationperiod ON Observationperiod.id = Shorthand.observationperiod_id"
                " JOIN Observation ON Observation.shorthand_id = Shorthand.id"
                " JOIN Day ON Day.id = Observationperiod.day_id"
                " WHERE Day.id = :dayId"
                " ORDER BY Observationperiod.id, Shorthand.id").params(dayId = day_id)

    res = db.engine.execute(stmt)

    response = []

    # for row in res:
    #     response.append({'row': str(row)})

    # return jsonify(response)



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
            startTime = row.start_time
            endTime = row.end_time
            shorthandText = row.shorthandrow
        index = index + 1
        if row.shorthand_id != shorthandId:
            shorthandList.append({
                'shorthand_id': shorthandId,
                'shorthand_text': shorthandText,
                'observations': observationList.copy()
                 })
            observationList.clear()
            shorthandId = row.shorthand_id
        if row.observationperiod_id != obsPeriodId:
            obsPeriodList.append({
                'obsPeriodId': obsPeriodId,
                'startTime': startTime,
                'endTime': endTime,
                'shorthands': shorthandList.copy()
            })
            shorthandList.clear()
            obsPeriodId = row.observationperiod_id
        
        observationList.append({'id': row.observation_id})
        startTime = row.start_time
        endTime = row.end_time
        shorthandText = row.shorthandrow
    
    shorthandList.append({
        'shorthand_id': shorthandId,
        'shorthand_text': shorthandText,
        'observations': observationList.copy()
        })
    observationList.clear()

    obsPeriodList.append({
        'obsPeriodId': obsPeriodId,
        'startTime': startTime,
        'endTime': endTime,
        'shorthands': shorthandList.copy()
        })
    shorthandList.clear()

    return jsonify(obsPeriodList)

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
    #db.session.query(Shorthand).filter(Shorthand.id == shorthand_id).delete()
    db.session.commit()
    return jsonify(req)
