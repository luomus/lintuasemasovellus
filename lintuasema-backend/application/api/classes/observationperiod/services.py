from flask import jsonify

from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observation.models import Observation
from application.db import db, prefix

from sqlalchemy.sql import text


def getObsPerId(starttime, endtime, location_id, observatoryday_id):
    obsp = Observationperiod.query.filter_by(start_time = starttime, end_time=endtime, location_id=location_id, observatoryday_id=observatoryday_id).first()
    return obsp.id


def setObsPerDayId(observatoryday_id_old, observatoryday_id_new):
    obsp = Observationperiod.query.filter_by(observatoryday_id = observatoryday_id_old).all()
    for obs in obsp:
        obs.observatoryday_id = observatoryday_id_new
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


def getObservationPeriodsByDayId(observatoryday_id):     
    stmt = text(" SELECT " + prefix + "Observationperiod.id AS obsperiod_id,"
                " " + prefix + "Observationperiod.start_time, " + prefix + "Observationperiod.end_time,"
                " " + prefix + "Type.name AS typename, " + prefix + "Location.name AS locationname,"
                " " + prefix + "Observatoryday.id AS day_id, "
                " COUNT(DISTINCT " + prefix + "Observation.species) AS speciescount"
                " FROM " + prefix + "Observationperiod"
                " JOIN " + prefix + "Type ON " + prefix + "Type.id = " + prefix + "Observationperiod.type_id"
                " JOIN " + prefix + "Location ON " + prefix + "Location.id = " + prefix + "Observationperiod.location_id"
                " JOIN " + prefix + "Observatoryday ON " + prefix + "Observatoryday.id = " + prefix + "Observationperiod.observatoryday_id"
                " JOIN " + prefix + "Observation ON " + prefix + "Observation.observationperiod_id = " + prefix + "Observationperiod.id"
                " WHERE " + prefix + "Observatoryday.id = :dayId"
                " AND " + prefix + "Observationperiod.is_deleted = 0"
                " AND " + prefix + "Type.is_deleted = 0"
                " AND " + prefix + "Location.is_deleted = 0"
                " AND " + prefix + "Observatoryday.is_deleted = 0"
                " AND " + prefix + "Observation.is_deleted = 0"
                " GROUP BY " + prefix + "Observationperiod.id, " + prefix + "Observationperiod.start_time,"
                " " + prefix + "Observationperiod.end_time, " + prefix + "Type.name, " + prefix + "Location.name, " + prefix + "Observatoryday.id"
                " ORDER BY " + prefix + "Observationperiod.start_time").params(dayId = observatoryday_id)

    res = db.engine.execute(stmt)

    response = []

    for row in res:
        response.append({
            'id': row.obsperiod_id,
            'startTime': row.start_time.strftime('%H:%M'),
            'endTime': row.end_time.strftime('%H:%M'),
            'observationType': row.typename,
            'location': row.locationname,
            'day_id': row.day_id,
            'speciesCount': row.speciescount
        })
  
    return jsonify(response)
