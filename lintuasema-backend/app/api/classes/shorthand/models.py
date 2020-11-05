from app.db import db
from app.api.models import Base

class Shorthand(Base):

    row = db.Column(db.String(144), nullable=False)

    observationperiod_id=db.Column(db.Integer, db.ForeignKey('observationperiod.id'), nullable=False)

    Observation = db.relationship("Observation", backref="shorthand", lazy=True)
    
    
    def __init__ (self, row, observationperiod_id):
        self.row=row
        self.observationperiod_id=observationperiod_id