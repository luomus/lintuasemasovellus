from flask import make_response
from application.api import bp
from application.api.classes.observatory.models import Observatory

@bp.route('/api', methods=['GET'])
def hello_world():
    response = make_response("Hello world", 200)
    response.mimetype = "text/plain"
    return response

@bp.route('/api/healthz', methods=['GET'])
def healthz():
    try:
        Observatory.query.all()
    except Exception as e:
        print(e)
        return make_response("Database is not OK", 500)
    return make_response("OK", 200)
