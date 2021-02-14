from application.db import db, prefix
from sqlalchemy import Sequence
from sqlalchemy.ext.declarative import declared_attr

class Base(db.Model):

    __abstract__ = True

    the_prefix = prefix

    @declared_attr
    def __tablename__(cls):
        return cls.the_prefix + cls.__base_tablename__
  
    id = db.Column(db.Integer, Sequence('id'), primary_key=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())
    is_deleted = db.Column(db.Integer, default=0)
