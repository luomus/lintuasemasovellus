
from application.api.classes.observatoryday.models import ObservatoryDay
from application.db import db, prefix
from sqlalchemy.sql import text
from application.api.classes.observationperiod.services import setObsPerDayId

from flask import jsonify

from datetime import datetime

def addDay(obsday):
    d = ObservatoryDay.query.filter_by(date = obsday.date, observatory_id = obsday.observatory_id, is_deleted = 0).first()
    if  not d and obsday.observatory_id is not None and obsday.date is not None and obsday.observers is not None:
        db.session().add(obsday)
        db.session().commit()
    else:
        d.is_deleted = 1
        db.session().add(obsday)
        db.session.commit()
        setObsPerDayId(d.id, obsday.id)
       
def getDays():
    dayObjects = ObservatoryDay.query.filter_by(is_deleted=0).all()
    return dayObjects

def getDay(obsday_id):
    return ObservatoryDay.query.get(obsday_id)

def getDayId(date, observatory_id):
    d = ObservatoryDay.query.filter_by(date = date, observatory_id = observatory_id, is_deleted = 0).first()
    return d.id

def getLatestDays(observatory_id):
    stmt = text(" SELECT " + prefix + "ObservatoryDay.date AS date,"
                " COUNT(DISTINCT (CASE WHEN (" + prefix + "Observationperiod.is_deleted = 0 AND " + prefix + "Observation.is_deleted = 0) THEN " + prefix + "Observation.species ELSE NULL END)) AS species_count"
                " FROM " + prefix + "ObservatoryDay"
                " LEFT JOIN " + prefix + "Observationperiod ON " + prefix + "ObservatoryDay.id = " + prefix + "Observationperiod.observatoryday_id"
                " LEFT JOIN " + prefix + "Observation ON " + prefix + "Observationperiod.id = " + prefix + "Observation.observationperiod_id"
                " WHERE " + prefix + "ObservatoryDay.observatory_id = :observatory_id"
                " AND " + prefix + "ObservatoryDay.is_deleted = 0 "
                " GROUP BY date"
                " ORDER BY date DESC").params(observatory_id = observatory_id)

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