import os
import json


def get_all_species():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    filename = os.path.join(SITE_ROOT, '../../..', 'birds.json')

    with open(filename) as json_file:
        data = json.load(json_file)

    return data


def get_default_species(observatory):
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    filename = os.path.join(SITE_ROOT, '../../..', 'defaultBirds.json')

    with open(filename) as json_file:
        data = json.load(json_file)

    return data[observatory]
