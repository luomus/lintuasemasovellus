from app.api.classes.day.models import Day
from app.api.classes.day.services import addDay, getDays
from app.api.classes.day.views import add_day
from flask import json
import tempfile
import pytest


#@pytest.fixture
# def client():
#     db_fd, app.config['DATABASE'] = tempfile.mkstemp()
#     app.config['TESTING'] = True
#     app.config['LOGIN_DISABLED'] = True

#     with app.test_client() as client:
#         with app.app_context():
#             init_db()
#         yield client

#     os.close(db_fd)
#     os.unlink(app.config['DATABASE'])


def test_addedDayGoesToDatabase(app):
    dayProperties = {'date': '01.01.2020', 'comment': 'Testailin havainnoimista', 'observers': 'Tomppa', 'observatory_id': 1}
    found = addAndFind(dayProperties)
    assert found == True

def test_addedDayGoesToDatabaseWhenCommentIsNone(app):
    dayProperties = {'date': '01.01.2020', 'comment': None, 'observers': 'Tomppa', 'observatory_id': 1}
    found = addAndFind(dayProperties)
    assert found == True

def test_addedDayDoesNotGoToDatabaseIfDateIsNone(app):
    dayProperties = {'date': None, 'comment': 'Testailin havainnoimista', 'observers': 'Tomppa', 'observatory_id': 1}
    found = addAndFind(dayProperties)
    assert found == False

def test_addedDayDoesNotGoToDatabaseIfObserversIsNone(app):
    dayProperties = {'date': '01.01.2020', 'comment': 'Testailin havainnoimista', 'observers': None, 'observatory_id': 1}
    found = addAndFind(dayProperties)
    assert found == False

def test_addedDayDoesNotGoToDatabaseIfObservatoryIsNone(app):
    dayProperties = {'date': '01.01.2020', 'comment': 'Testailin havainnoimista', 'observers': 'Tomppa', 'observatory_id': None}
    found = addAndFind(dayProperties)
    assert found == False

def test_existingDayIsNotAdded(app):
    dayProperties = {'date': '01.01.2020', 'comment': 'testataan', 'observers': 'Tomppa', 'observatory_id': 1}
    dayToAdd = Day(day='01.01.2020', comment='testi', observers='Tom', observatory_id=1)
    addDay(dayToAdd)
    found = addAndFind(dayProperties)
    assert found == False

def test_sameDayIsAddedIfDifferentObservatory(app):
    dayProperties = {'date': '01.01.2020', 'comment': 'testataan', 'observers': 'Tomppa', 'observatory_id': 2}
    dayToAdd = Day(day='01.01.2020', comment='testi', observers='Tom', observatory_id=1)
    addDay(dayToAdd)
    found = addAndFind(dayProperties)
    assert found == True

def test_sameObservatoryDifferentDay(app):
    dayToAdd = Day(day='02.01.2020', comment='testi', observers='Tom', observatory_id=1)
    dayProperties = {'date': '01.01.2020', 'comment': 'testataan', 'observers': 'Tomppa', 'observatory_id': 1}
    addDay(dayToAdd)
    found = addAndFind(dayProperties)
    assert found == True

def test_addDayRoute(app):
    response = app.test_client().post(
        '/api/addDay',
        data=json.dumps({'day': '01.03.2020', 'observers': 'Teppo Testaaja', 'comment': 'Kaunis ilma.', 'observatory': 'Hangon Lintuasema'}),
        content_type='application/json',)
    
    print("response", response)
    #data = json.loads(response.get_data())
    data = response.get_json()
    print('status code ',  response.status_code)
    assert response.status_code == 200
    assert data['id'] == 1

# def test_listDaysRoute(app):
#     dayToAdd = Day(day='01.01.2020', comment='testi', observers='Tom', observatory_id=1)
#     addDay(dayToAdd)
#     response = app.test_client.get('/api/listDays')
#     data = response.get_json
#     assert response.status_code == 200
#     assert data['id'] == 1


def addAndFind(fields):
    dayToAdd = Day(day=fields['date'], comment=fields['comment'], observers=fields['observers'], observatory_id=fields['observatory_id'])
    addDay(dayToAdd)
    days = getDays()
    found = False
    for day in days:
        if day.day == fields['date'] and day.comment == fields['comment'] and day.observers == fields['observers'] and day.observatory_id == fields['observatory_id']:
            found = True
    return found
