from flask import Flask, make_response

app = Flask(__name__)

@app.route('/api')
def index():
    response = make_response("Hello world", 200)
    response.mimetype = "text/plain"
    return response
