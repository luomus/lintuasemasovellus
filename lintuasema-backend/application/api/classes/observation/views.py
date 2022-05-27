from flask import request, jsonify

from flask_login import login_required

from application.api.classes.observation.models import Observation
from application.api.classes.observation.services import updateObservation, parseCountString, getDaySummary, getAllObservations, getObservationByPeriod, deleteObservations

from application.api import bp
from application.db import db


@bp.route('/api/getObservations', methods=["GET"])
@login_required
def getObservations():
    ret = getAllObservations()

    return jsonify(ret)

@bp.route('/api/getObservations/<observationperiod_id>', methods=["GET"]) 
@login_required
def getObservationsByObservationPeriod(observationperiod_id):
    ret = getObservationByPeriod(observationperiod_id)

    return jsonify(ret)


@bp.route("/api/deleteObservations", methods=["DELETE"])
@login_required
def observations_delete():
    req = request.get_json()
    deleteObservations(req['shorthand_id'])

    return jsonify(req)


@bp.route('/api/getObservationSummary/<day_id>', methods=["GET"])
@login_required
def getSummary(day_id):
    ret = getDaySummary(day_id)
  
    return jsonify(ret)
  
@bp.route("/api/updateObservation/<sorthand_id>", methods=["POST"])
@login_required
def updateObservationBySorthandId(shorthand_id):
    ret = updateObservation(shorthand_id)
    return jsonify(ret)
