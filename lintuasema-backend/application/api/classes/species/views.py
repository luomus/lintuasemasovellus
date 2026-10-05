from flask import jsonify

from flask_login import login_required

from application.api import bp
from application.api.classes.species.services import get_all_species, get_default_species


@bp.route('/api/getSpecies', methods=['GET'])
@login_required
def get_species():
    species = get_all_species()

    return jsonify(species)


@bp.route('/api/getDefaultSpecies/<observatory>', methods=['GET'])
@login_required
def get_default_species_for_observatory(observatory):
    default_species = get_default_species(observatory)

    return jsonify(default_species)
