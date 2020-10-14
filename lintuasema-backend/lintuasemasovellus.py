from app import init_app, init_testapp, redirect
from dotenv import load_dotenv
load_dotenv()
import os
import requests
import urllib.parse as urlparse
from flask import (Flask, render_template, 
    request, redirect, session, url_for,
    make_response, jsonify)


# jos ei halua käyttää oraclea lokaalisti, voi säätää app=init_testapp()

#app = init_app()
app = init_testapp()
port = int(os.environ.get("PORT", 3000))


app.secret_key = 'supersecret'

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=port)


