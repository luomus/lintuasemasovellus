from dotenv import load_dotenv
load_dotenv()
import os
import requests
import urllib.parse as urlparse
from flask import (Flask, render_template, 
    request, redirect, session, url_for,
    make_response, jsonify)

# ASETUKSET
# oldapp: Jos käytetään vanhaa tietokantaa, anna True; muuten ohjataan uutta tietokantaa käyttävään backendiin
oldapp = False

if oldapp:
    from app import init_app, redirect
    print('Testataan vanhaa backendiä')
else:
    from application import init_app, redirect
    print('Testataan uutta backendiä')

app = init_app("sqlite", True)

port = int(os.environ.get("PORT", 3000))


app.secret_key = 'supersecret'

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=port)


