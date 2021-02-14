from application.api.classes.observation.models import Observation
from application.db import db
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

def deleteObservation(shorthand_id):
    observation = Observation.query.filter_by(shorthand_id).first()
    observation.is_deleted = 1


def getDaySummary(day_id):
    stmt = text("SELECT v2_Observation.species AS species,"
                " SUM(CASE WHEN (v2_Type.name = :const OR v2_Type.name = :other OR v2_Type.name = :night OR v2_Type.name = :scatter) THEN total_count ELSE 0 END) AS all_migration,"
                " SUM(CASE WHEN v2_Type.name = :const THEN total_count ELSE 0 END) AS const_migration,"
                " SUM(CASE WHEN v2_Type.name = :other THEN total_count ELSE 0 END) AS other_migration,"
                " SUM(CASE WHEN v2_Type.name = :night THEN total_count ELSE 0 END) AS night_migration,"
                " SUM(CASE WHEN v2_Type.name = :scatter THEN total_count ELSE 0 END) AS scatter_obs,"
                " SUM(CASE WHEN v2_Type.name = :local THEN total_count ELSE 0 END) AS total_local,"
                " SUM(CASE WHEN (v2_Type.name = :local AND v2_Location.name <> :gou) THEN total_count ELSE 0 END) AS local_other,"
                " SUM(CASE WHEN (v2_Type.name = :local AND v2_Location.name = :gou) THEN total_count ELSE 0 END) AS local_gou"
                " FROM v2_Observation"
                " LEFT JOIN v2_Observationperiod ON v2_Observationperiod.id = v2_Observation.observationperiod_id"
                " LEFT JOIN v2_Type ON v2_Type.id = v2_Observationperiod.type_id"
                " LEFT JOIN v2_Location ON v2_Location.id = v2_Observationperiod.location_id"
                " WHERE v2_Observationperiod.day_id = :day_id"
                " AND v2_Observation.is_deleted = 0"
                " AND v2_Observationperiod.is_deleted = 0"
                " AND v2_Type.is_deleted = 0"
                " AND v2_Location.is_deleted = 0"
                " GROUP BY species").params(day_id = day_id, 
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
