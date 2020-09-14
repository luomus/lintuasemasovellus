from application import db //mihin tiedostoon viittaa
from application.api.models import Base //models tiedosto pitää tehdä jonne Base
  
class ObservationSession(Base):

    day_id = db.Column(db.Integer, db.ForeignKey('day.id'), nullable=False) //yhden päivän aikana monta observatonsessiota
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False) //yhdellä userilla monta observationsessiota (user taulussa vaihdettu nimi accountiksi)
    

