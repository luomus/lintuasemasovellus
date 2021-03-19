from flask import request, jsonify, json
from flask_login import login_required
from application.api.classes.catch.services import create_catches, get_all
from application.api.classes.observatory.services import getObservatoryId
from application.api.classes.observatoryday.services import getDayId
from application.api import bp

@bp.route('/api/addCatches', methods=['POST'])
@login_required
def addCatches():

    req = request.get_json()
    create_catches(req)

    return jsonify(req)

@bp.route('/api/getAllCatchDetails/<day>/<observatory>', methods=['GET'])
@login_required
def getAllCatchDetails(day, observatory):
    obsday_id = getDayId(day, getObservatoryId(observatory))
    res = get_all(obsday_id)

    return jsonify(res)