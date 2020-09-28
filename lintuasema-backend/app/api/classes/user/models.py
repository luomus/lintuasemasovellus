from app.db import db
from app.api.models import Base

class User(Base):

     __tablename__ = "account" #user yleisesti ei suositeltava nimi, joten tällä vaihdetaan sopiva nimi taululle

     userId=db.Column(db.String(144), nullable=False)
     fullName=db.Column(db.String(144), nullable=False)
     email=db.Column(db.String(144), nullable=False)

     def __init__ (self, userId, fullName, email):
          self.userId=userId
          self.fullName=fullName
          self.email=email



    

   
