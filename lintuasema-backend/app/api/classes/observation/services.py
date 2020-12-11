from app.api.classes.observation.models import Observation
from app.db import db
from flask import jsonify
from sqlalchemy.sql import text

def parseCountString(obs):
    
    countString = ""
    if obs.adultUnknownCount != 0:
        countString = countString + str(obs.adultUnknownCount) + " tunt. sukupuolta (aikuinen), "
    if obs.adultFemaleCount != 0:
        countString = countString + str(obs.adultFemaleCount) + " naarasta (aikuinen), "
    if obs.adultMaleCount != 0:
        countString = countString + str(obs.adultMaleCount) + " koirasta (aikuinen), "
    if obs.juvenileUnknownCount != 0:
        countString = countString + str(obs.juvenileUnknownCount) + " tunt. sukupuolta (poikanen), "
    if obs.juvenileFemaleCount != 0:
        countString = countString + str(obs.juvenileFemaleCount) + " naarasta (poikanen), "
    if obs.juvenileMaleCount != 0:
        countString = countString + str(obs.juvenileMaleCount) + " koirasta (poikanen), "
    if obs.subadultUnknownCount != 0:
        countString = countString + str(obs.subadultUnknownCount) + " tunt. sukupuolta (esiaikuinen), "
    if obs.subadultFemaleCount != 0:
        countString = countString + str(obs.subadultFemaleCount) + " naarasta (esiaikuinen), "
    if obs.subadultMaleCount != 0:
        countString = countString + str(obs.subadultMaleCount) + " koirasta (esiaikuinen), "
    if obs.unknownUnknownCount != 0:
        countString = countString + str(obs.unknownUnknownCount) + " tunt. sukupuolta (tunt. ikä), "
    if obs.unknownFemaleCount != 0:
        countString = countString + str(obs.unknownFemaleCount) + " naarasta (tunt. ikä), "
    if obs.unknownMaleCount != 0:
        countString = countString + str(obs.unknownMaleCount) + " koirasta (tunt. ikä), "
    countString = countString[0:(len(countString) - 2)]

    return countString
    
def addObservationToDb(req):
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
    
    db.session().commit()

    return jsonify(req)

def deleteObservation(observation_id):
    observation = Observation.query.filter_by(observation_id).first()
    observation.is_deleted = 1


def getDaySummary(day_id):
    stmt = text("SELECT Observation.species,"
                " SUM(CASE WHEN (Type.name = :const OR Type.name = :other OR Type.name = :night OR Type.name = :scatter) THEN total_count ELSE 0 END) AS all_migration,"
                " SUM(CASE WHEN Type.name = :const THEN total_count ELSE 0 END) AS const_migration,"
                " SUM(CASE WHEN Type.name = :other THEN total_count ELSE 0 END) AS other_migration,"
                " SUM(CASE WHEN Type.name = :night THEN total_count ELSE 0 END) AS night_migration,"
                " SUM(CASE WHEN Type.name = :scatter THEN total_count ELSE 0 END) AS scatter_obs,"
                " SUM(CASE WHEN Type.name = :local THEN total_count ELSE 0 END) AS total_local,"
                " SUM(CASE WHEN (Type.name = :local AND Location.name <> :gou) THEN total_count ELSE 0 END) AS local_other,"
                " SUM(CASE WHEN (Type.name = :local AND Location.name = :gou) THEN total_count ELSE 0 END) AS local_gou"
                " FROM Observation"
                " LEFT JOIN Observationperiod ON Observationperiod.id = Observation.observationperiod_id"
                " LEFT JOIN Type ON Type.id = Observationperiod.type_id"
                " LEFT JOIN Location ON Location.id = Observationperiod.location_id"
                " WHERE Observationperiod.day_id = :day_id"
                " AND Observation.is_deleted = 0"
                " AND Observationperiod.is_deleted = 0"
                " AND Type.is_deleted = 0"
                " AND Location.is_deleted = 0"
                " GROUP BY Observation.species").params(day_id = day_id, 
                    const = "Vakio", other = "Muu muutto", night = "Yömuutto", scatter = "Hajahavainto",
                    local = "Paikallinen", gou = "Luoto Gåu")

    res = db.engine.execute(stmt)

    response = []

    for row in res:
        response.append({
            "species" :row.species, 
            "allMigration":row.all_migration,
            "constMigration":row.const_migration, 
            "otherMigration":row.other_migration,
            "nightMigration":row.night_migration,
            "scatterObs":row.scatter_obs,
            "totalLocal":row.total_local,
            "localOther":row.local_other,
            "localGåu":row.local_gou
            })
  
    return jsonify(response) 
