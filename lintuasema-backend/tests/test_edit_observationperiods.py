from application.api.classes.observationperiod.models import Observationperiod
from application.api.classes.observationperiod.services import addObservationperiod, \
    find_overlapping_periods, delete_observationperiods
from application.api.classes.observatoryday.services import addDayFromReq, getDay
from application.api.classes.observatory.services import getObservatoryId
from application.db import db


def setup_day_with_period(start='08:00', end='10:00'):
    observatory = 'Hangon_Lintuasema'
    day_id = addDayFromReq({
        'observatory': observatory,
        'day': '07.06.2022',
        'observers': 'Aku Ankka',
        'comment': '',
        'selectedactions': '{}',
    })['id']
    period_id = addObservationperiod(day_id, 'Bunkkeri', 'Vakio', start, end)['id']
    day = getDay(day_id)
    return day, period_id


def period(start, end):
    return {'startTime': start, 'endTime': end}


def test_overlap_between_new_periods_is_detected(app):
    observatory_id = getObservatoryId('Hangon_Lintuasema')
    day, _ = setup_day_with_period('20:00', '21:00')

    overlaps = find_overlapping_periods(
        [period('08:00', '10:00'), period('09:00', '11:00')], day.day, observatory_id)

    assert any(o.get('conflictsWithPeriodOrderNum') == 1 for o in overlaps)


def test_overlap_with_existing_period_is_detected(app):
    day, period_id = setup_day_with_period('08:00', '10:00')

    overlaps = find_overlapping_periods([period('09:00', '11:00')], day.day, day.observatory_id)

    assert overlaps[0]['conflictsWithExistingPeriodId'] == period_id


def test_excluded_existing_period_is_ignored(app):
    day, period_id = setup_day_with_period('08:00', '10:00')

    overlaps = find_overlapping_periods(
        [period('09:00', '11:00')], day.day, day.observatory_id, exclude_ids=[period_id])

    assert overlaps == []


def test_non_overlapping_periods_pass(app):
    day, _ = setup_day_with_period('08:00', '10:00')

    overlaps = find_overlapping_periods(
        [period('10:00', '11:00'), period('11:00', '12:00')], day.day, day.observatory_id)

    assert overlaps == []
