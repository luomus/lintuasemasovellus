from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from application.api.classes.shorthand.models import Shorthand
from application.api.classes.shorthand.services import edit_shorthand, add_shorthand, get_shorthands, delete_shorthand, get_shorthands_for_editing, get_shorthands_by_obsperiod, get_shorthand_by_id

from application.api import bp
from application.db import db


@bp.route('/api/addShorthand', methods=['POST'])
@login_required
def addShorthand():
    req = request.get_json()
    ret = add_shorthand(req)

    return jsonify(ret)


@bp.route('/api/getShorthands', methods=["GET"])
@login_required
def getShorthands():

    return jsonify(get_shorthands())

@bp.route('/api/getShorthandText/<obsday_id>/<type_name>/<location_name>', methods=["GET"])
@login_required
def getShorthandsForEditing(obsday_id, type_name, location_name):
    res = get_shorthands_for_editing(obsday_id, type_name, location_name)

    return jsonify(res)

@bp.route('/api/getShorthand/<shorthand_id>', methods=["GET"])
@login_required
def getShorthandById(shorthand_id):
    ret = get_shorthand_by_id(shorthand_id)

    return jsonify(ret)

@bp.route('/api/getShorthandByObsPeriod/<obsperiod_id>/', methods=["GET"])
@login_required
def getShorthandByObsPeriod(obsperiod_id):
    ret = get_shorthands_by_obsperiod(obsperiod_id)

    return jsonify(ret)

@bp.route('/api/editShorthand/<shorthand_id>', methods=['POST'])
@login_required
def shorthand_edit(shorthand_id):
    req = request.get_json()

    id = edit_shorthand(shorthand_id, req['block'])

    return jsonify({"id" : id})
