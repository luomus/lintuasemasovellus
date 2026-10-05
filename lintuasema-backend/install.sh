#!/bin/sh

if [ ! -d "venv" ]
then
    python3 -m venv venv
fi
. venv/bin/activate
pip install "setuptools<82" wheel
pip install --no-build-isolation cx_Oracle==8.3.0
pip install -r requirements.txt
