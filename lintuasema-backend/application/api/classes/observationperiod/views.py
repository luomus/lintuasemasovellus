from flask import request, jsonify

from flask_login import login_required

from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observationperiod.services import getObsPerId, getObservationPeriodsByDayId, getObservationperiodList, addObservationperiod, deleteObservationperiod

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


@bp.route("/api/deleteObservationperiod", methods=["DELETE"])
@login_required
def observationperiod_delete():
    req = request.get_json()
    
    deleteObservationperiod(req['obsperiod_id'])
    
    return jsonify(req)