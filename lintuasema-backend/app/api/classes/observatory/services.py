
from app.api.classes.observatory.models import Observatory
from app.db import db

def getAll():
    stations = Observatory.query.all()
    return stations


def getFirst(): #tyhmä testi tehty, jotta näkisin toimiiko mikään
    stations=Observatory.query.filter_by(id='1')    #palauttaa listan jossa on yksi kpl observatoryjä
    return stations.first() #otetaan tältä yhden listalta se yksi ja ainoa


def createObservatory(name):
    db.drop_all()
    obs = Observatory.query.filter_by(name=name).first()
    if not obs:
        obs = Observatory(name=name)
        db.session().add(obs)
        db.session().commit()