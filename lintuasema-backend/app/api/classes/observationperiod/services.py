from app.api.classes.observationperiod.models import Observationperiod
from app.db import db

def getObsPerId(starttime, endtime, location_id, day_id):
    obsp = Observationperiod.query.filter_by(startTime = starttime, endTime=endtime, location_id=location_id, day_id=day_id).first()
    return obsp.id

