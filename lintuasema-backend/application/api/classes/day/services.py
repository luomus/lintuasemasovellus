
from application.api.classes.day.models import Day
from application.db import db, prefix
from sqlalchemy.sql import text
from application.api.classes.observationperiod.services import setObsPerDayId

from flask import jsonify

from datetime import datetime

def addDay(day):
    d = Day.query.filter_by(day = day.day, observatory_id = day.observatory_id, is_deleted = 0).first()
    if  not d and day.observatory_id is not None and day.day is not None and day.observers is not None:
        db.session().add(day)
        db.session().commit()
    else:
        d.is_deleted = 1
        db.session().add(day)
        db.session.commit()
        setObsPerDayId(d.id, day.id)
       
def getDays():
    dayObjects = Day.query.filter_by(is_deleted=0).all()
    return dayObjects

def getDay(dayId):
    return Day.query.get(dayId)

def getDayId(day, observatory_id):
    d = Day.query.filter_by(day = day, observatory_id = observatory_id, is_deleted = 0).first()
    return d.id

def getLatestDays(observatory_id):
    stmt = text(" SELECT v2_Day.day AS day,"
                " COUNT(DISTINCT (CASE WHEN (v2_Observationperiod.is_deleted = 0 AND v2_Observation.is_deleted = 0) THEN v2_Observation.species ELSE NULL END)) AS species_count"
                " FROM v2_Day"
                " LEFT JOIN v2_Observationperiod ON v2_Day.id = v2_Observationperiod.day_id"
                " LEFT JOIN v2_Observation ON v2_Observationperiod.id = v2_Observation.observationperiod_id"
                " WHERE v2_Day.observatory_id = :observatory_id"
                " AND v2_Day.is_deleted = 0 "
                " GROUP BY day"
                " ORDER BY day DESC").params(observatory_id = observatory_id)

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
        response.append({
            "day": dayString,
            "speciesCount": row.species_count
            })
      
    return jsonify(response)