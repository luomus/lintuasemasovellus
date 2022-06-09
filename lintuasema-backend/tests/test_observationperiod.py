from attr import fields
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

from pytest import raises

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
def setup_default_fields():
    fields = {}

    #Observatory (ID needed for day and location)
    fields['observatory'] = 'Hangon_Lintuasema'
    fields['observatory_id'] = getObservatoryId(fields['observatory'])

    #Day details (used to create day which ID is needed for period)
    fields['day'] = '07.06.2022'
    fields['observers'] = 'Hannu Hanhi ja Aku Ankka'
    fields['comment'] = 'Normipäivä'
    fields['selectedactions'] = "{\"standardObs\":true}"

    #Observation details (IDs of location and type are needed for period)
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
def setup_fields(**kwargs):
    fields = setup_default_fields()
    for k,v in kwargs.items():
         fields[k] = v
    return fields


def add_observation_period_from_fields(fields):
	addObservationperiod(
        startTime=fields['startTime'],
        endTime=fields['endTime'],
        observationType=fields['observationType'],
        location=fields['location'],
        day_id=fields['observatoryday_id'])


def observation_period_found(fields):
    obsperiods = getObservationperiods()
    for obsperiod in obsperiods:
        if (
            obsperiod.start_time == datetime.strptime(fields['startTime'], '%H:%M')
            and obsperiod.end_time == datetime.strptime(fields['endTime'], '%H:%M')
            and obsperiod.type_id == fields['type_id']
            and obsperiod.location_id == fields['location_id']
            and obsperiod.observatoryday_id == fields['observatoryday_id']
        ):
            return True
    return False


def add_and_find_observation_period(fields):
    try:
      add_observation_period_from_fields(fields)
    finally:
      return observation_period_found(fields)


# Tests

'''
This test is older version, created prior to summer 2022.
It is not using same add function as the main application.
Presumably addObservation of observation period services is created
to act as workaround for need to setup DB (addObservationPeriod 
performs other DB operations as well and therefore requires certain
amount of existing data).
'''
def test_added_obsperiod_goes_to_db_using_addObservation_func(app):
    observationPeriod = {
        'startTime': '13:00',
        'endTime': '13:04',
        'type_id': 1,
        'location_id': 1,
        'observatoryday_id': 1
    }
    periodToAdd = Observationperiod(
        start_time=datetime.strptime(observationPeriod['startTime'], '%H:%M'),
        end_time=datetime.strptime(observationPeriod['endTime'], '%H:%M'),
        type_id=observationPeriod['type_id'],
        location_id=observationPeriod['location_id'],
        observatoryday_id=observationPeriod['observatoryday_id'])
    addObservation(periodToAdd)
    return observation_period_found(observationPeriod)


'''
Tests below expect to have dictionary 'fields' initialized. 
It includes following fields by default:
observatory, observatory_id, 
day, observatoryday_id, observers, comment, selectedactions
location, location_id
observationType, type_id
startTime, endTime

Tests can be varied by changing these fields:
call setupFields and give chosen key, value pair to be changed 
from default values. Defaults are set in setupDefaultFields.
Remember to change the assertion accordingly.
'''

def test_added_observation_goes_to_db(app):
    fields = setup_fields()
    assert add_and_find_observation_period(fields) == True


def test_added_observation_goes_to_db_2(app):
    fields = setup_fields(startTime = '00:01',
                          endTime = '23:59')
    assert add_and_find_observation_period(fields) == True


def test_added_observation_goes_to_db_3(app):
    fields = setup_fields(startTime = '12:59', 
                          endTime = '16:00')
    assert add_and_find_observation_period(fields) == True


def test_obs_period_with_non_existing_location_is_not_added_and_found(app):
    fields = setup_fields(startTime = '12:59', 
                          endTime = '15:00', 
                          location = 'Location that does not exist')
    assert add_and_find_observation_period(fields) == False


def test_obs_period_with_invalid_day_id_is_not_added_and_found(app):
    fields = setup_fields(startTime = '00:59', 
                          endTime = '04:00', 
                          observatoryday_id = -1)
    assert add_and_find_observation_period(fields) == False


def test_obs_period_with_invalid_obs_type_is_not_added_and_found(app):
    fields = setup_fields(observationType = 'Type that does not exist')
    assert add_and_find_observation_period(fields) == False


def test_obs_period_with_invalid_start_time_raises_value_error(app):
    fields = setup_fields(startTime = 'invalid time')
<<<<<<< HEAD
    assert add_and_find_observation_period(fields) == False

'''Tests for local observations:'''

def test_adding_empty_obsperiod_when_migrants_saved(app):
    fields = setup_default_fields()
    add_observation_period_from_fields(fields)
    fields2=setup_fields(startTime = '00:00',
                         type_id=4)
    assert observation_period_found(fields2) == True
=======
    with raises(ValueError):
        add_and_find_observation_period(fields) == False
>>>>>>> 180ed8b3cf37d966c5cd356708fb1a7f518854de
