from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from application.api.classes.observatoryday.models import Observatoryday
from application.api.classes.observatoryday.services import addDay, getDays, getDayId, getLatestDays, addDayFromReq, listDays, update_actions, update_comment, update_observers, get_day_without_id
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

#Tämä voisi olla pohjana tallennuksen optimoinnille, selvitellään.
@bp.route('/api/addEverything', methods=['POST'])
@login_required
def add_everything():
  # SAAPUVA DATA:
  # {
  #    day, comment, observers, observatory, selectedactions, userID,
  #    catches,
  #    observationPeriods,
  #    observervations
  #  };

  # Ensimmäinen rivi kaikki stringejä
  # catches: Lista pyydysobjekteja, TARVITSEE dayIDn ennen tallentamista
  # Observationperiods: Lista havaintojakso-objekteja, TARVITSEE dayID:n ennen tallentamista
          # observationPeriod = {
          #   location,
          #   startTime,
          #   endTime,
          #   observationType,
          # };
  # observations: lista objekteja, joista jokainen sisältää orig. pikakirjoitusrivin
    # ja listan osahavainto-objekteja:
        # [{ periodOrderNum: i, shorthandRow: row, subObservations: [] },  ]

    # shorthand TARVITSEE observationperiod-ID:n 
    # subObservation TARVITSEE obsperiod-IDn ja shorthandID:n  
    # Observations objektin tietueen 'periodOrderNum, pitäisi vastata observationsPeriods-listan indekseihin,
    # eli jos periodOrderNum on 1, liittyy se observationPeriods-listan indeksissä 1 olevaan havaintojaksoon.
    # Tätä tietoa tarvitaan oikean jakson id:n liittämisessä havaintoonzo

    print('***\nData arriving in add-everything')
    req = request.get_json()

    # Save observatoryDay 
    observatory_id = getObservatoryId(req['observatory'])
    print('observatory_id', observatory_id)
    day = datetime.strptime(req['day'], '%d.%m.%Y')

    new_obsday = Observatoryday(day=day, comment=req['comment'], observers=req['observers'], selectedactions=req['selectedactions'], observatory_id=observatory_id)
    addDay(new_obsday)

    # get dayID of just created day and and then the actual day as Flask/db object
    dayId = getDayId(new_obsday.day, new_obsday.observatory_id)
    day = getDay(dayId)

    #Miksi tämä otetaan taas? Sehän on jo haettu aiemmin kerran, ei pitäisi muuttua?
    obsId = day.observatory_id

    # Save catches
    catches_with_dayId = req['catches'].insert(0, dayId)
    create_catches(catches_with_dayId)


    #Save observationperiods
    for obsperiod in req['observationPeriods']:
        locId = getLocationId(obsperiod['location'], obsId)

        obsp = Observationperiod(
            start_time=datetime.strptime(obsperiod['startTime'], '%H:%M'),
            end_time=datetime.strptime(obsperiod['endTime'], '%H:%M'),
            type_id=getTypeIdByName(req['type']),
            location_id=locId, observatoryday_id=dayId)
        db.session().add(obsp)

        obspId = getObsPerId(obsp.start_time, obsp.end_time, obsp.type_id, obsp.location_id, obsp.observatoryday_id)

        for observation in obsperiod['observations']:
            shorthand = Shorthand(shorthandblock=observation['shorthandblock'], observationperiod_id=obspId)
            db.session().add(shorthand)


            shorthand_id = Shorthand.query.filter_by(
                shorthandblock=observation['shorthandblock'], observationperiod_id=obspId, is_deleted=0).first().id


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

    print('End of add_everything***\n')

    return jsonify(req)


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