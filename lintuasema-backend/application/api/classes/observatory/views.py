from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from application.api.classes.observatory.models import Observatory
from application.api.classes.observatory.services import getAll

from application.api import bp
from application.db import db


@bp.route('/api/getObservatories', methods=['GET'])
@login_required
def get_observatories():

    observatories = getAll()
    ret = []
    for obs in observatories:
        ret.append({'id': obs.id, 'name': obs.name})

    return jsonify(ret)
