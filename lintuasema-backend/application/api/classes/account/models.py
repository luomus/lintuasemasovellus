from application.db import db, prefix
from application.api.models import Base

class Account(Base):

     __base_tablename__ = 'account'

     userId=db.Column(db.String(144), nullable=False, unique=True)
     fullName=db.Column(db.String(144), nullable=False)
     email=db.Column(db.String(144), nullable=False)
     observatory=db.Column(db.String(144), nullable=True)

     Observation = db.relationship("Observation", backref="account", lazy=True)

     def __init__ (self, userId, fullName, email):
          self.userId=userId
          self.fullName=fullName
          self.email=email
          self.observatory=None

     def get_userId(self):
          return self.userId
