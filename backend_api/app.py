from flask import Flask
from routes.user_routes import user_api
from routes.swipe_routes import swipe_api
from routes.seat_routes import seat_api
from routes.device_routes import device_api

app = Flask(__name__)
app.register_blueprint(user_api)
app.register_blueprint(swipe_api)
app.register_blueprint(seat_api)
app.register_blueprint(device_api)

if __name__ == '__main__':
    app.run(debug=True)
