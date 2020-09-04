from app import init_app
import os

app = init_app()
port = int(os.environ.get("PORT", 5000))

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)
