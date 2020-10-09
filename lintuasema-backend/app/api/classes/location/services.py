
from app.api.classes.location.models import Location
from app.db import db


def createLocation(name, id):
    loc = Location.query.filter_by(name=name, observatory_id=id).first()
    if not loc:
        loc = Location(name=name, observatory_id=id)
        db.session().add(loc)
        db.session().commit()