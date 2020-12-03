
from app.api.classes.location.models import Location
from app.db import db
from app.api.classes.observatory.models import Observatory
import os
import json
from flask import jsonify, request


def createLocation(name, id):
    location = Location.query.filter_by(name=name, observatory_id=id).first()
    if not location:
        location = Location(name=name, observatory_id=id)
        db.session().add(loc)
        db.session().commit()

def getLocationId(name, observatory_id):
    loc = Location.query.filter_by(name=name, observatory_id=observatory_id).first()
    return loc.id

def getLocationName(locationId):
    location = Location.query.get(locationId)
    return location.name

def getLocationsAndTypes(observatory_name):
    obs = "not found"
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    filename = os.path.join(SITE_ROOT, '../../..', 'locations.json')
    with open(filename) as json_file:
        data = json.load(json_file)
        for o in data["observatories"]:
            if o["observatory"] == observatory_name:
                obs = o

    return jsonify(obs)

def getAllLocations():
    obs = "not found"
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    filename = os.path.join(SITE_ROOT, '../../..', 'locations.json')
    with open(filename) as json_file:
        data = json.load(json_file)
        obs = data["observatories"] 
    return jsonify(obs)

def editLocation(observatoryname, locationname):
    req = request.get_json()
    newLocName = req['editedname']
    obs = db.session.query(Observatory).filter(name = observatoryname).first()
    location = db.session.query(Location).filter(observatory_id = obs.id, name = locationname).first()
    location.name = newLocName    
    db.session.commit()
    return req    