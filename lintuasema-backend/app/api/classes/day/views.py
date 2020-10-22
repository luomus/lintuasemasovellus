from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from app.api.classes.day.models import Day
from app.api.classes.day.services import addDay, getDays, getDayId
from app.api.classes.observatory.services import getObservatoryId, getObservatoryName

from app.api import bp
from app.db import db

@bp.route('/api/addDay', methods=['POST'])
@login_required
def add_day():

    req = request.get_json()
    observatory_id = getObservatoryId(req['observatory'])
    day = Day(day=req['day'], comment=req['comment'], observers=req['observers'], observatory_id=observatory_id) #testiversio, pitää muuttaa

    #addedId = addDay(day)
    addDay(day)
    addedId = getDayId(day.day, day.observatory_id)
    #print("lisätyn päivän id on ", addedId)
    return jsonify({ 'id': addedId })


@bp.route('/api/listDays', methods=['GET'])
@login_required
def list_day():

    dayObjects = getDays()

    ret = []
    for each in dayObjects:
        ret.append({ 'id': each.id, 'day': each.day, 'observers': each.observers, 'comment': each.comment, 'observatory': getObservatoryName(each.observatory_id) })

    return jsonify(ret)


@bp.route('/api/listDays/<day_id>', methods=['POST'])
@login_required
def edit_day(day_id, comment, observers):
    day=Day.query.get(day_id)
    day.comment=comment
    day.observers=observers

    db.commit(day)

   
