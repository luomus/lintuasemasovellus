from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.observation.models import Observation
from app.api.classes.observationperiod.models import Observationperiod

from app.api import bp
from app.db import db

@bp.route('/api/addObservation', methods=['POST'])
@login_required
def addObservation():
    req = request.get_json()
    observation = Observation(species=req['species'], adultUnkownCount=req['adultUnknownCount'], adultFemaleCount=req['adultFemaleCount'], adultMaleCount=req['adultMaleCount'],
        juvenileUnkownCount=req['juvenileUnknownCount'], juvenileFemaleCount=req['juvenileFemaleCount'], juvenileMaleCount=req['juvenileMaleCount'],
        subadultUnkownCount=req['subadultUnknownCount'], subadultFemaleCount=req['subadultFemaleCount'], subadultMaleCount=req['subadultMaleCount'],
        unknownUnkownCount=req['unknownUnknownCount'], direction=req['direction'], bypassSide=req['bypassSide'], notes=req['notes'], observationperiod_id=req['observationperiod_id'])
    db.session().add(observation)
    db.session().commit()

    return redirect('/')

@bp.route('/api/getObservations', methods=["GET"])
@login_required
def getObservations():
    objects = Observation.query.all()
    ret = []
    for each in objects:
        ret.append({ 'species': each.species, 'adultUnknownCount': each.adultUnknownCount, 'adultFemaleCount': each.adultFemaleCount, 'adultMaleCount': each.adultMaleCount,
            'juvenileUnknownCount': each.juvenileUnknownCount, 'juvenileFemaleCount': each.juvenileFemaleCount, 'juvenileMaleCount': each.juvenileMaleCount,
            'subadultUnknownCount': each.subadultUnknownCount, 'subadultFemaleCount': each.subadultFemaleCount, 'subadultMaleCount': each.subadultMaleCount,
            'unknownUnknownCount': each.unknownUnknownCount, 'direction': each.direction, 'bypassSide': each.bypassSide, 'notes': each.notes, 'observationperiod_id': each.observationperiod_id})

    return jsonify(ret)