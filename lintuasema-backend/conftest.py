
import pytest
from application import init_app, db
from dotenv import load_dotenv

@pytest.fixture

def app():
    load_dotenv()
    app = init_app("sqlite", True)
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()
