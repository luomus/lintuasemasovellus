from application.db import db
from application.api.models import Base

class Observatory(Base):

    __base_tablename__ = 'observatory'

    name = db.Column(db.String(144), nullable=False)
    actions = db.Column(db.String(500), nullable=False)

    Observatoryday = db.relationship("Observatoryday", backref="observatory", lazy=True)
    Location = db.relationship("Location", backref="observatory", lazy=True)
    Type = db.relationship("Type", backref="observatory", lazy=True)
    
    def __init__ (self, name, actions):
        self.name=name
        self.actions=actions
        
        
        