from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.shorthand.models import Shorthand
from app.api.classes.observation.models import Observation
from app.api.classes.observationperiod.models import Observationperiod

from app.api import bp
from app.db import db


@bp.route('/api/addShorthand', methods=['POST'])
@login_required
def addShorthand():
    req = request.get_json()
    shorthand = Shorthand(row=req['row'],
        observationperiod_id=req['observationperiod_id'])
    db.session().add(shorthand)
    db.session().commit()

    shorthand_id = Shorthand.query.filter_by(row = req['row'], observationperiod_id = req['observationperiod_id']).first().id

    return shorthand_id

