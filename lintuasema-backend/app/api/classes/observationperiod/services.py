from flask import jsonify

from app.api.classes.observationperiod.models import Observationperiod
from app.api.classes.observation.models import Observation
from app.db import db

from sqlalchemy.sql import text

def getObsPerId(starttime, endtime, location_id, day_id):
    obsp = Observationperiod.query.filter_by(start_time = starttime, end_time=endtime, location_id=location_id, day_id=day_id).first()
    return obsp.id

def setObsPerDayId(day_id_old, day_id_new):
    obsp = Observationperiod.query.filter_by(day_id = day_id_old).all()
    for obs in obsp:
        obs.day_id = day_id_new

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
    stmt = text(" SELECT Observationperiod.id AS obsperiod_id,"
                " Observationperiod.start_time, Observationperiod.end_time,"
                " Type.name AS typename, Location.name AS locationname, Day.id AS day_id,"
                " COUNT(DISTINCT Observation.species) AS speciescount"
                " FROM Observationperiod"
                " JOIN Type ON Type.id = Observationperiod.type_id"
                " JOIN Location ON Location.id = Observationperiod.location_id"
                " JOIN Day ON Day.id = Observationperiod.day_id"
                " JOIN Observation ON Observation.observationperiod_id = Observationperiod.id"
                " WHERE Day.id = :dayId"
                " AND Observationperiod.is_deleted = 0"
                " AND Type.is_deleted = 0"
                " AND Location.is_deleted = 0"
                " AND Day.is_deleted = 0"
                " AND Observation.is_deleted = 0"
                " GROUP BY Observationperiod.id, Observationperiod.start_time,"
                " Observationperiod.end_time, Type.name, Location.name, Day.id"
                " ORDER BY Observationperiod.start_time").params(dayId = day_id)

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
