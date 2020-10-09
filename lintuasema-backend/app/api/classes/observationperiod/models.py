from app.db import db 
from app.api.models import Base 
  
class Observationperiod(Base):

    startTime = db.Column(db.DateTime, nullable=False)
    endTime = db.Column(db.DateTime, nullable=False)
    observationType = db.Column(db.String(144), nullable=False)

    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    day_id = db.Column(db.Integer, db.ForeignKey('day.id'), nullable=False) #yhden päivän aikana monta observatonsessiota

    def __init__ (self, startTime, endTime, observationType, location_id, day_id):
        self.startTime = startTime
        self.endTime = endTime
        self.observationType = observationType
        self.location_id = location_id
        self.day_id = day_id

    

