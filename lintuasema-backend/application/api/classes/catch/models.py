from application.db import db, prefix
from application.api.models import Base

class Catch(Base):

    __base_tablename__ = 'catch'

    observatoryday_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'observatoryday.id'), nullable=False)
    catchArea = db.Column(db.String(144), nullable = False)
    catchMethod = db.Column(db.String(144), nullable = False)
    openedAt = db.Column(db.String(144), nullable = False)
    closedAt = db.Column(db.String(144), nullable = False)
    amount = db.Column(db.Integer, nullable = False)
    length = db.Column(db.Integer, nullable = False)
    dayRowNumber = db.Column(db.Integer, nullable = False)

    def __init__ (self, observatoryday_id, catchArea, catchMethod, openedAt, closedAt, amount, length, dayRowNumber):
        self.observatoryday_id = observatoryday_id
        self.catchArea = catchArea
        self.catchMethod = catchMethod
        self.openedAt = openedAt
        self.closedAt = closedAt
        self.amount = amount
        self.length = length
        self.dayRowNumber = dayRowNumber
