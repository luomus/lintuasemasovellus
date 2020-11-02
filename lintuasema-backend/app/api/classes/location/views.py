from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.location.models import Location
from app.api.classes.observatory.models import Observatory
from app.api.classes.type.models import Type
from app.api.classes.observatory.services import getAll, getObservatoryId

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


@bp.route('/api/getLocationsAndTypes/<observatory_name>', methods=['GET'])
#@login_required
def list_locations(observatory_name):

    if observatory_name is None:
        ret = []
        ret.append({'locations': [], 'types': []})
        return jsonify(ret)

    observatory_id = getObservatoryId(observatory_name)
    ret = []

    locations = Location.query.filter_by(observatory_id = observatory_id)
    locationList = []
    for location in locations:
        locationList.append(location.name)
    types = Type.query.filter_by(observatory_id = observatory_id)
    typeList = []
    for t in types:
        typeList.append(t.name)
    ret.append({ 'locations': locationList, 'types': typeList })

    return jsonify(ret)


@bp.route('/api/getLocations/', methods=['GET'])
#@login_required
def get_all_locations():

    observatories = getAll()
    ret = []
    for observatory in observatories:
        locations = Location.query.filter_by(observatory_id = observatory.id)
        locationList = []
        for location in locations:
            locationList.append(location.name)
        types = Type.query.filter_by(observatory_id = observatory.id)
        typeList = []
        for t in types:
            typeList.append(t.name)
        ret.append({ 'id': observatory.id, 'observatory': observatory.name, 'locations': locationList, 'types': typeList })

    return jsonify(ret)


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