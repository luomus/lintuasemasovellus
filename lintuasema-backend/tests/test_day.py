from app.api.classes.day.models import Day
from app.api.classes.day.services import addDay, getDays

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

def addAndFind(fields):
    dayToAdd = Day(day=fields['date'], comment=fields['comment'], observers=fields['observers'], observatory_id=fields['observatory_id'])
    addDay(dayToAdd)
    days = getDays()
    found = False
    for day in days:
        if day.day == fields['date'] and day.comment == fields['comment'] and day.observers == fields['observers'] and day.observatory_id == fields['observatory_id']:
            found = True
    return found
