from application.api.classes.shorthand.models import Shorthand
from application.api.classes.observation.services import deleteObservation

from application.api import bp
from application.db import db


def editShorthand(shorthand_id, new_block):
    shorthand_old=Shorthand.query.get(shorthand_id)
    shorthand_new = Shorthand(shorthandblock = new_block, observationperiod_id = shorthand_old.observationperiod_id)
    shorthand_old.is_deleted = 1
    deleteObservation(shorthand_id)
    db.session().add(shorthand_new)
    db.session().commit()
    id = str(shorthand_new.id)
    return id

def setShorthandPerDayId(day_id_old, day_id_new):
    shorthand = Shorthand.query.filter_by(observatoryday_id = day_id_old).all()
    for sh in shorthand:
        sh.observatoryday_id = day_id_new