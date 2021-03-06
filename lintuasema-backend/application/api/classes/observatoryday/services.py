from application.api.classes.observatoryday.models import Observatoryday
from application.api.classes.observationperiod.models import Observationperiod
from application.db import db, prefix
from sqlalchemy.sql import text
from application.api.classes.catch.services import set_catch_day_id
from application.api.classes.observatory.services import getObservatoryId, getObservatoryName
from flask import jsonify

from datetime import datetime, date

def addDayFromReq(req):
    observatory_id = getObservatoryId(req['observatory'])
    day=datetime.strptime(req['day'], '%d.%m.%Y')
    
    new_obsday = Observatoryday(day=day, comment=req['comment'], observers=req['observers'], selectedactions=req['selectedactions'], observatory_id=observatory_id) 

    addDay(new_obsday)
    
    addedId = getDayId(new_obsday.day, new_obsday.observatory_id)
    
    return { 'id': addedId }

def addDay(obsday):
    d = Observatoryday.query.filter_by(day = obsday.day, observatory_id = obsday.observatory_id, is_deleted = 0).first()
    if  not d and obsday.observatory_id is not None and obsday.day is not None and obsday.observers is not None:
        db.session().add(obsday)
        db.session().commit() 
    elif obsday.observatory_id is not None and obsday.day is not None and obsday.observers is not None:
      if obsday.observatory_id != d.observatory_id or obsday.day != d.day or obsday.observers != d.observers or obsday.comment != d.comment or obsday.selectedactions != d.selectedactions:
        d.is_deleted = 1
        db.session().add(obsday)
        db.session.commit()
        set_new_day_id(d.id, obsday.id)
        set_catch_day_id(d.id, obsday.id)


def set_new_day_id(observatoryday_id_old, observatoryday_id_new):
    obsp = Observationperiod.query.filter_by(observatoryday_id = observatoryday_id_old).all()
    for obs in obsp:
      obs.observatoryday_id = observatoryday_id_new
    db.session().commit()

def listDays():
    dayObjects = getDays()

    ret = []
    for obsday in dayObjects:
        dayDatetime = obsday.day
        if not isinstance(dayDatetime, datetime): 
            dayDatetime=datetime.strptime(dayDatetime, '%d.%m.%Y')
        dayString = dayDatetime.strftime('%d.%m.%Y')
        ret.append({ 'id': obsday.id, 'day': dayString, 'observers': obsday.observers, 'comment': obsday.comment, 'selectedactions': obsday.selectedactions, 'observatory': getObservatoryName(obsday.observatory_id) })
    
    return ret

def getDays():
    dayObjects = Observatoryday.query.filter_by(is_deleted=0).all()
    return dayObjects

def getDay(obsday_id):
    return Observatoryday.query.get(obsday_id)

def get_day_without_id(day, observatory):
    if not isinstance(day, date) and not day == '0NaN.0NaN.NaN':
        day = datetime.strptime(day, '%d.%m.%Y')
    obsday = Observatoryday.query.filter_by(day = day, observatory_id = getObservatoryId(observatory), is_deleted = 0).first()
    res = []
    if not obsday:
        res.append({ 'id': 0, 'comment': "", 'observers': "", 'selectedactions': ""})
    else:
        res.append({ 'id': obsday.id, 'comment': obsday.comment, 'observers': obsday.observers, 'selectedactions': obsday.selectedactions})
    return res

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
      
    return response

def update_comment(obsday_id, comment):
    day_old=Observatoryday.query.get(obsday_id)
    day_new = Observatoryday(day = day_old.day, comment = comment, observers = day_old.observers, selectedactions = day_old.selectedactions, observatory_id = day_old.observatory_id)
    
    return update_edited_day(day_new, day_old)

def update_observers(obsday_id, observers):
    day_old=Observatoryday.query.get(obsday_id)
    day_new = Observatoryday(day = day_old.day, comment = day_old.comment, observers = observers, selectedactions = day_old.selectedactions, observatory_id = day_old.observatory_id)
    
    return update_edited_day(day_new, day_old)

def update_actions(obsday_id, actions):
    day_old=Observatoryday.query.get(obsday_id)
    day_new = Observatoryday(day = day_old.day, comment = day_old.comment, observers = day_old.observers, selectedactions = actions, observatory_id = day_old.observatory_id)
    
    return update_edited_day(day_new, day_old)

def update_edited_day(day_new, day_old):
    day_old.is_deleted = 1

    addDay(day_new)
    set_new_day_id(day_old.id, day_new.id)
    set_catch_day_id(day_old.id, day_new.id)

    db.session().commit()

    return {"id" : day_new.id}