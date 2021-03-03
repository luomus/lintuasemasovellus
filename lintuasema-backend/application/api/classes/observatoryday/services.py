
from application.api.classes.observatoryday.models import Observatoryday
from application.db import db, prefix
from sqlalchemy.sql import text
from application.api.classes.observationperiod.services import setObsPerDayId

from flask import jsonify

from datetime import datetime

def addDay(obsday):
    d = Observatoryday.query.filter_by(day = obsday.day, observatory_id = obsday.observatory_id, is_deleted = 0).first()
    if  not d and obsday.observatory_id is not None and obsday.day is not None and obsday.observers is not None:
        db.session().add(obsday)
        db.session().commit()
    elif obsday.observatory_id is not None and obsday.day is not None and obsday.observers is not None:
        d.is_deleted = 1
        db.session().add(obsday)
        db.session.commit()
        setObsPerDayId(d.id, obsday.id)
       
def getDays():
    dayObjects = Observatoryday.query.filter_by(is_deleted=0).all()
    return dayObjects

def getDay(obsday_id):
    return Observatoryday.query.get(obsday_id)

def getDayId(day, observatory_id):
    d = Observatoryday.query.filter_by(day = day, observatory_id = observatory_id, is_deleted = 0).first()
    return d.id

def getLatestDays(observatory_id):
    stmt = text(" SELECT " + prefix + "observatoryday.day AS day,"
                " COUNT(DISTINCT (CASE WHEN (" + prefix + "observationperiod.is_deleted = 0 AND " + prefix + "observation.is_deleted = 0) THEN " + prefix + "observation.species ELSE NULL END)) AS species_count"
                " FROM " + prefix + "observatoryday"
                " LEFT JOIN " + prefix + "observationperiod ON " + prefix + "observatoryday.id = " + prefix + "observationperiod.observatoryday_id"
                " LEFT JOIN " + prefix + "observation ON " + prefix + "observationperiod.id = " + prefix + "observation.observationperiod_id"
                " WHERE " + prefix + "observatoryday.observatory_id = :observatory_id"
                " AND " + prefix + "observatoryday.is_deleted = 0 "
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