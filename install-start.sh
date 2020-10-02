#!/bin/sh

cd frontend
npm install
npm run build-copy
cd ../lintuasema-backend
. venv/bin/activate
pip3 install -r requirements.txt
flask run --port=3000