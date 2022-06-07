from sqlalchemy import null
from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observationperiod.services import addObservation, addObservationperiod
from application.api.classes.observationperiod.services import getObservationperiods
from application.api.classes.observatoryday.services import addDay, addDayFromReq, getDays
from application.api.classes.location.services import createLocation, getLocationId
from application.api.classes.observatory.services import getObservatoryId
from application.api.classes.type.services import getTypeIdByName

from application.db import db

from datetime import datetime

'''
Comment from summer 2022 project:
In practice, these are integration tests
(excluding one that calls addAndFindObservation 
that in turn calls addObservation, presumably used 
as a workround for setting up DB).
This is so because it requires setting up the DB before executing the actual tests.
DB could be mocked to limit the scope of the tests but so far not done.
'''

# Support functions
'''
Observatory, location and observation type are by default set up based on locations.json
IDs are needed for find tests of added periods. Another approach is to hard code IDs 
based on order defined in locations.json if necessary to isolate get functions.
'''
def setupDefaultFields():
    fields = {}

    #Observatory
    fields['observatory'] = 'Hangon_Lintuasema'
    fields['observatory_id'] = getObservatoryId(fields['observatory'])

    #Day details
    fields['day'] = '07.06.2022'
    fields['observers'] = 'Hannu Hanhi ja Aku Ankka'
    fields['comment'] = 'Normipäivä'
    fields['selectedactions'] = "{\"standardObs\":true}"

    #Observation details
    fields['location'] = 'Bunkkeri'
    fields['observationType'] = 'Vakio'

    #Data for observation period
    fields['observatoryday_id'] = addDayFromReq(fields)['id']
    fields['type_id'] = getTypeIdByName(fields['observationType'])
    fields['location_id'] = getLocationId(fields['location'], fields['observatory_id'])
    fields['startTime'] = '00:00'
    fields['endTime'] = '23:59'

    return fields


'''
Overwrite default fields and/or add additional fields.
'''
def setupFields(**kwargs):
    fields = setupDefaultFields()
    for k,v in kwargs.items():
         fields[k] = v
    return fields


def observationPeriodFound(fields):
    obsperiods = getObservationperiods()
    found = False
    for obsperiod in obsperiods:
        if (
            obsperiod.start_time == datetime.strptime(
                fields['startTime'], '%H:%M')
            and obsperiod.end_time == datetime.strptime(fields['endTime'], '%H:%M')
            and obsperiod.type_id == fields['type_id']
            and obsperiod.location_id == fields['location_id']
            and obsperiod.observatoryday_id == fields['observatoryday_id']
        ):
            found = True
    return found


def addAndFindPeriod(fields):
    try:
      addObservationperiod(
          startTime=fields['startTime'],
          endTime=fields['endTime'],
          observationType=fields['observationType'],
          location=fields['location'],
          day_id=fields['observatoryday_id']
      )
    except:
      return False
 
    return observationPeriodFound(fields)


def addAndFindObservation(fields):
    periodToAdd = Observationperiod(
        start_time=datetime.strptime(fields['startTime'], '%H:%M'),
        end_time=datetime.strptime(fields['endTime'], '%H:%M'),
        type_id=fields['type_id'],
        location_id=fields['location_id'],
        observatoryday_id=fields['observatoryday_id'])
    addObservation(periodToAdd)
    return observationPeriodFound(fields)

# Tests


'''
This test is older version, created prior to summer 2022.
It is not using same add function as the main application.
Presumably addObservation of observation period services is created
to act as workaround for need to setup DB (addObservationPeriod 
performs other DB operations as well and therefore requires certain
amount of existing data).
'''
def test_addedObservationperiodGoesToDbUsingAddObservationFunction(app):
    observationPeriod = {
        'startTime': '13:00',
        'endTime': '13:04',
        'type_id': 1,
        'location_id': 1,
        'observatoryday_id': 1
    }
    found = addAndFindObservation(observationPeriod)
    assert found == True


def test_addedObservationperiodGoesToDb(app):
    fields = setupFields(
        startTime = '00:01',
        endTime = '23:59'
    )
    assert addAndFindPeriod(fields) == True

def test_addedObservationperiodGoesToDb2(app):
    fields = setupFields(
        startTime = '12:59', 
        endTime = '16:00'
    )
    assert addAndFindPeriod(fields) == True

def test_addedObservationperiodGoesToDb3(app):
    fields = setupFields()
    assert addAndFindPeriod(fields) == True

def test_tryingToAddObsPeriodWithNonExistingLocationFails(app):
    fields = setupFields(
        startTime = '12:59', 
        endTime = '15:00', 
        location = 'Location that does not exist'
    )
    assert addAndFindPeriod(fields) == False

def test_tryingToAddObsPeriodWithNonExistingDayFails(app):
    fields = setupFields(
        startTime = '00:59', 
        endTime = '04:00', 
        observatoryday_id = -1
    )
    assert addAndFindPeriod(fields) == False

def test_tryingToAddObsPeriodWithNonExistingDayFails(app):
    fields = setupFields(
        observationType = 'Type that does not exist'
    )
    assert addAndFindPeriod(fields) == False
