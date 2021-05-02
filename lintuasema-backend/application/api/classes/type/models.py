from application.db import db
from application.api.models import Base

class Type(Base):

    __base_tablename__ = 'type'

    name = db.Column(db.String(144), nullable=False)
    observatory_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'observatory.id'), nullable=False)
    Observationperiod = db.relationship("Observationperiod", backref="type", lazy=True)
    
    def __init__ (self, name, observatory_id):
        self.name=name
        self.observatory_id=observatory_id