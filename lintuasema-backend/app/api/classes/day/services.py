
from app.api.classes.day.models import Day
from app.db import db

def addDay(day):
    if day.observatory_id is not None and day.day is not None and day.observers is not None:
        db.session().add(day)
        db.session().commit()

def getDays():
    dayObjects = Day.query.all()
    return dayObjects

