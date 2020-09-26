from flask import render_template, request, redirect, url_for,\
    jsonify

from app.api.classes.day.models import Day

from app.api import bp
from app.db import db

@bp.route('/api/addDay', methods=['POST'])
def add_day():

    req = request.get_json()
    o = Day(day=req['day'])

    db.session().add(o)
    db.session().commit()

    return redirect('/')


@bp.route('/api/listDays', methods=['GET'])
def list_day():

    dayObjects = Day.query.all()
    ret = []
    for each in dayObjects:
        ret.append({ 'day': each.day })

    return jsonify(ret)
