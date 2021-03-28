from flask import request, jsonify, json
from flask_login import login_required
from application.api.classes.catch.services import create_catches, get_all, create_catch, delete_catch
from application.api.classes.observatory.services import getObservatoryId
from application.api.classes.observatoryday.services import getDayId
from application.api import bp

@bp.route('/api/addCatches', methods=['POST'])
@login_required
def addCatches():

    req = request.get_json()
    create_catches(req)

    return jsonify(req)

@bp.route('/api/getCatchDetails/<dayId>', methods=['GET'])
@login_required
def getCatchDetails(dayId):

    res = get_all(dayId)
    return jsonify(res)


@bp.route('/api/editCatches/<dayId>', methods=['POST'])
@login_required  
def editCatches(dayId):
    req = request.get_json()
    if len(req) > 0:
        create_catch(req[0], dayId)
    
    return jsonify(req)

@bp.route('/api/deleteCatch/<dayId>/<dayRowNumber>', methods=['DELETE'])
@login_required  
def deleteCatch(dayId, dayRowNumber):
    delete_catch(dayRowNumber, dayId)

    return dayRowNumber

