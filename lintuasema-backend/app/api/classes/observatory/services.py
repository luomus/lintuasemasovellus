
from app.api.classes.observatory.models import Observatory
from app.db import db

def getAll():
    stations = Observatory.query.all()
    return stations

def getObservatoryId(name):
    obs = Observatory.query.filter_by(name = name).first()
    return obs.id

def getObservatoryName(obsId):
    obs = Observatory.query.filter_by(id = obsId).first()
    return obs.name

def createObservatory(name):
    obs = Observatory.query.filter_by(name=name).first()
    if not obs:
        obs = Observatory(name=name)
        db.session().add(obs)
        db.session().commit()