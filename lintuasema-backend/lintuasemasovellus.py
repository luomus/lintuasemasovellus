from app import init_app, redirect
from dotenv import load_dotenv
load_dotenv()
import os
import requests


AUTH_TOKEN = os.getenv('AUTH_TOKEN')

app = init_app()
port = int(os.environ.get("PORT", 5000))

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)

@app.route('/login')
def login():
    token = {'access_token': AUTH_TOKEN}
    r = requests.get('https://apitest.laji.fi/login', params=token)
    return r.json()


