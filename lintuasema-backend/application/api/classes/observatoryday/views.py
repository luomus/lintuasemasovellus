from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from application.api.classes.observatoryday.models import Observatoryday
from application.api.classes.observatoryday.services import addDay, getDays, createEmptyObsPeriods, editLocalObs, editLocalGau, checkPeriod, getDayId, getLatestDays, addDayFromReq, listDays, update_actions, update_comment, update_observers, get_day_without_id
from application.api.classes.observatory.services import getObservatoryId

from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.type.models import Type
from application.api.classes.observatory.models import Observatory
from application.api.classes.location.services import getLocationId
from application.api.classes.observationperiod.services import getObsPerId
from application.api.classes.observatoryday.services import getDay
from application.api.classes.type.services import getTypeIdByName

from application.api.classes.catch.services import create_catches

from application.api.classes.observation.models import Observation
from application.api.classes.shorthand.models import Shorthand

from application.api import bp
from application.db import db
from sqlalchemy.sql import text

from datetime import datetime

@bp.route('/api/addEverything', methods=['POST'])
@login_required
def add_everything():
  # ARRIVING DATA:
  # {
  #    day, comment, observers, observatory, selectedactions, userID,
  #    catches, [{},{},{}]
  #    observationPeriods, [{},{},{}]
  #    observations [{},{},{}]
  #  };

    req = request.get_json()

    # Save observatoryDay 
    observatory_id = getObservatoryId(req['observatory'])
    day = datetime.strptime(req['day'], '%d.%m.%Y')

    new_obsday = Observatoryday(day=day, comment=req['comment'], observers=req['observers'], selectedactions=req['selectedactions'], observatory_id=observatory_id)
    addDay(new_obsday)

    # get dayID of just created day and and then the actual day as Flask/db object
    dayId = getDayId(new_obsday.day, new_obsday.observatory_id)
    day = getDay(dayId)

    obsId = day.observatory_id

    # Save catches
    if len(req['catches']) > 0:
        catches = req['catches']
        catches_with_dayId = catches
        catches_with_dayId.insert(0, dayId)
        create_catches(catches_with_dayId)
    #print(req['observationPeriods'])
    #print(type(req['observationPeriods']))

    #Create an empty obsperiod if one does not already exist
    #editLocalObs(dayId, 'FRICOE', 99, req['userID'])

    #Save observation periods
    for i, obsperiod in enumerate(req['observationPeriods']):
        locId = getLocationId(obsperiod['location'], obsId)
        obsp = Observationperiod(
            start_time=datetime.strptime(obsperiod['startTime'], '%H:%M'),        
            end_time=datetime.strptime(obsperiod['endTime'], '%H:%M'),
            type_id=getTypeIdByName(obsperiod['observationType']),
            location_id=locId, observatoryday_id=dayId)
        db.session().add(obsp)
        

        # observation period ID
        obspId = getObsPerId(obsp.start_time, obsp.end_time, obsp.type_id, obsp.location_id, obsp.observatoryday_id)
        #print(obsperiod['shorthandBlock'])
        # Save original shorthand block of observation period
        shorthand = Shorthand(shorthandblock=obsperiod['shorthandBlock'], observationperiod_id=obspId)
        db.session().add(shorthand)

        shorthand_id = Shorthand.query.filter_by(
            shorthandblock=obsperiod['shorthandBlock'], observationperiod_id=obspId, is_deleted=0).first().id

        #Save observation related to this period
        for observation in req['observations']: #observation = { periodOrderNum: i, subObservations: [] }
            if observation['periodOrderNum'] == str(i):

                for subObservation in observation['subObservations']:
                    birdCount = subObservation['adultUnknownCount'] + subObservation['adultFemaleCount']\
                    + subObservation['adultMaleCount'] + subObservation['juvenileUnknownCount'] + subObservation['juvenileFemaleCount']\
                    + subObservation['juvenileMaleCount'] + subObservation['subadultUnknownCount'] + subObservation['subadultFemaleCount']\
                    + subObservation['subadultMaleCount'] + subObservation['unknownUnknownCount'] + subObservation['unknownFemaleCount']\
                    + subObservation['unknownMaleCount']
                    sub_observation = Observation(species=subObservation['species'],
                        adultUnknownCount=subObservation['adultUnknownCount'],
                        adultFemaleCount=subObservation['adultFemaleCount'],
                        adultMaleCount=subObservation['adultMaleCount'],
                        juvenileUnknownCount=subObservation['juvenileUnknownCount'],
                        juvenileFemaleCount=subObservation['juvenileFemaleCount'],
                        juvenileMaleCount=subObservation['juvenileMaleCount'],
                        subadultUnknownCount=subObservation['subadultUnknownCount'],
                        subadultFemaleCount=subObservation['subadultFemaleCount'],
                        subadultMaleCount=subObservation['subadultMaleCount'],
                        unknownUnknownCount=subObservation['unknownUnknownCount'],
                        unknownFemaleCount=subObservation['unknownFemaleCount'],
                        unknownMaleCount=subObservation['unknownMaleCount'],
                        total_count = birdCount,
                        direction=subObservation['direction'],
                        bypassSide=subObservation['bypassSide'],
                        notes=subObservation['notes'],
                        observationperiod_id=obspId,
                        shorthand_id=shorthand_id,
                        account_id=req['userID'])   

                    db.session().add(sub_observation)

    db.session().commit()

    return jsonify(req)


@bp.route('/api/updateLocalObservation', methods=['POST']) #Backend for editing the local-column for a species in day details.
@login_required
def update_local():
    req=request.get_json()
    print(req)
    day=datetime.strptime(req['date'], '%d.%m.%Y')
    obserid=getObservatoryId("Hangon_Lintuasema")
    obsday_id=getDayId(day, obserid)
    editLocalObs(obsday_id, req['species'], req['count'], 1)
    return req['count']
    
@bp.route('/api/updateLocalGauObservation', methods=['POST']) #Backend for editing the local-column for a species in day details.
@login_required
def update_local_gau():
    req=request.get_json()
    print(req)
    day=datetime.strptime(req['date'], '%d.%m.%Y')
    obserid=getObservatoryId("Hangon_Lintuasema")
    obsday_id=getDayId(day, obserid)
    editLocalGau(obsday_id, req['species'], req['count'], 1)
    return req['count']

@bp.route('/api/addDay', methods=['POST'])
@login_required
def add_day():
    req = request.get_json()
  
    ret = addDayFromReq(req)

    return jsonify(ret)


@bp.route('/api/listDays', methods=['GET'])
@login_required
def list_days():
    ret = listDays()

    return jsonify(ret)

@bp.route('/api/removeComment/<obsday_id>', methods=['POST'])
@login_required
def remove_comment(obsday_id):
    ret = update_comment(obsday_id, "")

    return jsonify(ret)

@bp.route('/api/editComment/<obsday_id>/<comment>', methods=['POST'])
@login_required
def edit_comment(obsday_id, comment):
    ret = update_comment(obsday_id, comment)

    return jsonify(ret)

@bp.route('/api/editObservers/<obsday_id>/<observers>', methods=['POST'])
@login_required
def edit_observers(obsday_id, observers):
    ret = update_observers(obsday_id, observers)

    return jsonify(ret)

@bp.route('/api/editActions/<obsday_id>/<actions>', methods=['POST'])
@login_required
def edit_actions(obsday_id, actions):
    ret = update_actions(obsday_id, actions)
    
    return jsonify(ret)

@bp.route('/api/searchDayInfo/<day>/<observatory>', methods=['GET'])
@login_required
def search_dayinfo(day, observatory):
    ret = get_day_without_id(day, observatory)
    return jsonify(ret)


@bp.route('/api/getLatestDays/<observatory>', methods=['GET'])
@login_required
def get_latest_days(observatory):
    res = []
    #Jos lintuasemaa ei ole valittu, frontista tulee merkkijono '[object Object]' ja kysely menee rikki
    if observatory != '[object Object]':
        observatory_id = getObservatoryId(observatory)
        
        res = getLatestDays(observatory_id)

    return jsonify(res)


    