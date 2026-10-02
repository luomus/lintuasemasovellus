from flask import jsonify

from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observation.models import Observation
from application.api.classes.observatoryday.models import Observatoryday
from application.api.classes.type.models import Type
from application.api.classes.observatory.models import Observatory
from application.api.classes.location.services import getLocationId, getLocationName
from application.api.classes.type.services import getTypeIdByName, getTypeNameById, createType
from application.api.classes.observatoryday.services import getDay
from application.api.classes.shorthand.services import delete_shorthands_by_obsperiod

from application.db import db, prefix
from sqlalchemy.sql import text
from datetime import datetime

def addObservationperiod(day_id, location, observationType, startTime, endTime):

    obsday = getDay(day_id)
    obsId = obsday.observatory_id
    locId = getLocationId(location, obsId)
    createType(observationType, obsId)

    obsp = Observationperiod(
        start_time=datetime.strptime(startTime, '%H:%M'),
        end_time=datetime.strptime(endTime, '%H:%M'),
        type_id=getTypeIdByName(observationType),
        location_id=locId, observatoryday_id=day_id)#Tähän pitää lisätä pikakirjoitus sitten, kun se on frontissa tehty. Olio pitää luoda ennen tätä kohtaa (shorthand_id=req['shorthand_id'])
    db.session().add(obsp)
    db.session().commit()

    obspId = getObsPerId(obsp.start_time, obsp.end_time, obsp.type_id, obsp.location_id, obsp.observatoryday_id)

    return { 'id': obspId }


def addObservation(observation):
    db.session().add(observation)
    db.session().commit()

def setObservationId(observationperiod_id_old, observationperiod_id_new):
    observations = Observation.query.filter_by(observationperiod_id = observationperiod_id_old).all()
    for x in observations:
        x.observationperiod_id = observationperiod_id_new
    db.session().commit()

def getObservationPeriodCountsByDayId(observatoryday_id):
    stmt = text(
        " SELECT " + prefix + "Type.name AS typename, " + prefix + "Location.name AS locationname,"
        " COUNT(DISTINCT " + prefix + "Observationperiod.id) AS obsperiod_count"
        " FROM " + prefix + "Observationperiod"
        " JOIN " + prefix + "Type ON " + prefix + "Type.id = " + prefix + "Observationperiod.type_id"
        " JOIN " + prefix + "Location ON " + prefix + "Location.id = " + prefix + "Observationperiod.location_id"
        " WHERE " + prefix + "Observationperiod.observatoryday_id = :dayId"
        " AND " + prefix + "Type.name NOT IN ('Paikallinen', 'Hajahavainto')"
        " AND " + prefix + "Observationperiod.is_deleted = 0"
        " AND " + prefix + "Type.is_deleted = 0"
        " AND " + prefix + "Location.is_deleted = 0"
        " GROUP BY " + prefix + "Type.id, " + prefix + "Location.id, " + prefix + "Type.name, " + prefix + "Location.name"
        " ORDER BY " + prefix + "Type.id, " + prefix + "Location.id"
    ).params(
        dayId = observatoryday_id
    )

    with db.engine.connect() as conn:
        res = conn.execute(stmt)

    response = []

    for row in res:
        response.append({
            'observationType': row.typename,
            'location': row.locationname,
            'observationPeriodCount': row.obsperiod_count
        })

    return jsonify(response)

def getObservationPeriodsByDayId(observatoryday_id):
    stmt = text(" SELECT " + prefix + "Observationperiod.id AS obsperiod_id,"
                " " + prefix + "Observationperiod.start_time, " + prefix + "Observationperiod.end_time,"
                " " + prefix + "Type.name AS typename, " + prefix + "Location.name AS locationname,"
                " " + prefix + "Observatoryday.id AS day_id, "
                " COUNT(DISTINCT " + prefix + "Observation.species) AS speciescount"
                " FROM " + prefix + "Observationperiod"
                " JOIN " + prefix + "Type ON " + prefix + "Type.id = " + prefix + "Observationperiod.type_id"
                " JOIN " + prefix + "Location ON " + prefix + "Location.id = " + prefix + "Observationperiod.location_id"
                " JOIN " + prefix + "Observatoryday ON " + prefix + "Observatoryday.id = " + prefix + "Observationperiod.observatoryday_id"
                " LEFT JOIN " + prefix + "Observation ON " + prefix + "Observation.observationperiod_id = " + prefix + "Observationperiod.id AND " + prefix + "Observation.is_deleted = 0"
                " WHERE " + prefix + "Observatoryday.id = :dayId"
                " AND " + prefix + "Observationperiod.is_deleted = 0"
                " AND " + prefix + "Type.is_deleted = 0"
                " AND " + prefix + "Location.is_deleted = 0"
                " AND " + prefix + "Observatoryday.is_deleted = 0"
                " GROUP BY " + prefix + "Observationperiod.id, " + prefix + "Observationperiod.start_time,"
                " " + prefix + "Observationperiod.end_time, " + prefix + "Type.name, " + prefix + "Location.name, " + prefix + "Observatoryday.id"
                " ORDER BY " + prefix + "Observationperiod.start_time").params(dayId = observatoryday_id)

    with db.engine.connect() as conn:
        res = conn.execute(stmt)

    response = []

    for row in res:

        starthours = ""
        startminutes = ""
        endhours = ""
        endminutes = ""

        if isinstance(row.start_time, str):
            startTimeArray = row.start_time.split(':')
            starthours = startTimeArray[0][-2:]
            startminutes = startTimeArray[1][0:2]
            endTimeArray = row.end_time.split(':')
            endhours = endTimeArray[0][-2:]
            endminutes = endTimeArray[1][0:2]
        else:
            starthours = row.start_time.strftime('%H')
            startminutes = row.start_time.strftime('%M')
            endhours = row.end_time.strftime('%H')
            endminutes = row.end_time.strftime('%M')

        starttime = starthours + ':' + startminutes
        endtime = endhours + ':' + endminutes

        response.append({
            'id': row.obsperiod_id,
            'startTime': starttime,
            'endTime': endtime,
            'observationType': row.typename,
            'location': row.locationname,
            'day_id': row.day_id,
            'speciesCount': row.speciescount,
        })

    return jsonify(response)

def getObsPerId(starttime, endtime, type_id, location_id, observatoryday_id):
    obsp = Observationperiod.query.filter_by(start_time = starttime, end_time=endtime, type_id=type_id, location_id=location_id, observatoryday_id=observatoryday_id, is_deleted=0).first()
    return obsp.id

def getObservationperiodList():
    observationPeriods = Observationperiod.query.filter_by(is_deleted=0).all()

    ret = []

    for obsPeriod in observationPeriods:
        ret.append(
        {
            'id': obsPeriod.id,
            'startTime': obsPeriod.start_time,
            'endTime': obsPeriod.end_time,
            'type_id': getTypeNameById(obsPeriod.type_id),
            'location': getLocationName(obsPeriod.location_id),
            'day_id': obsPeriod.observatoryday_id
        })

    return ret

def getObservationperiods():
    return Observationperiod.query.filter_by(is_deleted=0).all()

def deleteObservationperiod(obsperiod_id, commit=True):
    delete_shorthands_by_obsperiod(obsperiod_id, commit=commit)
    deleted_obsperiod = Observationperiod.query.get(obsperiod_id)
    deleted_obsperiod.is_deleted = 1
    if commit:
        db.session.commit()

def delete_observationperiods(req, commit=True):
    for observationperiod_id in req:
        deleteObservationperiod(observationperiod_id, commit=commit)

def find_overlapping_periods(periods, day, observatory_id, exclude_ids=None):
    excluded = {int(exclude_id) for exclude_id in (exclude_ids or [])}

    new_periods = []
    for i, obsperiod in enumerate(periods):
        new_periods.append((i, _to_hhmm(obsperiod['startTime']), _to_hhmm(obsperiod['endTime'])))

    existing_periods = []
    existing_day = Observatoryday.query.filter_by(day=day, observatory_id=observatory_id, is_deleted=0).first()
    if existing_day:
        rows = Observationperiod.query.filter(
            Observationperiod.observatoryday_id == existing_day.id,
            Observationperiod.is_deleted == 0
        ).join(
            Observationperiod.type
        ).filter(
            Type.name.notin_(('Paikallinen', 'Hajahavainto'))
        ).all()
        for period in rows:
            if period.id in excluded:
                continue
            existing_periods.append((period.id, _to_hhmm(period.start_time), _to_hhmm(period.end_time)))

    overlaps = []
    for idx, (i, start, end) in enumerate(new_periods):
        for (pid, e_start, e_end) in existing_periods:
            if _periods_overlap(start, end, e_start, e_end):
                overlaps.append({'periodOrderNum': i, 'startTime': start, 'endTime': end, 'conflictsWithExistingPeriodId': pid})
        for (j, o_start, o_end) in new_periods[idx + 1:]:
            if _periods_overlap(start, end, o_start, o_end):
                overlaps.append({'periodOrderNum': i, 'startTime': start, 'endTime': end, 'conflictsWithPeriodOrderNum': j})
    return overlaps

def _to_hhmm(value):
    if isinstance(value, str):
        time_part = value.split(' ')[-1] if ' ' in value else value
        hours, minutes = time_part.split(':')[0:2]
        return hours[-2:].zfill(2) + ':' + minutes[0:2]
    return value.strftime('%H:%M')


def _periods_overlap(start_a, end_a, start_b, end_b):
    return (start_b < end_a and start_a <= start_b) or \
        (start_b < end_a <= end_b) or \
        (start_b <= start_a < end_b)
