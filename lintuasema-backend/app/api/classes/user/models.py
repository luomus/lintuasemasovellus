from application import db
from application.api.models import Base

class User(Base):

    __tablename__ = "account" #user yleisesti ei suositeltava nimi, joten tällä vaihdetaan sopiva nimi taululle

    firstName=db.Column(db.String(144), nullable=False)
    lastName=db.Column(db.String(144), nullable=False)
    email=db.Column(db.String(144), nullable=False)
    userName=db.Column(db.String(144), nullable=False)



    

   
