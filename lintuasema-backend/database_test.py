import unittest

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import select
from app.db import dal

class TestApp(unittest.TestCase): 

    @classmethod
    def setUpClass(cls): 
        dal.db_init('sqlite:///:memory:') 

    def test_observatory(self):
        observatories = dal.connection.execute(dal.observationStation.select()).fetchall()
        self.assertEqual(observatories, [])

if __name__ == "__main__":
    unittest.main()
