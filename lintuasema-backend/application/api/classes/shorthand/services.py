from application.api.classes.shorthand.models import Shorthand
from application.api.classes.observation.services import deleteObservation

from application.api import bp
from application.db import db

def deleteShorthand(id):
    shorthand = Shorthand.query.get(shorthand_id)
    shorthand.is_deleted = 1
    db.session.commit()


def editShorthand(shorthand_id):
    shorthand=Shorthand.query.get(shorthand_id)
    shorthand_new = Day(shorthandrow = new_row, observationperiod_id = shorthand.observationperiod_id)
    shorthand.is_deleted = 1
    deleteObservation(shorthand_id)
    db.session().add(shorthand_new)
    db.session().commit()
    id = str(shorthand_new.id)
    return id

def setShorthandPerDayId(day_id_old, day_id_new):
    shorthand = Shorthand.query.filter_by(day_id = day_id_old).all()
    for sh in shorthand:
        sh.day_id = day_id_new