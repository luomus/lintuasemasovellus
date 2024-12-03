from flask import request, jsonify

from flask_login import login_required

from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observatoryday.services import getDay
from application.api.classes.location.services import getLocationId
from application.api.classes.type.services import getTypeIdByName
from application.api.classes.observationperiod.services import getObsPerId, getObservationPeriodsByDayId, \
    getObservationperiodList, addObservationperiod, deleteObservationperiod, delete_observationperiods, \
    getObservationPeriodCountsByDayId

from application.api.classes.shorthand.models import Shorthand
from application.api.classes.observation.models import Observation

from application.api import bp
from application.db import db


from datetime import datetime

@bp.route('/api/addObservationPeriod', methods=['POST'])
@login_required
def addObservationPeriod():
    req = request.get_json()

    ret = addObservationperiod(req['day_id'], req['location'], req['observationType'], req['startTime'], req['endTime'])

    return jsonify(ret)

@bp.route('/api/getObservationPeriods', methods=["GET"])
@login_required
def getObservationPeriods():
    ret = getObservationperiodList()

    return jsonify(ret)


@bp.route('/api/getDaysObservationPeriods/<day_id>/', methods=["GET"])
@login_required
def getDaysObservationPeriods(day_id):
    ret = getObservationPeriodsByDayId(day_id)

    return ret


@bp.route('/api/getDaysObservationPeriodCounts/<day_id>/', methods=["GET"])
@login_required
def getDaysObservationPeriodCounts(day_id):
    ret = getObservationPeriodCountsByDayId(day_id)

    return ret


@bp.route("/api/deleteObservationperiods", methods=["POST"])
@login_required
def delete_all():
    req = request.get_json()
    delete_observationperiods(req)

    return jsonify(req)


@bp.route("/api/deleteObservationperiod", methods=["DELETE"])
@login_required
def observationperiod_delete():
    req = request.get_json()

    deleteObservationperiod(req['obsperiod_id'])

    return jsonify(req)


@bp.route("/api/saveEditedObservations", methods=["POST"])
@login_required
def save_edited_observationperiods():
    req=request.get_json()
    observation_periods = req["periods"]
    observations = req["observations"]
    dayId =req["dayId"]

    day = getDay(dayId)
    obsId = day.observatory_id

 #Save observation periods
    for i, obsperiod in enumerate(observation_periods):
        locId = getLocationId(obsperiod['location'], obsId)
        obsp = Observationperiod(
            start_time=datetime.strptime(obsperiod['startTime'], '%H:%M'),
            end_time=datetime.strptime(obsperiod['endTime'], '%H:%M'),
            type_id=getTypeIdByName(obsperiod['observationType']),
            location_id=locId, observatoryday_id=dayId)
        db.session().add(obsp)

        obspId = getObsPerId(obsp.start_time, obsp.end_time, obsp.type_id, obsp.location_id, obsp.observatoryday_id)

        # Save original shorthand block of observation period
        shorthand = Shorthand(shorthandblock=obsperiod['shorthandBlock'], observationperiod_id=obspId)
        db.session().add(shorthand)

        shorthand_id = Shorthand.query.filter_by(
            shorthandblock=obsperiod['shorthandBlock'], observationperiod_id=obspId, is_deleted=0).first().id

        #Save observation related to this period
        for observation in observations: #observation = { periodOrderNum: i, subObservations: [] }
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
