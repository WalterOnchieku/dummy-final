from flask import request, jsonify, make_response
from flask_restful import Resource
from models import db, User, bcrypt
from flask_login import login_user, logout_user, login_required


class RegisterResource(Resource):
    def post(self):
        data = request.get_json()

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'customer')#default to customer if not provided

        if not all([name, email, password]):
            return{'error': 'Name, Email and password required'}, 400

        if not User.is_valid_email(email):
            return {'error': 'Enter a valid Email'}, 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {'error': 'Email already in use'}

        new_user = User(name=name, email=email, role=role)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return {'message': 'User registered successfully', 'user': new_user.to_dict()}, 201

class UserListResource(Resource):
    def get(self):
        """Fetches paginated users."""
        page = request.args.get('page', 1, type=int)  # Default to page 1
        per_page = request.args.get('per_page', 10, type=int)  # Default to 10 users per page

        paginated_users = User.query.paginate(page=page, per_page=per_page, error_out=False)
        users = [user.to_dict() for user in paginated_users.items]

        return {
            'users': users,
            'total': paginated_users.total,
            'pages': paginated_users.pages,
            'current_page': paginated_users.page,
            'per_page': paginated_users.per_page
        }, 200

class DeleteUserResource(Resource):
    def delete(self, user_id):
        """Deletes a user by their ID."""
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404

        try:
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': 'An error occurred while deleting the user'}, 500


class Login(Resource):
    def post(self):
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return make_response({"error": "Email and password are required"}, 400)

        # Find the user in the database by email
        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password_hash, password):
            # Log the user in
            login_user(user)
            return make_response({"message": f"Welcome back, {user.email}!"}, 200)
        else:
            return make_response({"error": "Invalid credentials"}, 401)


class Logout(Resource):
    @login_required
    def post(self):
        logout_user()
        return make_response({"message": "Successfully logged out"}, 200)




