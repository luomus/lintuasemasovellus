from app.db import db #mihin tiedostoon viittaa
from app.api.models import Base #models tiedosto pitää tehdä, jonne Base
  
class Day(Base):

    __tablename__ = "observationday" #day oli tietokannassa varattu, joten muutetaan tässä

    date=db.Column(db.Date, nullable=False)
 
   
    