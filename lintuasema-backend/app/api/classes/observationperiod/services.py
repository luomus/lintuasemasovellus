from app.api.classes.observationperiod.models import Observationperiod
from app.api.classes.observation.models import Observation
from app.db import db

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
