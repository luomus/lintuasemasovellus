from application.api.classes.observatory.models import Observatory
from application.api.classes.observatory.services import getAll


def test_observatories(app):
    list = getAll()
    assert list is not None

def test_getfirstobservatory(app):
    assert getAll()[0].name=='Hangon_Lintuasema'  

