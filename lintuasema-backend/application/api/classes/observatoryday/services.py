from venv import create
from application.api.classes.observatoryday.models import Observatoryday
from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observation.models import Observation
from application.api.classes.shorthand.models import Shorthand
from application.api.classes.location.services import getLocationId
from application.api.classes.type.services import getTypeIdByName
from application.db import db, prefix
from sqlalchemy.sql import text
from application.api.classes.catch.services import set_catch_day_id
from application.api.classes.observatory.services import getObservatoryId, getObservatoryName
from flask import jsonify
from flask_login import current_user
from application.api.classes.account.models import Account

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
        dayId=getDayId(obsday.day, obsday.observatory_id)
        if not checkPeriod(dayId):
            createEmptyObsPeriods(dayId)
            
    elif obsday.observatory_id is not None and obsday.day is not None and obsday.observers is not None:
      if obsday.observatory_id != d.observatory_id or obsday.day != d.day or obsday.observers != d.observers or obsday.comment != d.comment or obsday.selectedactions != d.selectedactions:
        d.is_deleted = 1
        db.session().add(obsday)
        db.session.commit()
        set_new_day_id(d.id, obsday.id)
        set_catch_day_id(d.id, obsday.id)

#Check if a period for local observations has already been added today
def checkPeriod(dayId):
    typid=getTypeIdByName("Paikallinen")
    d=Observationperiod.query.filter_by(is_deleted=0, observatoryday_id=dayId, type_id=typid).first()
    if d is not None:
        print("checkperiod with dayId:",dayId, ": True")
        return True
    else:
        print("checkperiod with dayId:",dayId, ": False")
        return False

def createEmptyObsPeriods(dayId):
    obserid=getObservatoryId("Hangon_Lintuasema")
    loc1id=getLocationId("Bunkkeri", obserid)
    loc2id=getLocationId("Luoto Gåu", obserid)
    typid=getTypeIdByName("Paikallinen")
    typid2=getTypeIdByName("Hajahavainto")
    obsp2 = Observationperiod(
       start_time=datetime(1900,1,1,0,0,0),
        end_time=datetime(1900,1,1,23,59,0),
        type_id=typid,
        location_id=loc1id, observatoryday_id=dayId)
    db.session().add(obsp2)
    obsp3 = Observationperiod(
       start_time=datetime(1900,1,1,0,0,0),
        end_time=datetime(1900,1,1,23,59,0),
        type_id=typid,
        location_id=loc2id, observatoryday_id=dayId)
    db.session().add(obsp3)
    obsp4 = Observationperiod(
       start_time=datetime(1900,1,1,0,0,0),
        end_time=datetime(1900,1,1,23,59,0),
        type_id=typid2,
        location_id=loc1id, observatoryday_id=dayId)
    db.session().add(obsp4)
    db.session().commit()

#Add a new observation to local obsperiod, or edit an old one if this species has already been observed locally:
def editLocalObs(obsday_id, obserid, species, count, gau):
    if not current_user:
        u="MA.4658" #This is my (Ville) userId, to be used if the user's own id is not found.
    else:
        u = current_user.get_id()
        user = Account.query.filter_by(id=u).first()
        if user:
            u=user.userId
        else:
            u="MA.4658"
    if gau==1:
        loc1=getLocationId("Luoto Gåu", obserid)
    else:
        loc1=getLocationId("Bunkkeri", obserid)
    typid=getTypeIdByName("Paikallinen")
    per=Observationperiod.query.filter_by(is_deleted=0, observatoryday_id=obsday_id, location_id=loc1, type_id=typid).first()
    obs=Observation.query.filter_by(observationperiod_id=per.id, species=species).first()
    if obs: #observation already exists (=local observation for this species has already been edited)
        print(obs.total_count)
        print("doesex")
        obs.total_count=count
        db.session().commit()
    else: #observation does not exist, so we create it
        print("doesnotex")
        subobs=Observation(adultUnknownCount= 0, adultFemaleCount= 0, adultMaleCount= 0, juvenileUnknownCount= 0,
            juvenileFemaleCount= 0, juvenileMaleCount= 0, subadultUnknownCount= 0, subadultFemaleCount= 0,
            subadultMaleCount= 0, unknownUnknownCount= count, unknownMaleCount= 0, unknownFemaleCount= 0, direction= '',
            bypassSide= '', notes= '', species= species, account_id= u, observationperiod_id=per.id,total_count=count, shorthand_id=11387)
        db.session().add(subobs)
        db.session().commit()

def editScatterObs(obsday_id, obserid, species, count):
    if not current_user:
        u="MA.4658" #This is my (Ville) userId, to be used if the user's own id is not found.
    else:
        u = current_user.get_id()
        user = Account.query.filter_by(id=u).first()
        if user:
            u=user.userId
        else:
            u="MA.4658"
    loc1=getLocationId("Bunkkeri", obserid)
    typid=getTypeIdByName("Hajahavainto")
    per=Observationperiod.query.filter_by(is_deleted=0, observatoryday_id=obsday_id, location_id=loc1, type_id=typid).first()
    obs=Observation.query.filter_by(observationperiod_id=per.id, species=species).first()
    if obs: #observation already exists (=local observation for this species has already been edited)
        print(obs.total_count)
        print("doesex")
        obs.total_count=count
        db.session().commit()
    else: #observation does not exist, so we create it
        print("doesnotex")
        subobs=Observation(adultUnknownCount= 0, adultFemaleCount= 0, adultMaleCount= 0, juvenileUnknownCount= 0,
            juvenileFemaleCount= 0, juvenileMaleCount= 0, subadultUnknownCount= 0, subadultFemaleCount= 0,
            subadultMaleCount= 0, unknownUnknownCount= count, unknownMaleCount= 0, unknownFemaleCount= 0, direction= '',
            bypassSide= '', notes= '', species= species, account_id= u, observationperiod_id=per.id,total_count=count, shorthand_id=11387)
        db.session().add(subobs)
        db.session().commit()

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
        res.append({ 'id': obsday.id, 'comment': obsday.comment or "", 'observers': obsday.observers, 'selectedactions': obsday.selectedactions})
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