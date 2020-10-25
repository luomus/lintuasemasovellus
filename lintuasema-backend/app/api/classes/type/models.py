from app.db import db
from app.api.models import Base

class Type(Base):

    name = db.Column(db.String(144), nullable=False)

    observatory_id = db.Column(db.Integer, db.ForeignKey('observatory.id'), nullable=False)

    Observationperiod = db.relationship("Observationperiod", backref="type", lazy=True)
    
    def __init__ (self, name, observatory_id):
        self.name=name
        self.observatory_id=observatory_id