from flask import request, jsonify, json
from flask_login import login_required

from application.api.classes.location.services import getLocationsAndTypes, getAllLocations, editLocation, createLocation

from application.api import bp
from application.db import db

import json

@bp.route('/api/addLocation', methods=['POST'])
@login_required
def add_location():

    req = request.get_json()
    
    createLocation(req['name'], req['observatory_id'])

    return req


@bp.route('/api/getLocationsAndTypes/<observatory_name>', methods=['GET'])
#@login_required
def list_locations(observatory_name):
    
    res = getLocationsAndTypes(observatory_name)
    
    return res


@bp.route('/api/getLocations/', methods=['GET'])
#@login_required
def get_all_locations():

    res = getAllLocations()

    return res


#alustava route lokaation nimen muokkaamiseen
@bp.route("/api/edit/<observatoryname>/<locationname>", methods=['POST'])
@login_required
def edit_location(observatoryname, locationname):

    req = editLocation(observatoryname, locationname)

    return req