from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from application.api.classes.observation.models import Observation
from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observation.services import parseCountString, addObservationToDb, getDaySummary

from application.api import bp
from application.db import db
from sqlalchemy.sql import text

@bp.route('/api/addObservation', methods=['POST'])
@login_required
def addObservation():
    req = request.get_json()
    
    addObservationToDb(req)

    return jsonify(req)


@bp.route('/api/getObservations', methods=["GET"])
@login_required
def getObservations():
    observations = Observation.query.all()
    ret = []
    for obs in observations:
        ret.append({ 'species': obs.species, 'adultUnknownCount': obs.adultUnknownCount, 'adultFemaleCount': obs.adultFemaleCount, 'adultMaleCount': obs.adultMaleCount,
            'juvenileUnknownCount': obs.juvenileUnknownCount, 'juvenileFemaleCount': obs.juvenileFemaleCount, 'juvenileMaleCount': obs.juvenileMaleCount,
            'subadultUnknownCount': obs.subadultUnknownCount, 'subadultFemaleCount': obs.subadultFemaleCount, 'subadultMaleCount': obs.subadultMaleCount,
            'unknownUnknownCount': obs.unknownUnknownCount, 'unknownFemaleCount': obs.unknownFemaleCount, 'unknownMaleCount': obs.unknownMaleCount, 'total_count' :obs.total_count,
            'direction': obs.direction, 'bypassSide': obs.bypassSide, 'notes': obs.notes, 
            'observationperiod_id': obs.observationperiod_id, 'shorthand_id': obs.shorthand_id, 'account_id': obs.account_id})

    return jsonify(ret)

@bp.route('/api/getObservations/<observationperiod_id>', methods=["GET"]) 
@login_required
def getObservationsByObservationPeriod(observationperiod_id):
    
    observations = Observation.query.filter_by(observationperiod_id = observationperiod_id)
    ret = []
    for observation in observations:
        countString = parseCountString(observation)
        ret.append({ 'species': observation.species, 'count': countString, 'direction': observation.direction, 'bypassSide': observation.bypassSide})
    return jsonify(ret)


@bp.route("/api/deleteObservations", methods=["DELETE"])
@login_required
def observations_delete():
    req = request.get_json()
    shorthand_id = req['shorthand_id']
    Observation.query.filter_by(shorthand_id=shorthand_id).delete()
    db.session.commit()
    return jsonify(req)


@bp.route('/api/getObservationSummary/<day_id>', methods=["GET"])
@login_required
def getSummary(day_id):
    
    response = getDaySummary(day_id)
  
    return response
  