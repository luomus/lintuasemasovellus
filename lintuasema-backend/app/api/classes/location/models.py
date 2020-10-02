from app.db import db #TODO tsekkaa oikea tiedosto
from app.api.models import Base

class Location(Base):

    name = db.Column(db.String(144), nullable = False)
    observatory_id = db.Column(db.Integer, db.ForeignKey('observatory.id'), nullable=False)
