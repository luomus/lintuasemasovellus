from flask import jsonify

from flask_login import login_required

from application.api import bp
from application.api.classes.species.services import get_all_species


@bp.route('/api/getSpecies', methods=['GET'])
@login_required
def get_species():
    ret = get_all_species()

    return jsonify(ret)
