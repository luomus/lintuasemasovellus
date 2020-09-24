from app.db import db
from sqlalchemy import Sequence

class Base(db.Model):

    __abstract__ = True
  
    id = db.Column(db.Integer, Sequence('id'), primary_key=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())
