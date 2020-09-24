from app.db import db #mihin tiedostoon viittaa
from app.api.models import Base #models tiedosto pitää tehdä, jonne Base
  
class Day(Base):

    day=db.Column(db.String(144), nullable=False)

    def __init__ (self, day):
        self.day=day
       
    
   
    