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

     def get_id(self):
          return self.id

     def get_userId(self):
          return self.userId

     def is_active(self):
          return True

     def is_anonymous(self):
          return False

     def is_authenticated(self):
          return True

     def getRole(self):
         return self.role



    

   
