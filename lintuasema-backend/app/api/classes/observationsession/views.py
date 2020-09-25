from flask import render_template, request, redirect, url_for, jsonify

from app.api.classes.observationsession.models import ObservationSession
from app.api.classes.day.models import Day
from app.api.classes.observationstation.models import ObservationStation

from app.api import bp
from app.db import db

@bp.route('/api/havainnointiform', methods=['POST'])
def add_observation():
    #print("post route triggered")
    content = request.get_json()
    #o = ObservationSession()
    day = Day(content["date"])
    #observation_station = ObservationStation(content["observatory"])
    db.session().add(day)
    #db.session().add(observation_station)
    db.session().commit()
    
    #o = ObservationSession(request.form.get("observatory"), request.form.get("date"))

    #db.session().add(o)
    #db.session().commit()

    return redirect("/")

@bp.route('/api/havainnointilist', methods=["GET"])
def observations_index():
    print("get route triggered")
    objectday = Day.query.first()
    
    return jsonify(day = objectday.day)
