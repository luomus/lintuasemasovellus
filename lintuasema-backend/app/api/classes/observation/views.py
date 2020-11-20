from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.observation.models import Observation
from app.api.classes.observationperiod.models import Observationperiod
from app.api.classes.observation.services import parseCountString

from app.api import bp
from app.db import db
from sqlalchemy.sql import text

@bp.route('/api/addObservation', methods=['POST'])
@login_required
def addObservation():
    req = request.get_json()

    birdCount = req['adultUnknownCount'] + req['adultFemaleCount'] + req['adultMaleCount'] + req['juvenileUnknownCount'] + req['juvenileFemaleCount'] + req['juvenileMaleCount'] + req['subadultUnknownCount'] + req['subadultFemaleCount'] + req['subadultMaleCount'] + req['unknownUnknownCount'] + req['unknownFemaleCount'] + req['unknownMaleCount']

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
        total_count = birdCount,
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
    observations = Observation.query.all()
    ret = []
    for obs in observations:
        ret.append({ 'species': obs.species, 'adultUnknownCount': obs.adultUnknownCount, 'adultFemaleCount': obs.adultFemaleCount, 'adultMaleCount': obs.adultMaleCount,
            'juvenileUnknownCount': obs.juvenileUnknownCount, 'juvenileFemaleCount': obs.juvenileFemaleCount, 'juvenileMaleCount': obs.juvenileMaleCount,
            'subadultUnknownCount': obs.subadultUnknownCount, 'subadultFemaleCount': obs.subadultFemaleCount, 'subadultMaleCount': obs.subadultMaleCount,
            'unknownUnknownCount': obs.unknownUnknownCount, 'unknownFemaleCount': obs.unknownFemaleCount, 'unknownMaleCount': obs.unknownMaleCount, 'total_count' :obs.total_count,
            'direction': obs.direction, 'bypassSide': obs.bypassSide, 'notes': obs.notes, 
            'observationperiod_id': obs.observationperiod_id, 'shorthand_id': obs.shorthand_id})

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
    print(req)
    shorthand_id = req['shorthand_id']
    Observation.query.filter_by(shorthand_id=shorthand_id).delete()
    #db.session.query(Observation).filter(Observation.shorthand_id == shorthand_id).delete()
    db.session.commit()
    return jsonify(req)


@bp.route('/api/getObservationSummary/<day_id>', methods=["GET"])
@login_required
def getSummary(day_id):
    stmt = text("SELECT Observation.species,"
                " SUM(CASE WHEN (Type.name = :const OR Type.name = :other OR Type.name = :night) THEN total_count ELSE 0 END) AS allMigration,"
                " SUM(CASE WHEN Type.name = :const THEN total_count ELSE 0 END) AS constMigration,"
                " SUM(CASE WHEN Type.name = :other THEN total_count ELSE 0 END) AS otherMigration,"
                " SUM(CASE WHEN Type.name = :night THEN total_count ELSE 0 END) AS nightMigration,"
                " SUM(CASE WHEN Type.name = :scatter THEN total_count ELSE 0 END) AS scatterObs,"
                " SUM(CASE WHEN Type.name = :local THEN total_count ELSE 0 END) AS totalLocal,"
                " SUM(CASE WHEN (Type.name = :local AND Location.name <> :gou) THEN total_count ELSE 0 END) AS LocalOther,"
                " SUM(CASE WHEN (Type.name = :local AND Location.name = :gou) THEN total_count ELSE 0 END) AS LocalGou"
                " FROM Observation"
                " LEFT JOIN Observationperiod ON Observationperiod.id = Observation.observationperiod_id"
                " LEFT JOIN Type ON Type.id = Observationperiod.type_id"
                " LEFT JOIN Location ON Location.id = Observationperiod.location_id"
                " WHERE Observationperiod.day_id = :day_id"
                " GROUP BY Observation.species").params(day_id = day_id, 
                    const = "Vakio", other = "Muu muutto", night = "Yömuutto", scatter = "Hajahavainto",
                    local = "Paikallinen", gou = "Luoto Gåu")

    res = db.engine.execute(stmt)

    response = []

    for row in res:
        response.append({"species" :row[0], 
            "allMigration":row[1],
            "constMigration":row[2], 
            "otherMigration":row[3],
            "nightMigration":row[4],
            "scatterObs":row[5],
            "totalLocal":row[6],
            "localOther":row[7],
            "localGåu":row[8]})
  
    return jsonify(response)
  