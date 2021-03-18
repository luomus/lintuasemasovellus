
from application.api.classes.catch.models import Catch
from application.db import db

def get_all(obsday_id):
    catchdetails = Catch.query.filter_by(observatoryday_id = obsday_id).all()
    print(catchdetails)
    return catchdetails

def create_catches(catches):
  for row in catches:
    print(catches)
    #create_catch(row)

def create_catch(row):
    catch = Catch(
      observatoryday_id=row['observatoryday_id'],
      catchType = row['catchType'],
      location = row['location'],
      netCode = row['netCode'],
      amount = row['amount'],
      length = row['length'],
      openedAt = row['openedAt'],
      closedAt = row['closedAt'])
    db.session().add(catch)
    db.session().commit()