from app.api.classes.observationstation.models import ObservationStation
from app.api.classes.observationstation.services import getAll

def func(x):
    return x + 1

def test_answer():
    assert func(4) == 5

#def test_observatories():
#    list = getAll()
#    assert list is not None

