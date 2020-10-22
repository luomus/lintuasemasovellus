from app.db import db
from app.api.models import Base

class Shorthand(Base):

    name = db.Column(db.String(144), nullable=False)

    Observationperiod = db.relationship("Observationperiod", backref="shorthand", lazy=True)
    
    
    def __init__ (self, name):
        self.name=name