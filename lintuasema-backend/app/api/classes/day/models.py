from app.db import db
from app.api.models import Base 
  
class Day(Base):

    day=db.Column(db.String(144), nullable=False)
    comment=db.Column(db.String(1000), nullable=True)
    observers=db.Column(db.String(200), nullable=False)
    
    observatory_id = db.Column(db.Integer, db.ForeignKey('observatory.id'), nullable=False)

    Observationperiod=db.relationship("Observationperiod", backref="day", lazy=True)
    

    def __init__ (self, day, comment, observers, observatory_id):
        self.day=day
        self.comment=comment
        self.observers=observers
        self.observatory_id=observatory_id