from app.db import db 
from app.api.models import Base 
  
class Observationperiod(Base):

    startTime = db.Column(db.DateTime, nullable=False)
    endTime = db.Column(db.DateTime, nullable=False)

    type_id = db.Column(db.Integer, db.ForeignKey('type.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    day_id = db.Column(db.Integer, db.ForeignKey('day.id'), nullable=False)
    shorthand_id=db.Column(db.Integer, db.ForeignKey('shorthand.id'), nullable=True)

    def __init__ (self, startTime, endTime, type_id, location_id, day_id):
        self.startTime = startTime
        self.endTime = endTime
        self.type_id = type_id
        self.location_id = location_id
        self.day_id = day_id

    

