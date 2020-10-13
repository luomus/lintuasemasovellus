from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from app.api.classes.day.models import Day
from app.api.classes.day.services import addDay, getDays
from app.api.classes.observatory.services import getObservatoryId, getObservatoryName

from app.api import bp
from app.db import db

@bp.route('/api/addDay', methods=['POST'])
@login_required
def add_day():

    req = request.get_json()
    observatory_id = getObservatoryId(req['observatory'])
    day = Day(day=req['day'], comment=req['comment'], observers=req['observers'], observatory_id=observatory_id) #testiversio, pitää muuttaa

    added = addDay(day)
    #db.session().add(day)
    #db.session().commit()

    return req
    #return added


@bp.route('/api/listDays', methods=['GET'])
@login_required
def list_day():

    dayObjects = getDays()
    #dayObjects = Day.query.all()
    ret = []
    for each in dayObjects:
        ret.append({ 'id': each.id, 'day': each.day, 'observers': each.observers, 'comment': each.comment, 'observatory': getObservatoryName(each.observatory_id) })

    return jsonify(ret)
