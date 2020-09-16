from app.db import db #TODO tsekkaa oikea tiedosto
from app.api.models import Base

class Location(Base):

    name = db.Column(db.String(144), nullable = False)
    observation_station_id = db.Column(db.Integer, db.ForeignKey('observation_station.id'), nullable=False)