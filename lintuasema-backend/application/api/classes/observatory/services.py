
from application.api.classes.observatory.models import Observatory
from application.db import db

def getAll():
    stations = Observatory.query.all()
    
    return stations

def getAllJSON():
    observatories = getAll()
    ret = []
    for obs in observatories:
        ret.append({'id': obs.id, 'name': obs.name})
    
    return ret

def getObservatoryId(name):
    obs = Observatory.query.filter_by(name = name).first()
    
    return obs.id

def getObservatoryName(obsId):
    obs = Observatory.query.filter_by(id = obsId).first()
    
    return obs.name

def createObservatory(name, actions):
    obs = Observatory.query.filter_by(name=name).first()
    if not obs:
        obs = Observatory(name=name, actions=actions)
        db.session().add(obs)
        db.session().commit()

def get_observatory_actions(obsId):
    obs = Observatory.query.filter_by(id = obsId).first()
    
    return obs.actions