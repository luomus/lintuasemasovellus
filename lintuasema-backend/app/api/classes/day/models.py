from app.db import db #mihin tiedostoon viittaa
from app.api.models import Base #models tiedosto pitää tehdä, jonne Base
#from app.api.models import ObservationStation
  
class Day(Base):

    day=db.Column(db.String(144), nullable=False)
    comment=db.Column(db.String(1000), nullable=True)
    observers=db.Column(db.String(200), nullable=False) #ainakin yksi tarkkaillut, joten ei voi laittaa nollaksi
    
    observationStation_id = db.Column(db.Integer, db.ForeignKey('observation_station.id'), nullable=False)
    

    def __init__ (self, day, comment, observers, observationStation_id):
        self.day=day
        self.comment=comment
        self.observers=observers
        self.observationStation_id=observationStation_id
       
    
   
    