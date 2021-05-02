from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observationperiod.services import addObservation
from application.api.classes.observationperiod.services import getObservationperiods
from datetime import datetime


def test_addedObservationperiodGoesToDb(app):
    observationPeriod = {'startTime': '13:00', 'endTime': '13:04', 'type_id': 1, 'location_id': 1, 'observatoryday_id': 1}
    found = addAndFind(observationPeriod)
    assert found == True

def addAndFind(fields):
    periodToAdd = Observationperiod(
      start_time=datetime.strptime(fields['startTime'], '%H:%M'),
      end_time=datetime.strptime(fields['endTime'], '%H:%M'),
      type_id=fields['type_id'],
      location_id=fields['location_id'],
      observatoryday_id=fields['observatoryday_id'])
    addObservation(periodToAdd)
    obsperiods = getObservationperiods()
    found = False
    for obsperiod in obsperiods:
      if (obsperiod.start_time == datetime.strptime(fields['startTime'], '%H:%M') and obsperiod.end_time == datetime.strptime(fields['endTime'], '%H:%M')
          and obsperiod.type_id == fields['type_id'] and obsperiod.location_id == fields['location_id'] and obsperiod.observatoryday_id == fields['observatoryday_id']):
        found = True
    return found