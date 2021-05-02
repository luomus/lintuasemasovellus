
import pytest
from application import init_app, db


@pytest.fixture

def app():
    app = init_app("sqlite", True)
    with app.app_context():   
        db.create_all()
        yield app 
        db.drop_all()
