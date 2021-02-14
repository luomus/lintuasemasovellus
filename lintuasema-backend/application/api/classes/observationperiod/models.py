from application.db import db 
from application.api.models import Base 
  
class Observationperiod(Base):

    __base_tablename__ = 'observationperiod'

    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

    type_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'type.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'location.id'), nullable=False)
    day_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'day.id'), nullable=False)

    Shorthand = db.relationship("Shorthand", backref="observationperiod", lazy=True)

    def __init__ (self, start_time, end_time, type_id, location_id, day_id):
        self.start_time = start_time
        self.end_time = end_time
        self.type_id = type_id
        self.location_id = location_id
        self.day_id = day_id