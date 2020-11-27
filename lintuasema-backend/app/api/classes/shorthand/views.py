from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.shorthand.models import Shorthand
from app.api.classes.observation.models import Observation
from app.api.classes.observationperiod.models import Observationperiod
from app.api.classes.shorthand.services import deleteShorthand

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
    observationperiod = []
    shorthands = []
    observationIds = []

    index = 0
    formerObsPeriodId = 0
    currentObsPeriodId = 0

    # for row in res:
    #     print("obsId = " + str(row.observation_id))
    #     if len(response) == 0 or response[-1].get('obsperiod_id') != row.observationperiod_id:
    #             #addObservationId(observationIds, row)
    #             addShorthand(shorthands, observationIds, row)
    #             response.append({
    #                 'obsperiod_id': row.observationperiod_id,
    #                 'obserperiod_startTime': row.start_time,
    #                 'obsperiod_endTime': row.end_time,
    #                 'shorthands': shorthands.copy()
    #             })
    #             shorthands.clear()
    #             #observationIds.clear()

    #     else:
    #         #addObservationId(observationIds, row)
    #         addShorthand(shorthands, observationIds, row)
    # for row in res:
    #     #response.append({'row': str(row)})
    #     if len(response) == 0 or response[-1].get('obsperiod_id') != row.observationperiod_id:
    #         response.append({
    #             'obsperiod_id': row.observationperiod_id,
    #             'obserperiod_startTime': row.start_time,
    #             'obsperiod_endTime': row.end_time,
    #             'shorthands': shorthands.copy()
    #         })
    #         shorthands.clear()
    #         addShorthand(shorthands, observationIds, row)
    #     else:
    #         addShorthand(shorthands, observationIds, row)

    return jsonify(response)


# def addShorthand(shorthands, observationIds, row):
#    # if len(shorthands) == 0 or shorthands[-1].get('shorthand_id') != row.shorthand_id:
#     shorthands.append({
#         'shorthand_id': row.shorthand_id,
#         'shorthand_text': row.shorthandrow,
#     })

# def addObservationId(observationIds, row):
#     observationIds.append({
#         'observation_id': row.observation_id
#     }) 

@bp.route('/api/getShorthand/<shorthand_id>', methods=["GET"])
@login_required
def getShorthandById(shorthand_id):
    shorthand = Shorthand.query.get(shorthand_id)
    ret = []
    ret.append({ 'id': shorthand.id, 'row': shorthand.shorthandrow, 'observationperiod_id': shorthand.observationperiod_id})
    return jsonify(ret)

@bp.route("/api/deleteShorthand", methods=["POST"])
@login_required
def shorthand_delete():
    req = request.get_json()
    shorthand_id = req['shorthand_id']
    deleteShorthand(shorthand_id)
    return jsonify(req)
