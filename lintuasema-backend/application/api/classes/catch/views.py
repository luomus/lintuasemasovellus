from flask import request
from flask_login import login_required
from application.api.classes.catch.services import create_catch, get_all
from application.api.classes.observatory.services import getObservatoryId
from application.api.classes.observatoryday.services import getDayId
from application.api import bp

@bp.route('/api/addCatch', methods=['POST'])
@login_required
def addCatch():
    req = request.get_json()
    create_catch(req)

    return req

@bp.route('/api/getAllCatchDetails/<day>/<observatory>', methods=['GET'])
@login_required
def getAllCatchDetails(day, observatory):
    obsday_id = getDayId(day, getObservatoryId(observatory))
    #HUOM! Vastausta ei ole vielä JSONifoitu
    res = get_all(obsday_id)

    return res