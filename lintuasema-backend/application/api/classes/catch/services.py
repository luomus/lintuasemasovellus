from application.api.classes.catch.models import Catch
from application.db import db

def get_all(obsday_id):
    catchdetails = Catch.query.filter_by(observatoryday_id = obsday_id, is_deleted = 0).all()
    ret = []
    for catch in catchdetails:
        ret.append({ 'pyydys': catch.catchType, 
                     'pyyntialue': catch.location,
                     'verkkokoodit': catch.netCode,
                     'lukumaara': catch.amount,
                     'verkonPituus': catch.length,
                     'alku': catch.openedAt,
                     'loppu': catch.closedAt,
                     'key': catch.dayRowNumber})
    return ret

def create_catches(catches):
  day_id = catches[0]
  used_key_set = set() #{}
  
  for row in catches[1:]:
    if(row['pyydys'] and row['pyyntialue'] and row['lukumaara'] and row['alku'] and row['loppu'] and row['key']):
      create_catch(row,day_id)
      used_key_set.add(int(row['key']))
  
  db_catches = Catch.query.filter_by(observatoryday_id = day_id, is_deleted = 0).all()
  for catch in db_catches:
    if int(catch.dayRowNumber) not in used_key_set:
       catch.is_deleted = 1
       db.session.commit()

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
      closedAt = row['loppu'],
      dayRowNumber = row['key'])
  old_catch = Catch.query.filter_by(observatoryday_id = day_id, dayRowNumber = catch.dayRowNumber, is_deleted = 0).first()
  if not old_catch:
    db.session().add(catch)
    db.session().commit()
  elif (old_catch.observatoryday_id != catch.observatoryday_id 
     or old_catch.catchType != catch.catchType
     or old_catch.location != catch.location
     or old_catch.netCode != catch.netCode
     or int(old_catch.amount) != int(catch.amount)
     or int(old_catch.length) != int(catch.length)
     or old_catch.openedAt != catch.openedAt
     or old_catch.closedAt != catch.closedAt):
      old_catch.is_deleted = 1
      db.session().add(catch)
      db.session.commit()



  

