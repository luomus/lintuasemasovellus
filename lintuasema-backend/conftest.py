
import pytest
#from app import init_testapp, db
from application import init_app, db


@pytest.fixture

def app():
    #app = init_testapp()
    app = init_app("sqlite", True)
    with app.app_context():   
        db.create_all()
        yield app   # Note that we changed return for yield, see below for why
        db.drop_all()

    #app.config.from_object('project.config.TestingConfig')
    #return app


#fixture nimeltään app. Fixture tarkoittaa asiaa joka valmistelee testiä varten pohjatilanteen