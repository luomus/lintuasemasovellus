from flask import make_response
from application.api import bp

@bp.route('/api', methods=['GET'])
def hello_world():
    response = make_response("Hello world", 200)
    response.mimetype = "text/plain"
    return response
