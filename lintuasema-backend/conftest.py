
import pytest
from app import init_testapp, db

@pytest.fixture

def app():
    app = init_testapp()
    with app.app_context():   
        db.create_all()
        yield app   # Note that we changed return for yield, see below for why
        db.drop_all()

    #app.config.from_object('project.config.TestingConfig')
    #return app


