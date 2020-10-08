from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.observationsession.models import ObservationSession
from app.api.classes.day.models import Day
from app.api.classes.observatory.models import Observatory

from app.api import bp
from app.db import db

@bp.route('/api/havainnointiform', methods=['POST'])
@login_required
def add_observation():
    content = request.get_json()
    # TODO: do something with json...
    #day = Day(content['date'])
    #db.session().add(day)
    #db.session().commit()

    return redirect('/')

@bp.route('/api/havainnointilist', methods=["GET"])
@login_required
def observations_index():
    return redirect('/')
