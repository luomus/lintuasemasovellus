from flask import render_template, request, redirect, url_for, jsonify, json

from flask_login import login_required

from app.api.classes.location.models import Location
from app.api.classes.observatory.models import Observatory
from app.api.classes.type.models import Type
from app.api.classes.observatory.services import getAll, getObservatoryId

from app.api.classes.location.services import getLocationsAndTypes, getAllLocations, editLocation

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

    res =getAllLocations()

    return res


#alustava route lokaation nimen muokkaamiseen
@bp.route("/api/edit/<observatoryname>/<locationname>", methods=["POST"])
@login_required
def edit_location(observatoryname, locationname):

    req = editLocation(observatoryname, locationname)
    return req