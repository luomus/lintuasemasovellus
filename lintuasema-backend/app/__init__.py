from flask import Flask, redirect

def init_app():
    app = Flask(__name__, static_folder='../build', static_url_path='/')

    from app.api import bp as api_blueprint
    app.register_blueprint(api_blueprint)

    return app

