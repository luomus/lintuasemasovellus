from application.api.classes.shorthand.models import Shorthand
from application.api.classes.observation.models import Observation
from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observation.services import deleteObservation, deleteObservations

from application.api import bp
from application.db import db, prefix

from sqlalchemy.sql import text


def get_shorthands_by_obsperiod(obsperiod_id):
    shorthandblock = Shorthand.query.filter(Shorthand.observationperiod_id == obsperiod_id, Shorthand.is_deleted == 0).order_by(Shorthand.id).first()
    ret = []
    if (shorthandblock):
        ret.append({ 'id': shorthandblock.id, 'shorthandBlock': shorthandblock.shorthandblock })

    return ret

def delete_shorthands_by_obsperiod(obsperiod_id):
    shorthands = get_shorthands_by_obsperiod(obsperiod_id)
    for shorthand in shorthands:
        delete_shorthand(shorthand['id'])

def delete_shorthand(shorthand_id):
    shorthand_to_delete = Shorthand.query.get(shorthand_id)
    deleteObservations(shorthand_id)
    shorthand_to_delete.is_deleted = 1
    db.session.commit()

def get_shorthands_for_editing(obsday_id, type_name, location_name):
    stmt = text("SELECT " + prefix + "Shorthand.id AS shorthand_id,"
                " " + prefix + "Shorthand.shorthandblock,"
                " " + prefix + "Shorthand.observationperiod_id,"
                " " + prefix + "Observation.id AS observation_id,"
                " " + prefix + "Observationperiod.start_time, " + prefix + "Observationperiod.end_time"
                " FROM " + prefix + "Shorthand"
                " JOIN " + prefix + "Observationperiod ON " + prefix + "Observationperiod.id = " + prefix + "Shorthand.observationperiod_id"
                " JOIN " + prefix + "Type ON " + prefix + "Observationperiod.type_id = " + prefix + "Type.id"
                " JOIN " + prefix + "Location ON " + prefix + "Observationperiod.location_id = " + prefix + "Location.id"
                " LEFT JOIN " + prefix + "Observation ON " + prefix + "Observation.shorthand_id = " + prefix + "Shorthand.id AND " + prefix + "Observation.is_deleted = 0"
                " JOIN " + prefix + "Observatoryday ON " + prefix + "Observatoryday.id = " + prefix + "Observationperiod.observatoryday_id"
                " WHERE " + prefix + "Observatoryday.id = :dayId"
                " AND " + prefix + "Type.name = :type"
                " AND " + prefix + "Location.name = :location"
                " AND " + prefix + "Shorthand.is_deleted = 0"
                " AND " + prefix + "Observationperiod.is_deleted = 0"
                " AND " + prefix + "Type.is_deleted = 0"
                " AND " + prefix + "Location.is_deleted = 0"
                " AND " + prefix + "Observatoryday.is_deleted = 0"
                " ORDER BY " + prefix + "Observationperiod.id, shorthand_id").params(dayId=obsday_id, type=type_name, location=location_name)

    with db.engine.connect() as conn:
        res = conn.execute(stmt)

    obsPeriodList = createObsperiodList(res)

    return obsPeriodList

#Helper functions for get_shorthands_for_editing

def createObsperiodList(res):

    index = 0
    shorthandId = 0
    obsPeriodId = 0
    startTime = ''
    endTime = ''
    shorthandText = ''
    observationList = []
    shorthandList = []
    obsPeriodList = []

    for row in res:

        if index == 0:

            shorthandId = row.shorthand_id
            obsPeriodId = row.observationperiod_id
            startTime = formatTime(row.start_time)
            endTime = formatTime(row.end_time)
            shorthandText = row.shorthandblock

        index = index + 1

        if row.shorthand_id != shorthandId:

            addToShorthandList(shorthandList, shorthandId,
                         shorthandText, observationList)
            observationList.clear()
            shorthandId = row.shorthand_id

        if row.observationperiod_id != obsPeriodId:

            addObsPeriod(obsPeriodList, obsPeriodId,
                         startTime, endTime, shorthandList)
            shorthandList.clear()
            obsPeriodId = row.observationperiod_id

        observationList.append({'id': row.observation_id})
        startTime = formatTime(row.start_time)
        endTime = formatTime(row.end_time)
        shorthandText = row.shorthandblock

    if index > 0:
        addToShorthandList(shorthandList, shorthandId, shorthandText, observationList)
        observationList.clear()

        addObsPeriod(obsPeriodList, obsPeriodId, startTime, endTime, shorthandList)
        shorthandList.clear()

    return obsPeriodList


def formatTime(time):
    hours = ""
    minutes = ""

    if isinstance(time, str):
        timeArray = time.split(':')
        hours = timeArray[0][-2:]
        minutes = timeArray[1][0:2]
    else:
        hours = time.strftime('%H')
        minutes = time.strftime('%M')

    return hours + ':' + minutes


def addToShorthandList(shorthandlist, id, text, observations):
    shorthandlist.append({
        'shorthand_id': id,
        'shorthand_text': text,
        'observations': observations.copy()
        })

def addObsPeriod(obsperiodlist, id, start, end, shorthands):
    obsperiodlist.append({
        'obsPeriodId': id,
        'startTime': start,
        'endTime': end,
        'shorthands': shorthands.copy()
        })
