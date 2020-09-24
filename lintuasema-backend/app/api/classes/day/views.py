from flask import render_template, request, redirect, url_for

from app.api.classes.day.models import Day

from app.api import bp
from app.db import db

@bp.route('/addDay', methods=['GET'])
def add_day():

    print('test')

    o = Day(day='123')

    db.session().add(o)
    db.session().commit()

    return redirect(url_for("index"))


@bp.route('/listDays', methods=['GET'])
def list_day():

    days=Day.query.all()

    s = 'moi'

    for x in days:
        s = s + x.day

    return s
