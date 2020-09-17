from flask import render_template, request, redirect, url_for

from app.api.classes.observationsession.models import ObservationSession

from app.api import bp
from app.db import db

@bp.route('/havainnointiform', methods=['POST'])
def add_observation():

    o = ObservationSession(request.form.get("observatory"), request.form.get("date"))

    db.session().add(o)
    db.session().commit()

    return redirect(url_for("observations_index"))

@bp.route('/havainnointilist', methods=["POST"])
def observations_index():
    return render_template("/havainnointilist", observations = ObservationSession.query.all())