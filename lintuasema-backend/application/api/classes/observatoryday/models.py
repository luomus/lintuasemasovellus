from application.db import db
from application.api.models import Base 
  
class ObservatoryDay(Base):

    __base_tablename__ = 'observatoryday'

    date=db.Column(db.DateTime, nullable=False)
    comment=db.Column(db.String(1000), nullable=True)
    observers=db.Column(db.String(200), nullable=False)
    selectedActions=db.Column(db.String(500), nullable=False)
    
    observatory_id = db.Column(db.Integer, db.ForeignKey(Base.the_prefix + 'observatory.id'), nullable=False)

    Observationperiod=db.relationship("Observationperiod", backref="observatoryday", lazy=True)
    

    def __init__ (self, date, comment, observers, selectedActions, observatory_id):
        self.date=date
        self.comment=comment
        self.observers=observers
        self.selectedActions=selectedActions
        self.observatory_id=observatory_id