from app.db import db #TODO tsekkaa oikea tiedosto
from app.api.models import Base

class ObservationStation(Base):

    name = db.Column(db.String(144), nullable=False)

    Day=db.relationship("Day", backref="observation_station", lazy=True)
    
    def __init__ (self, name):
        self.name=name

    # def getAll(self):
    #     stations = self.query.all()
    #     return stations
        
        
        