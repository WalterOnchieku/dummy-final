from flask import Flask
from flask_restful import Api
from models import db
from resources import RegisterResource, UserListResource, DeleteUserResource, Login, Logout
from flask_cors import CORS
from flask_login import LoginManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
app.json.compact = False

db.init_app(app)
api = Api(app)
CORS(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Load the user from the database for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# Add the Register resource to the API
api.add_resource(RegisterResource, '/register')
api.add_resource(UserListResource, '/users')
api.add_resource(DeleteUserResource, '/users/<int:user_id>' )
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

with app.app_context():
    from models import User
    db.create_all() 

if __name__ == '__main__':
    app.run(debug=True)
