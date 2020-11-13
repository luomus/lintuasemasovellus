from app.api.classes.observationperiod.models import Observationperiod
from app.db import db

def getObsPerId(starttime, endtime, location_id, day_id):
    obsp = Observationperiod.query.filter_by(startTime = starttime, endTime=endtime, location_id=location_id, day_id=day_id).first()
    return obsp.id

def setObsPerDayId(day_id_old, day_id_new):
    obsp = Observationperiod.query.filter_by(day_id = day_id_old).all()
    for x in obsp:
        obs = Observationperiod(startTime = x.startTime, endTime = x.endTime, typeId = x.typeId, locationId = x.locationId, day_Id = x.dayId)
        addObservationperiod(obs)
        x.is_deleted = 1

def addObservationperiod(observationperiod):
        db.session().add(observationperiod)
        db.session().commit()

