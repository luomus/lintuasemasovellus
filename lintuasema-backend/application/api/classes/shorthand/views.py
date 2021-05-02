from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from application.api.classes.shorthand.models import Shorthand
from application.api.classes.shorthand.services import get_shorthands_for_editing, get_shorthands_by_obsperiod

from application.api import bp
from application.db import db


@bp.route('/api/getShorthandText/<obsday_id>/<type_name>/<location_name>', methods=["GET"])
@login_required
def getShorthandsForEditing(obsday_id, type_name, location_name):
    res = get_shorthands_for_editing(obsday_id, type_name, location_name)

    return jsonify(res)


@bp.route('/api/getShorthandByObsPeriod/<obsperiod_id>/', methods=["GET"])
@login_required
def getShorthandByObsPeriod(obsperiod_id):
    ret = get_shorthands_by_obsperiod(obsperiod_id)

    return jsonify(ret)
