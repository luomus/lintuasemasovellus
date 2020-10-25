
from app.api.classes.type.models import Type
from app.db import db


def createType(name, id):
    t = Type.query.filter_by(name=name, observatory_id=id).first()
    if not t:
        t = Type(name=name, observatory_id=id)
        db.session().add(t)
        db.session().commit()

def getTypeIdByName(name):
    t = Type.query.filter_by(name=name).first()
    return t.id

def getTypeNameById(id):
    t = Type.query.filter_by(id=id).first()
    return t.name