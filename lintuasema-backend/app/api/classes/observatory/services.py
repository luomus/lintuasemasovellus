
from app.api.classes.observatory.models import Observatory

def getAll():
    stations = Observatory.query.all()
    return stations