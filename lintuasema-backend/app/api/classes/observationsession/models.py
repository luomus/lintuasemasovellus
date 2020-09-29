from app.db import db 
from app.api.models import Base 
  
class ObservationSession(Base):

    day_id = db.Column(db.Integer, db.ForeignKey('day.id'), nullable=False) #yhden päivän aikana monta observatonsessiota
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False) #yhdellä userilla monta observationsessiota (user taulussa vaihdettu nimi accountiksi)
    

