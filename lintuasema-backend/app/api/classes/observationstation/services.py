
from app.api.classes.observationstation.models import ObservationStation

def getAll():
    stations = ObservationStation.query.all()
    return stations