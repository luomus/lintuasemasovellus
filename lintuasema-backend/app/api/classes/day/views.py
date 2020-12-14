from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from app.api.classes.day.models import Day
from app.api.classes.day.services import addDay, getDays, getDayId, getLatestDays
from app.api.classes.observatory.services import getObservatoryId, getObservatoryName
from app.api.classes.observationperiod.services import setObsPerDayId

from app.api.classes.observationperiod.models import Observationperiod
from app.api.classes.type.models import Type
from app.api.classes.observatory.models import Observatory
from app.api.classes.location.services import getLocationId
from app.api.classes.observationperiod.services import getObsPerId
from app.api.classes.day.services import getDay
from app.api.classes.type.services import getTypeIdByName

from app.api.classes.observation.models import Observation
from app.api.classes.shorthand.models import Shorthand

from app.api import bp
from app.db import db
from sqlalchemy.sql import text

from datetime import datetime



@bp.route('/api/addEverything', methods=['POST'])
@login_required
def add_everything():

    req = request.get_json()
    observatory_id = getObservatoryId(req['observatory'])
    
    day=datetime.strptime(req['day'], '%d.%m.%Y')

    day = Day(day=day, comment=req['comment'], observers=req['observers'], observatory_id=observatory_id) 

    addDay(day)
    dayId = getDayId(day.day, day.observatory_id)

    day = getDay(dayId)
    obsId = day.observatory_id

    for obsperiod in req['obsperiods']:
        locId = getLocationId(req['location'], obsId)

        obsp = Observationperiod(
            start_time=datetime.strptime(obsperiod['startTime'], '%H:%M'),
            end_time=datetime.strptime(obsperiod['endTime'], '%H:%M'),
            type_id=getTypeIdByName(req['type']),
            location_id=locId, day_id=dayId)
        db.session().add(obsp)

        obspId = getObsPerId(obsp.start_time, obsp.end_time, obsp.location_id, obsp.day_id)

        for observation in obsperiod['observations']:
            shorthand = Shorthand(shorthandrow=observation['shorthandrow'], observationperiod_id=obspId)
            db.session().add(shorthand)


            shorthand_id = Shorthand.query.filter_by(
                shorthandrow=observation['shorthandrow'], observationperiod_id=obspId).first().id


            birdCount = observation['adultUnknownCount'] + observation['adultFemaleCount'] + observation['adultMaleCount'] + observation['juvenileUnknownCount'] + observation['juvenileFemaleCount'] + observation['juvenileMaleCount'] + observation['subadultUnknownCount'] + observation['subadultFemaleCount'] + observation['subadultMaleCount'] + observation['unknownUnknownCount'] + observation['unknownFemaleCount'] + observation['unknownMaleCount']

            observation = Observation(species=observation['species'],
                adultUnknownCount=observation['adultUnknownCount'],
                adultFemaleCount=observation['adultFemaleCount'],
                adultMaleCount=observation['adultMaleCount'],
                juvenileUnknownCount=observation['juvenileUnknownCount'],
                juvenileFemaleCount=observation['juvenileFemaleCount'],
                juvenileMaleCount=observation['juvenileMaleCount'],
                subadultUnknownCount=observation['subadultUnknownCount'],
                subadultFemaleCount=observation['subadultFemaleCount'],
                subadultMaleCount=observation['subadultMaleCount'],
                unknownUnknownCount=observation['unknownUnknownCount'],
                unknownFemaleCount=observation['unknownFemaleCount'],
                unknownMaleCount=observation['unknownMaleCount'],
                total_count = birdCount,
                direction=observation['direction'],
                bypassSide=observation['bypassSide'],
                notes=observation['notes'],
                observationperiod_id=obspId,
                shorthand_id=shorthand_id)

            db.session().add(observation)

    db.session().commit()

    return jsonify(req)


@bp.route('/api/addDay', methods=['POST'])
@login_required
def add_day():

    req = request.get_json()
    observatory_id = getObservatoryId(req['observatory'])
    
    day=datetime.strptime(req['day'], '%d.%m.%Y')

    day = Day(day=day, comment=req['comment'], observers=req['observers'], observatory_id=observatory_id) 

    addDay(day)
    addedId = getDayId(day.day, day.observatory_id)
    return jsonify({ 'id': addedId })


@bp.route('/api/listDays', methods=['GET'])
@login_required
def list_days():

    dayObjects = getDays()

    ret = []
    for day in dayObjects:
        dayDatetime = day.day
        if not isinstance(dayDatetime, datetime): 
            dayDatetime=datetime.strptime(dayDatetime, '%d.%m.%Y')
        dayString = dayDatetime.strftime('%d.%m.%Y')
        ret.append({ 'id': day.id, 'day': dayString, 'observers': day.observers, 'comment': day.comment, 'observatory': getObservatoryName(day.observatory_id) })

    return jsonify(ret)


@bp.route('/api/editComment/<day_id>/<comment>', methods=['POST'])
@login_required
def edit_comment(day_id, comment):
    day=Day.query.get(day_id)
    day_new = Day(day = day.day, comment = comment, observers = day.observers, observatory_id= day.observatory_id)
    day.is_deleted = 1

    addDay(day_new)
    setObsPerDayId(day.id, day_new.id)

    db.session().commit()

    return jsonify({"id" : day_new.id})

@bp.route('/api/editObservers/<day_id>/<observers>', methods=['POST'])
@login_required
def edit_observers(day_id, observers):
    day=Day.query.get(day_id)
    day_new = Day(day = day.day, comment = day.comment, observers = observers, observatory_id = day.observatory_id)
    day.is_deleted = 1
    addDay(day_new)
    setObsPerDayId(day.id, day_new.id)

    db.session().commit()

    return jsonify({"id" : day_new.id})

@bp.route('/api/searchDayInfo/<date>/<observatory>', methods=['GET'])
@login_required
def search_dayinfo(date, observatory):

    day = Day.query.filter_by(day = date, observatory_id = getObservatoryId(observatory), is_deleted = 0).first()
    res = []
    if not day:
        res.append({ 'id': 0, 'comment': "", 'observers': ""})
    else:
        res.append({ 'id': day.id, 'comment': day.comment, 'observers': day.observers})
    return jsonify(res)

   
@bp.route('/api/getLatestDays/<observatory>', methods=['GET'])
@login_required
def get_latest_days(observatory):

    if observatory == '[object Object]':
        #Jos lintuasemaa ei ole valittu, frontista tulee merkkijono '[object Object]' ja kysely menee rikki
        response = []
        return jsonify(response)
    else:
        observatory_id = getObservatoryId(observatory)

        res = getLatestDays(observatory_id)

        return res