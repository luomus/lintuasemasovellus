
from application.api.classes.catch.models import Catch
from application.db import db

def get_all(obsday_id):
    catchdetails = Catch.query.filter_by(observatoryday_id = obsday_id).all()
    return catchdetails

def create_catch(req):
    catch = Catch(
      observatoryday_id=req['observatoryday_id'],
      catchType = req['catchType'],
      location = req['location'],
      netCode = req['netCode'],
      amount = req['amount'],
      length = req['length'],
      openedAt = req['openedAt'],
      closedAt = req['closedAt'])
    db.session().add(catch)
    db.session().commit()