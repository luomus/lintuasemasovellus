
from app.api.classes.day.models import Day
from app.db import db

def addDay(day):
    d = Day.query.filter_by(day = day.day, observatory_id = day.observatory_id).first()
    if not d and day.observatory_id is not None and day.day is not None and day.observers is not None:
        db.session().add(day)
        db.session().commit()
        return True
    else:
        return False

def getDays():
    dayObjects = Day.query.all()
    return dayObjects