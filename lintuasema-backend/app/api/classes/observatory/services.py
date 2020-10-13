
from app.api.classes.observatory.models import Observatory
from app.db import db

def getAll():
    stations = Observatory.query.all()
    return stations

def getObservatoryId(name):
    obs = Observatory.query.filter(name = name).first()
    return obs.id

def getObservatoryName(obsId):
    obs = Observatory.query.filter(id = obsId).first()
    return obs.name

def getFirst(): #tyhmä testi tehty, jotta näkisin toimiiko mikään
    stations=Observatory.query.filter_by(id='1')    #palauttaa listan jossa on yksi kpl observatoryjä
    return stations.first() #otetaan tältä yhden listalta se yksi ja ainoa


def createObservatory(name):
    obs = Observatory.query.filter_by(name=name).first()
    if not obs:
        obs = Observatory(name=name)
        db.session().add(obs)
        db.session().commit()