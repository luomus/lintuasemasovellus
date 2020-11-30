
from app.api.classes.day.models import Day
from app.db import db
from sqlalchemy.sql import text

from flask import jsonify

from datetime import datetime

def addDay(day):
    d = Day.query.filter_by(day = day.day, observatory_id = day.observatory_id, is_deleted = 0).first()
    if  not d and day.observatory_id is not None and day.day is not None and day.observers is not None:
        db.session().add(day)
        db.session().commit()
       
def getDays():
    dayObjects = Day.query.filter_by(is_deleted=0).all()
    return dayObjects

def getDay(dayId):
    return Day.query.get(dayId)

def getDayId(day, observatory_id):
    d = Day.query.filter_by(day = day, observatory_id = observatory_id).first()
    return d.id

def parseDay(dateString):
    dateString = dateString.split("-")
    return "{2}.{1}.{0}".format(dateString[0][-4:], dateString[1][:2], dateString[2][:2])

def getLatestDays(observatory_id):
    stmt = text(" SELECT Day.day, COUNT(DISTINCT Observation.species) AS speciesCount FROM Day"
                    " JOIN Observationperiod ON Day.id = Observationperiod.day_id"
                    " JOIN Observation ON Observationperiod.id = Observation.observationperiod_id"
                    " WHERE Day.observatory_id = :observatory_id"
                    " GROUP BY Day.day"
                    " ORDER BY Day.day DESC").params(observatory_id = observatory_id)

    res = db.engine.execute(stmt)

    response = []
    i = 0
    for row in res:
        if i == 5:
            break
        i += 1
        day=parseDay(row[0])
        response.append({"day": day,
            "speciesCount": row[1]})
      
    return jsonify(response)