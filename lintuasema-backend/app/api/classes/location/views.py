from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.location.models import Location

from app.api import bp
from app.db import db

@bp.route('/api/addLocation', methods=['POST'])
@login_required
def add_location():

    req = request.get_json()
    location = Location(name=req['name'], observatory_id=req['observatory_id'])

    db.session().add(location)
    db.session().commit()

    return req


@bp.route('/api/getLocations/<observatory_id>', methods=['GET'])
@login_required
def list_locations(observatory_id):

    objects = Location.query.filter_by(observatory_id = observatory_id)
    ret = []
    for each in objects:
        ret.append({ 'name': each.name, 'id': each.id })

    return jsonify(ret)