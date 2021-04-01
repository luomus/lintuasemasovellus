from application.db import db
from application.api.models import Base 
  
class Observatoryday(Base):

    __base_tablename__ = 'observatoryday'

    day=db.Column(db.DateTime, nullable=False)
    comment=db.Column(db.String(1000), nullable=True)
    observers=db.Column(db.String(200), nullable=False)
    selectedactions=db.Column(db.String(500), nullable=False)
    
    observatory_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'observatory.id'), nullable=False)

    Observationperiod=db.relationship("Observationperiod", backref="observatoryday", lazy=True)
    Catch=db.relationship("Catch", backref="observatoryday", lazy=True)

    def __init__ (self, day, comment, observers, selectedactions, observatory_id):
        self.day=day
        self.comment=comment
        self.observers=observers
        self.selectedactions=selectedactions
        self.observatory_id=observatory_id