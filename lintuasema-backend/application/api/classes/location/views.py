from flask import request, jsonify, json
from flask_login import login_required

from application.api.classes.location.services import getLocationsAndTypes, getAllLocations

from application.api import bp
from application.db import db

import json


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
