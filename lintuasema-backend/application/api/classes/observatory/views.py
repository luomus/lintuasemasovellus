from flask import jsonify

from flask_login import login_required

from application.api.classes.observatory.models import Observatory
from application.api.classes.observatory.services import getAllJSON

from application.api import bp
from application.db import db


@bp.route('/api/getObservatories', methods=['GET'])
@login_required
def get_observatories():

    ret = getAllJSON()

    return jsonify(ret)
