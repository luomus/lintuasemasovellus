from.application import db //TODO tsekkaa oikea tiedosto
from application.api.models import Base

class ObservationStation(Base)

    name = db.Column(db.Column(db.String(144), nullable=False))
    