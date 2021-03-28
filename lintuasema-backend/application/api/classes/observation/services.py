from application.api.classes.observation.models import Observation
from application.db import db, prefix
from flask import jsonify
from sqlalchemy.sql import text

def getObservationByPeriod(observationperiod_id):
    observations = Observation.query.filter_by(observationperiod_id = observationperiod_id)
    ret = []
    for observation in observations:
        countString = parseCountString(observation)
        ret.append({ 'species': observation.species, 'count': countString, 'direction': observation.direction, 'bypassSide': observation.bypassSide})
    
    return ret

def getAllObservations():
    observations = Observation.query.all()
    ret = []
    for obs in observations:
        ret.append({ 'species': obs.species, 'adultUnknownCount': obs.adultUnknownCount, 'adultFemaleCount': obs.adultFemaleCount, 'adultMaleCount': obs.adultMaleCount,
            'juvenileUnknownCount': obs.juvenileUnknownCount, 'juvenileFemaleCount': obs.juvenileFemaleCount, 'juvenileMaleCount': obs.juvenileMaleCount,
            'subadultUnknownCount': obs.subadultUnknownCount, 'subadultFemaleCount': obs.subadultFemaleCount, 'subadultMaleCount': obs.subadultMaleCount,
            'unknownUnknownCount': obs.unknownUnknownCount, 'unknownFemaleCount': obs.unknownFemaleCount, 'unknownMaleCount': obs.unknownMaleCount, 'total_count' :obs.total_count,
            'direction': obs.direction, 'bypassSide': obs.bypassSide, 'notes': obs.notes, 
            'observationperiod_id': obs.observationperiod_id, 'shorthand_id': obs.shorthand_id, 'account_id': obs.account_id})

    return ret


def getDaySummary(day_id):
    stmt = text("SELECT " + prefix + "Observation.species AS species,"
                " SUM(CASE WHEN (" + prefix + "Type.name = :const OR " + prefix + "Type.name = :other OR " + prefix + "Type.name = :night OR " + prefix + "Type.name = :scatter) THEN total_count ELSE 0 END) AS all_migration,"
                " SUM(CASE WHEN " + prefix + "Type.name = :const THEN total_count ELSE 0 END) AS const_migration,"
                " SUM(CASE WHEN " + prefix + "Type.name = :other THEN total_count ELSE 0 END) AS other_migration,"
                " SUM(CASE WHEN " + prefix + "Type.name = :night THEN total_count ELSE 0 END) AS night_migration,"
                " SUM(CASE WHEN " + prefix + "Type.name = :scatter THEN total_count ELSE 0 END) AS scatter_obs,"
                " SUM(CASE WHEN " + prefix + "Type.name = :local THEN total_count ELSE 0 END) AS total_local,"
                " SUM(CASE WHEN (" + prefix + "Type.name = :local AND " + prefix + "Location.name <> :gou) THEN total_count ELSE 0 END) AS local_other,"
                " SUM(CASE WHEN (" + prefix + "Type.name = :local AND " + prefix + "Location.name = :gou) THEN total_count ELSE 0 END) AS local_gou"
                " FROM " + prefix + "Observation"
                " LEFT JOIN " + prefix + "Observationperiod ON " + prefix + "Observationperiod.id = " + prefix + "Observation.observationperiod_id"
                " LEFT JOIN " + prefix + "Type ON " + prefix + "Type.id = " + prefix + "Observationperiod.type_id"
                " LEFT JOIN " + prefix + "Location ON " + prefix + "Location.id = " + prefix + "Observationperiod.location_id"
                " WHERE " + prefix + "Observationperiod.observatoryday_id = :day_id"
                " AND " + prefix + "Observation.is_deleted = 0"
                " AND " + prefix + "Observationperiod.is_deleted = 0"
                " AND " + prefix + "Type.is_deleted = 0"
                " AND " + prefix + "Location.is_deleted = 0"
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
  
    return response

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
    birdCount = (req['adultUnknownCount'] 
               + req['adultFemaleCount'] 
               + req['adultMaleCount'] 
               + req['juvenileUnknownCount'] 
               + req['juvenileFemaleCount'] 
               + req['juvenileMaleCount'] 
               + req['subadultUnknownCount'] 
               + req['subadultFemaleCount'] 
               + req['subadultMaleCount'] 
               + req['unknownUnknownCount'] 
               + req['unknownFemaleCount'] 
               + req['unknownMaleCount'])

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
        shorthand_id=req['shorthand_id'],
        account_id=req['account_id'])
    
    db.session().add(observation)
    db.session().commit()

    return jsonify(req)

def deleteObservation(shorthand_id):
    observation = Observation.query.filter_by(shorthand_id).first()
    observation.is_deleted = 1

def deleteObservations(shorthand_id):
    observations_to_delete = Observation.query.filter_by(shorthand_id=shorthand_id).all()
    for observation in observations_to_delete:
        observation.is_deleted = 1
    db.session.commit()
