from.application import db //TODO tsekkaa oikea tiedosto
from application.api.models import Base

public class Location(Base):

    name = db.Column(db.Name, nullable = False)
    observation_station_id = db.Column(
        db.Integer, db.ForeignKey('observation_station.id'), nullable=False)