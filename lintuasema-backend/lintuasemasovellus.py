from app import init_app, redirect
from dotenv import load_dotenv
load_dotenv()
import os
import requests
import urllib.parse as urlparse
from flask import Flask, render_template, request, redirect, session, url_for


AUTH_TOKEN = os.getenv('AUTH_TOKEN')
TARGET = os.getenv('TARGET')

app = init_app()
port = int(os.environ.get("PORT", 3000))

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=port)

@app.route('/login', methods=['POST', 'GET'])
def loginconfirm():
    personToken = request.form['token']
    #nextParam = request.form['next'] ei ilmeisesti toimi?

    return "Metodi: " + request.method + ', personToken: ' + personToken 


@app.route('/loginRedirect', methods=['POST', 'GET'])
def login():
    # return redirect('https://fmnh-ws-test.it.helsinki.fi/laji-auth/login?target=%s&redirectMethod=GET&next=http://localhost:3000/' % (TARGET))
    return redirect('https://login-dev.laji.fi/login?target=%s&redirectMethod=POST&next=/index' % (TARGET))
