from flask import jsonify

from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observation.models import Observation
from application.db import db, prefix

from sqlalchemy.sql import text

def getObsPerId(starttime, endtime, location_id, day_id):
    obsp = Observationperiod.query.filter_by(start_time = starttime, end_time=endtime, location_id=location_id, day_id=day_id).first()
    return obsp.id

def setObsPerDayId(day_id_old, day_id_new):
    obsp = Observationperiod.query.filter_by(day_id = day_id_old).all()
    for obs in obsp:
        obs.day_id = day_id_new
        db.session().commit()

def addObservationperiod(observationperiod):
        db.session().add(observationperiod)
        db.session().commit()

def setObservationId(observationperiod_id_old, observationperiod_id_new):
    observations = Observation.query.filter_by(observationperiod_id = observationperiod_id_old).all()
    for x in observations:
        x.observationperiod_id = observationperiod_id_new

def addObservation(observation):
    db.session().add(observation)
    db.session().commit()


def getObservationPeriodsByDayId(day_id):     
    stmt = text(" SELECT " + prefix + "Observationperiod.id AS obsperiod_id,"
                " " + prefix + "Observationperiod.start_time, " + prefix + "Observationperiod.end_time,"
                " " + prefix + "Type.name AS typename, " + prefix + "Location.name AS locationname, " + prefix + "Day.id AS day_id,"
                " COUNT(DISTINCT " + prefix + "Observation.species) AS speciescount"
                " FROM " + prefix + "Observationperiod"
                " JOIN " + prefix + "Type ON " + prefix + "Type.id = " + prefix + "Observationperiod.type_id"
                " JOIN " + prefix + "Location ON " + prefix + "Location.id = " + prefix + "Observationperiod.location_id"
                " JOIN " + prefix + "Day ON " + prefix + "Day.id = " + prefix + "Observationperiod.day_id"
                " JOIN " + prefix + "Observation ON " + prefix + "Observation.observationperiod_id = " + prefix + "Observationperiod.id"
                " WHERE " + prefix + "Day.id = :dayId"
                " AND " + prefix + "Observationperiod.is_deleted = 0"
                " AND " + prefix + "Type.is_deleted = 0"
                " AND " + prefix + "Location.is_deleted = 0"
                " AND " + prefix + "Day.is_deleted = 0"
                " AND " + prefix + "Observation.is_deleted = 0"
                " GROUP BY obsperiod_id, " + prefix + "Observationperiod.start_time,"
                " " + prefix + "Observationperiod.end_time, typename, locationname, day_id"
                " ORDER BY " + prefix + "Observationperiod.start_time").params(dayId = day_id)

    res = db.engine.execute(stmt)

    response = []

    for row in res:

        starthours = ""
        startminutes = ""
        endhours = ""
        endminutes = ""

        if isinstance(row.start_time, str):
            startTimeArray = row.start_time.split(':')
            starthours = startTimeArray[0][-2:]
            startminutes = startTimeArray[1][0:2]
            endTimeArray = row.end_time.split(':')
            endhours = endTimeArray[0][-2:]
            endminutes = endTimeArray[1][0:2]
        else:
            starthours = row.start_time.strftime('%H')
            startminutes = row.start_time.strftime('%M')
            endhours = row.end_time.strftime('%H')
            endminutes = row.end_time.strftime('%M')

        starttime = starthours + ':' + startminutes
        endtime = endhours + ':' + endminutes

        response.append({
            'id': row.obsperiod_id,
            'startTime': starttime,
            'endTime': endtime,
            'observationType': row.typename,
            'location': row.locationname,
            'day_id': row.day_id,
            'speciesCount': row.speciescount
        })
  
    return jsonify(response)
