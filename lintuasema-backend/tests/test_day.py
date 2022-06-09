from application.api.classes.observatoryday.models import Observatoryday
from application.api.classes.observatoryday.services import addDay, getDays, getDayId, editLocalObs
from application.api.classes.observatoryday.views import add_day
from application.api.classes.observationperiod.services import getObsPerId
from application.api.classes.observation.services import getObservationByPeriod, getObservationByPeriodAndSpecies
from tests.test_observationperiod import setup_default_fields, setup_fields, observation_period_found
from flask import json
import tempfile
import pytest
from datetime import datetime


testDate = datetime.strptime('01.01.2020', '%d.%m.%Y')
testDate2 = day=datetime.strptime('02.01.2020', '%d.%m.%Y')


def test_addedDayGoesToDatabase(app):
    dayProperties = {'day': testDate, 'comment': 'Testailin havainnoimista', 'observers': 'Tomppa', 'selectedactions': 'Vakkari', 'observatory_id': 1}
    found = addAndFind(dayProperties)
    assert found == True

def test_addedDayGoesToDatabaseWhenCommentIsNone(app):
    dayProperties = {'day': testDate, 'comment': None, 'observers': 'Tomppa', 'selectedactions': 'Vakkari', 'observatory_id': 1}
    found = addAndFind(dayProperties)
    assert found == True

def test_addedDayDoesNotGoToDatabaseIfDateIsNone(app):
    dayProperties = {'day': None, 'comment': 'Testailin havainnoimista', 'selectedactions': 'Vakkari', 'observers': 'Tomppa', 'observatory_id': 1}
    found = addAndFind(dayProperties)
    assert found == False

def test_addedDayDoesNotGoToDatabaseIfObserversIsNone(app):
    dayProperties = {'day': testDate, 'comment': 'Testailin havainnoimista', 'selectedactions': 'Vakkari', 'observers': None, 'observatory_id': 1}
    found = addAndFind(dayProperties)
    assert found == False

def test_addedDayDoesNotGoToDatabaseIfObservatoryIsNone(app):
    dayProperties = {'day': testDate, 'comment': 'Testailin havainnoimista', 'selectedactions': 'Vakkari', 'observers': 'Tomppa', 'observatory_id': None}
    found = addAndFind(dayProperties)
    assert found == False

def test_ifExistingDayIsAddedCommentAndObserverCanBeModified(app):
    dayProperties = {'day': testDate, 'comment': 'testataan', 'observers': 'Tomppa', 'selectedactions': 'Vakkari', 'observatory_id': 1}
    dayToAdd = Observatoryday(day=testDate, comment='testi', observers='Tom', selectedactions='Vakkari', observatory_id=1)
    addDay(dayToAdd)
    found = addAndFind(dayProperties)
    assert found == True

def test_sameDayIsAddedIfDifferentObservatory(app):
    dayProperties = {'day': testDate, 'comment': 'testataan', 'observers': 'Tomppa', 'selectedactions': 'Vakkari', 'observatory_id': 2}
    dayToAdd = Observatoryday(day=testDate, comment='testi', observers='Tom', selectedactions='Vakkari', observatory_id=1)
    addDay(dayToAdd)
    found = addAndFind(dayProperties)
    assert found == True

def test_sameObservatoryDifferentDay(app):
    dayToAdd = Observatoryday(day=testDate2, comment='testi', observers='Tom', selectedactions='Vakkari', observatory_id=1)
    dayProperties = {'day': testDate, 'comment': 'testataan', 'observers': 'Tomppa', 'selectedactions': 'Vakkari', 'observatory_id': 1}
    addDay(dayToAdd)
    found = addAndFind(dayProperties)
    assert found == True

def test_addDayRoute(app):
    response = app.test_client().post(
        '/api/addDay',
        data=json.dumps({'day': '01.03.2020', 'observers': 'Teppo Testaaja', 'selectedactions': 'Vakkari', 'comment': 'Kaunis ilma.', 'observatory': 'Hangon_Lintuasema'}),
        content_type='application/json',)
    data = response.get_json()
    assert response.status_code == 200
    assert data['id'] == 1
#Testing if the empty observationperiod is added when a day is created
def test_emptyDayAddedWithDayCreation(app):
    dayToAdd = Observatoryday(day=testDate2, comment='', observers='', selectedactions='', observatory_id=1)
    addDay(dayToAdd)
    fields2=setup_fields(startTime = '00:00',
                         type_id=4)
    assert observation_period_found(fields2) == True

#Test editing local observations
def test_editLocalObs(app):
    dayToAdd = Observatoryday(day=testDate2, comment='', observers='', selectedactions='', observatory_id=1)
    addDay(dayToAdd)
    editLocalObs(1, 'SOMMOL', 37, 1)
    obs=getObservationByPeriodAndSpecies(1, 'SOMMOL')
    assert obs.species=='SOMMOL' and obs.total_count==37

def addAndFind(fields):
    dayToAdd = Observatoryday(day=fields['day'], comment=fields['comment'], selectedactions=fields['selectedactions'], observers=fields['observers'], observatory_id=fields['observatory_id'])
    addDay(dayToAdd)
    days = getDays()
    found = False
    for day in days:
        if day.day == fields['day'] and day.comment == fields['comment'] and day.selectedactions == fields['selectedactions'] and day.observers == fields['observers'] and day.observatory_id == fields['observatory_id']:
            found = True
    return found
