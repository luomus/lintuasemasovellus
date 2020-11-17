from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from app.api.classes.day.models import Day
from app.api.classes.day.services import addDay, getDays, getDayId
from app.api.classes.observatory.services import getObservatoryId, getObservatoryName
from app.api.classes.observationperiod.services import setObsPerDayId

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
def list_days():

    dayObjects = getDays()

    ret = []
    for day in dayObjects:
        ret.append({ 'id': day.id, 'day': day.day, 'observers': day.observers, 'comment': day.comment, 'observatory': getObservatoryName(day.observatory_id) })

    return jsonify(ret)


@bp.route('/api/editComment/<day_id>/<comment>', methods=['POST'])
@login_required
def edit_comment(day_id, comment):
    day=Day.query.get(day_id)
    day_new = Day(day = day.day, comment = comment, observers = day.observers, observatory_id= day.observatory_id)
    day.is_deleted = 1
    addDay(day_new)
    setObsPerDayId(day.id, day_new.id)

    db.session().commit()

    return jsonify("")

@bp.route('/api/editObservers/<day_id>/<observers>', methods=['POST'])
@login_required
def edit_observers(day_id, observers):
    day=Day.query.get(day_id)
    day_new = Day(day = day.day, comment = day.comment, observers = observers, observatory_id = day.observatory_id)
    day.is_deleted = 1
    addDay(day_new)
    setObsPerDayId(day.id, day_new.id)
    
    db.session().commit()

    return jsonify("")

@bp.route('/api/searchDayInfo/<date>/<observatory>', methods=['GET'])
@login_required
def search_dayinfo(date, observatory):

    day = Day.query.filter_by(day = date, observatory_id = getObservatoryId(observatory)).first()
    res = []
    if not day:
        res.append({ 'comment': "", 'observers': ""})
    else:
        res.append({ 'comment': day.comment, 'observers': day.observers})
    return jsonify(res)

   
