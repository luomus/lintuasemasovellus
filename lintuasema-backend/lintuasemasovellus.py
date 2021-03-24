from dotenv import load_dotenv
load_dotenv()
import os
import requests
import urllib.parse as urlparse
from flask import (Flask, render_template, 
    request, redirect, session, url_for,
    make_response, jsonify)
from application import init_app, redirect

# ASETUKSET
# db_type: Jos käytetään Oraclea, anna "oracle"; muuten käytetään oletuksena SQLitea
db_type = "asdf"

app = init_app(db_type)

port = int(os.environ.get("PORT", 3000))


app.secret_key = 'supersecret'

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=port)


