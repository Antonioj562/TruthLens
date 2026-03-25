from flask import Flask
from app.routes.predict_routes import predict_bp
from app.routes.feedback_routes import feedback_bp
from app.routes.analytics_routes import analytics_bp
from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React frontend to call API

# register routes
app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(feedback_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(user_bp)