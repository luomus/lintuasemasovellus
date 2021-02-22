from application.db import db
from application.api.models import Base

from sqlalchemy.sql import text

class Observation(Base):

    __base_tablename__ = 'observation'

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
    total_count = db.Column(db.Integer, nullable = False)
    direction = db.Column(db.String(144), nullable = True)
    bypassSide = db.Column(db.String(144), nullable = True)
    notes = db.Column(db.String(1000), nullable = True)

    observationperiod_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'observationperiod.id'), nullable=False)

    shorthand_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'shorthand.id'), nullable=True)

    account_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'account.id'), nullable=True)

    def __init__ (self, species, adultUnknownCount,
        adultFemaleCount, adultMaleCount, juvenileUnknownCount, juvenileFemaleCount,
        juvenileMaleCount, subadultUnknownCount, subadultFemaleCount, subadultMaleCount,
        unknownUnknownCount, unknownFemaleCount, unknownMaleCount, total_count, direction, 
        bypassSide, notes, observationperiod_id, shorthand_id, account_id):
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
        self.total_count = total_count
        self.direction = direction
        self.bypassSide = bypassSide
        self.notes = notes
        self.observationperiod_id = observationperiod_id
        self.shorthand_id = shorthand_id
        self.account_id = account_id

        @staticmethod
        def summaryOfBirdsPerDay():
            stmt = text("SELECT Observation.species FROM Observation")
            res = db.engine.execute(stmt)
            response = []
            for row in res:
                response.append({"species": row[0]})
  
            return response

        