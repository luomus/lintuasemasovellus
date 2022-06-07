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

# Setup
'''
These are set up based on locations.json
IDs are needed for find checks. Another approach is to hard code IDs 
based on order defined in locations.json if necessary to isolate get functions.
'''
def setupObservatoryLocationAndType():
    observatory_name = 'Hangon_Lintuasema'
    observatory_id = getObservatoryId(observatory_name)
    location = 'Bunkkeri'
    observation_type = 'Vakio'

    return {
        'observatory': observatory_name,
        'observatory_id': observatory_id,
        'location': location,
        'location_id': getLocationId(location, observatory_id),
        'observation_type': observation_type,
        'type_id': getTypeIdByName(observation_type)
    }


def setupDay(observatory):
    req = {
        'observatory': observatory,
        'day': '07.06.2022',
        'observers': 'Hannu Hanhi ja Aku Ankka',
        'comment': 'Normipäivä',
        'selectedactions': "{\"standardObs\":true}"
    }
    return addDayFromReq(req)

# Run during tests
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
    addObservationperiod(
        startTime=fields['startTime'],
        endTime=fields['endTime'],
        observationType=fields['observationType'],
        location=fields['location'],
        day_id=fields['observatoryday_id']
    )
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
    setup = setupObservatoryLocationAndType()
    observationPeriod = {
        'startTime': '00:00',
        'endTime': '23:59',
        'observationType': setup['observation_type'],
        'type_id': setup['type_id'],  # needed for checks
        'location': setup['location'],
        'location_id': setup['location_id'],  # needed for checks
        'observatoryday_id': setupDay(setup['observatory'])['id']
    }
    found = addAndFindPeriod(observationPeriod)
    assert found == True

def test_addedObservationperiodGoesToDb2(app):
    setup = setupObservatoryLocationAndType()
    observationPeriod = {
        'startTime': '10:40',
        'endTime': '12:00',
        'observationType': setup['observation_type'],
        'type_id': setup['type_id'],  # needed for checks
        'location': setup['location'],
        'location_id': setup['location_id'],  # needed for checks
        'observatoryday_id': setupDay(setup['observatory'])['id']
    }
    found = addAndFindPeriod(observationPeriod)
    assert found == True
