from app.db import db
from app.api.models import Base

class Observation(Base):

    species = db.Column(db.String(144), nullable = False)
    adultUnknownCount = db.Column(db.Integer, nullable = False)
    adultFemaleCount = db.Column(db.Integer, nullable = False)
    adultMaleCount = db.Column(db.Integer, nullable = False)
    juvenileUnknownCount = db.Column(db.Integer, nullable = False)
    juvenileFemaleCount = db.Column(db.Integer, nullable = False)
    juvenileMaleCount = db.Column(db.Integer, nullable = False)
    subadultUnknownCount = db.Column(db.Integer, nullable = False)
    subadultFemaleCount = db.Column(db.Integer, nullable = False)
    subadultMaleCount = db.Column(db.Integer, nullable = False)
    unknownUnknownCount = db.Column(db.Integer, nullable = False)
    unknownFemaleCount = db.Column(db.Integer, nullable = False)
    unknownMaleCount = db.Column(db.Integer, nullable = False)
    direction = db.Column(db.String(144), nullable = True)
    bypassSide = db.Column(db.String(144), nullable = True)
    notes = db.Column(db.String(1000), nullable = True)

    observationperiod_id = db.Column(db.Integer, db.ForeignKey('observationperiod.id'), nullable=False)

    shorthand_id = db.Column(db.Integer, db.ForeignKey('shorthand.id'), nullable=True)

    def __init__ (self, species, adultUnknownCount,
        adultFemaleCount, adultMaleCount, juvenileUnknownCount, juvenileFemaleCount,
        juvenileMaleCount, subadultUnknownCount, subadultFemaleCount, subadultMaleCount,
        unknownUnknownCount, unknownFemaleCount, unknownMaleCount, direction, bypassSide, notes, observationperiod_id, shorthand_id):
        self.species = species
        self.adultUnknownCount = adultUnknownCount
        self.adultFemaleCount = adultFemaleCount
        self.adultMaleCount = adultMaleCount
        self.juvenileUnknownCount = juvenileUnknownCount
        self.juvenileFemaleCount = juvenileFemaleCount
        self.juvenileMaleCount = juvenileMaleCount
        self.subadultUnknownCount = subadultUnknownCount
        self.subadultFemaleCount = subadultFemaleCount
        self.subadultMaleCount = subadultMaleCount
        self.unknownUnknownCount = unknownUnknownCount
        self.unknownFemaleCount = unknownFemaleCount
        self.unknownMaleCount = unknownMaleCount
        self.direction = direction
        self.bypassSide = bypassSide
        self.notes = notes
        self.observationperiod_id = observationperiod_id
        self.shorthand_id = shorthand_id