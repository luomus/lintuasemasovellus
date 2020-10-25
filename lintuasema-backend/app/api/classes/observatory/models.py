from app.db import db
from app.api.models import Base

class Observatory(Base):

    name = db.Column(db.String(144), nullable=False)

    Day = db.relationship("Day", backref="observatory", lazy=True)
    Location = db.relationship("Location", backref="observatory", lazy=True)
    Type = db.relationship("Type", backref="observatory", lazy=True)
    
    def __init__ (self, name):
        self.name=name
        
        
        