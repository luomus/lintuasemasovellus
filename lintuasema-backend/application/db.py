from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
prefix = 'v2_'



# from datetime import datetime
# from sqlalchemy import (MetaData, Table, Column, Integer, Numeric, String,
#                         DateTime, ForeignKey, Boolean, create_engine)


# class DataAccessLayer:
#     connection = None
#     engine = None
#     conn_string = None
#     metadata = MetaData()
#     observationStation = Table('observation_station',
#                     metadata,
#                     Column('id', Integer(), primary_key=True),
#                     Column('name', String(144)),
#               )

#     def db_init(self, conn_string): 
#         self.engine = create_engine(conn_string or self.conn_string)
#         self.metadata.create_all(self.engine)
#         self.connection = self.engine.connect()

# dal = DataAccessLayer() 
