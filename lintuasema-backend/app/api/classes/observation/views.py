from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.observation.models import Observation
from app.api.classes.observationperiod.models import Observationperiod
from app.api.classes.observation.services import parseCountString

from app.api import bp
from app.db import db

@bp.route('/api/addObservation', methods=['POST'])
@login_required
def addObservation():
    req = request.get_json()
    observation = Observation(species=req['species'],
        adultUnknownCount=req['adultUnknownCount'],
        adultFemaleCount=req['adultFemaleCount'],
        adultMaleCount=req['adultMaleCount'],
        juvenileUnknownCount=req['juvenileUnknownCount'],
        juvenileFemaleCount=req['juvenileFemaleCount'],
        juvenileMaleCount=req['juvenileMaleCount'],
        subadultUnknownCount=req['subadultUnknownCount'],
        subadultFemaleCount=req['subadultFemaleCount'],
        subadultMaleCount=req['subadultMaleCount'],
        unknownUnknownCount=req['unknownUnknownCount'],
        unknownFemaleCount=req['unknownFemaleCount'],
        unknownMaleCount=req['unknownMaleCount'],
        direction=req['direction'],
        bypassSide=req['bypassSide'],
        notes=req['notes'],
        observationperiod_id=req['observationperiod_id'],
        shorthand_id=req['shorthand_id'])
    db.session().add(observation)
    #db.session().flush()
    #db.session().refresh(observation)
    db.session().commit()

    #return jsonify({ 'id': observation.id })
    return jsonify(req)

@bp.route('/api/getObservations', methods=["GET"])
@login_required
def getObservations():
    objects = Observation.query.all()
    ret = []
    for each in objects:
        ret.append({ 'species': each.species, 'adultUnknownCount': each.adultUnknownCount, 'adultFemaleCount': each.adultFemaleCount, 'adultMaleCount': each.adultMaleCount,
            'juvenileUnknownCount': each.juvenileUnknownCount, 'juvenileFemaleCount': each.juvenileFemaleCount, 'juvenileMaleCount': each.juvenileMaleCount,
            'subadultUnknownCount': each.subadultUnknownCount, 'subadultFemaleCount': each.subadultFemaleCount, 'subadultMaleCount': each.subadultMaleCount,
            'unknownUnknownCount': each.unknownUnknownCount, 'unknownFemaleCount': each.unknownFemaleCount, 'unknownMaleCount': each.unknownMaleCount, 
            'direction': each.direction, 'bypassSide': each.bypassSide, 'notes': each.notes, 
            'observationperiod_id': each.observationperiod_id, 'shorthand_id': each.shorthand_id})

    return jsonify(ret)

@bp.route('/api/getObservations/<observationperiod_id>', methods=["GET"]) 
@login_required
def getObservationsByObservationPeriod(observationperiod_id):
    # observations = Observation.query.filter_by(observationperiod_id = observationperiod_id)
    # ret = []
    # for each in observations:
    #     ret.append({ 'species': each.species, 'adultUnknownCount': each.adultUnknownCount, 'adultFemaleCount': each.adultFemaleCount, 'adultMaleCount': each.adultMaleCount,
    #         'juvenileUnknownCount': each.juvenileUnknownCount, 'juvenileFemaleCount': each.juvenileFemaleCount, 'juvenileMaleCount': each.juvenileMaleCount,
    #         'subadultUnknownCount': each.subadultUnknownCount, 'subadultFemaleCount': each.subadultFemaleCount, 'subadultMaleCount': each.subadultMaleCount,
    #         'unknownUnknownCount': each.unknownUnknownCount, 'unknownFemaleCount': each.unknownFemaleCount, 'unknownMaleCount': each.unknownMaleCount, 'direction': each.direction, 'bypassSide': each.bypassSide, 'notes': each.notes, 'observationperiod_id': each.observationperiod_id})

    # return jsonify(ret)

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
    print('moiiii' + req['shorthand_id'])
    shorthand_id = req['shorthand_id']
    Observation.query.filter_by(shorthand_id=shorthand_id).delete()
    #db.session.query(Observation).filter(Observation.shorthand_id == shorthand_id).delete()
    db.session.commit()
    return jsonify(req)