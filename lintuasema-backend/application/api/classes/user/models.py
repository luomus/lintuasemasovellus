from application.db import db
from application.api.models import Base

class User(Base):

     __base_tablename__ = 'account'

     userId=db.Column(db.String(144), nullable=False)
     fullName=db.Column(db.String(144), nullable=False)
     email=db.Column(db.String(144), nullable=False)
     #role = db.Column(db.String(255), nullable=False)

     def __init__ (self, userId, fullName, email):
     #def __init__ (self, userId, fullName, email, role):
          self.userId=userId
          self.fullName=fullName
          self.email=email
          #self.role = role

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



    

   
