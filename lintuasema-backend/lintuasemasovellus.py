from app import init_app, redirect
from dotenv import load_dotenv
load_dotenv()
import os
import requests
from flask import Flask, render_template, request, redirect, session, url_for


AUTH_TOKEN = os.getenv('AUTH_TOKEN')
TARGET = os.getenv('TARGET')

app = init_app()
port = int(os.environ.get("PORT", 5000))

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)

@app.route('/login')
def login():
    return redirect('https://login-dev.laji.fi/login?target=%s&redirectMethod=POST&next=localhost:3000/' % (TARGET))


