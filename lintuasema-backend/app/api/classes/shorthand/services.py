from app.api.classes.shorthand.models import Shorthand

from app.api import bp
from app.db import db

def deleteShorthand(id):
    shorthand = Shorthand.query.get(shorthand_id)
    shorthand.is_deleted = 1
    db.session.commit()
