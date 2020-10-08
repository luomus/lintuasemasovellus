from app.db import db #TODO tsekkaa oikea tiedosto
from app.api.models import Base

class Observation(Base):

    species = db.Column(db.String(144), nullable = False)
    adultUnknownCount = db.Column(db.Integer, nullable = True)
    adultFemaleCount = db.Column(db.Integer, nullable = True)
    adultMaleCount = db.Column(db.Integer, nullable = True)
    juvenileUnknownCount = db.Column(db.Integer, nullable = True)
    juvenileFemaleCount = db.Column(db.Integer, nullable = True)
    juvenileMaleCount = db.Column(db.Integer, nullable = True)
    subadultUnknownCount = db.Column(db.Integer, nullable = True)
    subadultFemaleCount = db.Column(db.Integer, nullable = True)
    subadultMaleCount = db.Column(db.Integer, nullable = True)
    unknownUnknownCount = db.Column(db.Integer, nullable = True)
    direction = db.Column(db.String(144), nullable = True)
    bypassSide = db.Column(db.String(144), nullable = True)
    notes = db.Column(db.String(1000), nullable = True)

    observationperiod_id = db.Column(db.Integer, db.ForeignKey('observationperiod.id'), nullable=False)

    def __init__ (self, species, observationperiod_id):
        self.species = species
        self.observationperiod_id = observationperiod_id