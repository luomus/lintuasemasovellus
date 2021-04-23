from application.db import db
from application.api.models import Base

class Shorthand(Base):

    __base_tablename__ = 'shorthand'

    shorthandblock = db.Column(db.String(4000), nullable=False)

    observationperiod_id=db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'observationperiod.id'), nullable=False)

    Observation = db.relationship("Observation", backref="shorthand", lazy=True)
    
    
    def __init__ (self, shorthandblock, observationperiod_id):
        self.shorthandblock=shorthandblock
        self.observationperiod_id=observationperiod_id