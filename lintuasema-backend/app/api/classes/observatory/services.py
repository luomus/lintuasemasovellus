
from app.api.classes.observatory.models import Observatory

def getAll():
    stations = Observatory.query.all()
    return stations


def getFirst(): #tyhmä testi tehty, jotta näkisin toimiiko mikään
    stations=Observatory.query.filter_by(id='1')    #palauttaa listan jossa on yksi kpl observatoryjä
    return stations.first() #otetaan tältä yhden listalta se yksi ja ainoa