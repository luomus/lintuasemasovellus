from flask import render_template, request, redirect, url_for, jsonify, json

from flask_login import login_required

from app.api.classes.location.models import Location
from app.api.classes.observatory.models import Observatory
from app.api.classes.type.models import Type
from app.api.classes.observatory.services import getAll, getObservatoryId


from app.api.classes.location.services import getLocationsAndTypes

from app.api import bp
from app.db import db

import os
import json

@bp.route('/api/addLocation', methods=['POST'])
@login_required
def add_location():

    req = request.get_json()
    location = Location(name=req['name'], observatory_id=req['observatory_id'])

    db.session().add(location)
    db.session().commit()

    return req


@bp.route('/api/getLocationsAndTypes/<observatory_name>', methods=['GET'])
#@login_required
def list_locations(observatory_name):

    res = getLocationsAndTypes(observatory_name)

    return res


@bp.route('/api/getLocations/', methods=['GET'])
#@login_required
def get_all_locations():

    obs = "not found"
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    filename = os.path.join(SITE_ROOT, '../../..', 'locations.json')
    with open(filename) as json_file:
        data = json.load(json_file)
        obs = data["observatories"]
    
    return jsonify(obs)


#alustava route lokaation nimen muokkaamiseen
@bp.route("/api/edit/<observatoryname>/<locationname>", methods=["POST"])
@login_required
def edit_location(observatoryname, locationname):
    req = request.get_json()
    newLocName = req['editedname']
    obs = db.session.query(Observatory).filter(name = observatoryname).first()
    location = db.session.query(Location).filter(observatory_id = obs.id, name = locationname).first()
    location.name = newLocName    
    db.session.commit()
    return req    