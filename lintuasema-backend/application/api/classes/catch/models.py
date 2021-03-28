from application.db import db, prefix
from application.api.models import Base

class Catch(Base):

    __base_tablename__ = 'catch'

    observatoryday_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'observatoryday.id'), nullable=False)
    catchType = db.Column(db.String(144), nullable = False)
    location = db.Column(db.String(144), nullable = False)
    netCode = db.Column(db.String(144), nullable = True)
    amount = db.Column(db.Integer, nullable = False)
    length = db.Column(db.Integer, nullable = False)
    openedAt = db.Column(db.String(144), nullable = False)
    closedAt = db.Column(db.String(144), nullable = False)
    dayRowNumber = db.Column(db.Integer, nullable = False)

    def __init__ (self, observatoryday_id, catchType, location, netCode, amount, length, openedAt, closedAt, dayRowNumber):
        self.observatoryday_id = observatoryday_id
        self.catchType = catchType
        self.location = location
        self.netCode = netCode
        self.amount = amount
        self.length = length
        self.openedAt = openedAt
        self.closedAt = closedAt
        self.dayRowNumber = dayRowNumber