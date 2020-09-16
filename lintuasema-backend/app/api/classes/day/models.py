from app import db #mihin tiedostoon viittaa
from application.api.models import Base #models tiedosto pitää tehdä, jonne Base
  
class Day(Base):

    date=db.Column(db.Date, nullable=False)
 
   
    