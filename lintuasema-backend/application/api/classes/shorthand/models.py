from application.db import db
from application.api.models import Base

class Shorthand(Base):

    __base_tablename__ = 'shorthand'

    shorthandrow = db.Column(db.String(144), nullable=False)
    #TOBEADDED: shorthandblock = db.Column(db.String(1000), nullable=False)
    #TOBEADDED: comment=db.Column(db.String(1000), nullable=True)
    #TOBEADDED: observers=db.Column(db.String(200), nullable=False)

    observationperiod_id=db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'observationperiod.id'), nullable=False)

    Observation = db.relationship("Observation", backref="shorthand", lazy=True)
    
    
    def __init__ (self, shorthandrow, observationperiod_id):
        self.shorthandrow=shorthandrow
        self.observationperiod_id=observationperiod_id