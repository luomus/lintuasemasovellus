
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

def getLatestDays(observatory_id):
    stmt = text(" SELECT Day.day, COUNT(DISTINCT Observation.species) AS speciesCount FROM Day"
                    " JOIN Observationperiod ON Day.id = Observationperiod.day_id"
                    " JOIN Observation ON Observationperiod.id = Observation.observationperiod_id"
                    " WHERE Day.observatory_id = :observatory_id"
                    " AND Day.is_deleted = 0 "
                    " AND Observationperiod.is_deleted = 0"
                    " AND Observation.is_deleted = 0"
                    " GROUP BY Day.day"
                    " ORDER BY Day.day DESC").params(observatory_id = observatory_id)

    res = db.engine.execute(stmt)

    response = []
    i = 0
    for row in res:
        if i == 5:
            break
        i += 1
        dayDatetime = row[0]
        if not isinstance(dayDatetime, datetime):
            dayDatetime = datetime.strptime(dayDatetime, '%Y-%m-%d %H:%M:%S.%f')
        dayString = dayDatetime.strftime('%d.%m.%Y')   
        response.append({"day": dayString,
            "speciesCount": row[1]})
      
    return jsonify(response)