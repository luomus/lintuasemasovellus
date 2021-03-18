
from application.api.classes.catch.models import Catch
from application.db import db

def get_all(obsday_id):
    catchdetails = Catch.query.filter_by(observatoryday_id = obsday_id).all()
    print(catchdetails)
    return catchdetails

def create_catches(catches):
  day_id = catches[0]
  for row in catches[1:]:
    print(catches)
    create_catch(row,day_id)

def set_catch_day_id(id_old, id_new):
    catches = Catch.query.filter_by(observatoryday_id = id_old, is_deleted = 0).all()
    for catch in catches:
        catch.observatoryday_id = id_new
        db.session().commit()

def create_catch(row, day_id):
  catch = Catch(
      observatoryday_id=day_id,
      catchType = row['pyydys'],
      location = row['pyyntialue'],
      netCode = row['verkkokoodit'],
      amount = row['lukumaara'],
      length = row['verkonPituus'],
      openedAt = row['alku'],
      closedAt = row['loppu'])
  old_catch = Catch.query.filter_by(observatoryday_id = day_id, catchType = catch.catchType, location = catch.location, netCode = catch.netCode, is_deleted = 0).first()
  if not old_catch:
    db.session().add(catch)
    db.session().commit()
  elif (old_catch.observatoryday_id != catch.observatoryday_id 
     or old_catch.catchType != catch.catchType
     or old_catch.location != catch.location
     or old_catch.netCode != catch.netCode
     or old_catch.amount != catch.amount
     or old_catch.length != catch.length
     or old_catch.openedAt != catch.openedAt
     or old_catch.closedAt != catch.closedAt):
      old_catch.is_deleted = 1
      db.session().add(catch)
      db.session.commit()