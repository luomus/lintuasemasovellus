from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from app.api.classes.observationstation.models import ObservationStation

from app.api import bp
from app.db import db


@bp.route('/api/getStations', methods=['GET'])
@login_required
def list_stations():

    stations = ObservationStation.query.all()
    ret = []
    for each in stations:
        ret.append({'id': each.id, 'name': each.name})

    return jsonify(ret)
