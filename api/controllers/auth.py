import bcrypt
from db.db import db
from flask import jsonify
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.orm.exc import NoResultFound
from typing import Dict, Union, Any
from db.models import User
from sqlalchemy import and_
import uuid
import random
import traceback


# check if password exists
def check_email_exists(email):
    foodbank = User.query.filter(User.email == email).first()
    if not foodbank:
        return True
    return False

# Generate uuid


def generate_uuid() -> str:
    '''Generate uuids'''
    gen_uuid = uuid.uuid4()
    return str(gen_uuid)

# Generate OTP CODE


def generate_otp_code() -> str:
    otp = random.randint(10000, 99999)
    return str(otp)

# HASH PASSWORD


def hash_password(password):
    encode_password = password.encode('utf-8')
    hash_pwd = bcrypt.hashpw(encode_password, bcrypt.gensalt())
    return hash_pwd


def add_user(data) -> User:
    """Method to add a user
    """
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    user_obj = User.query.filter(User.id == user.id).first()
    return user_obj


def find_user_by(**kwargs: Any) -> User:
    '''Find user and filter by arbitrary arguments.
    '''
    # Initialize the query obj
    query = User.query
    for key, value in kwargs.items():
        try:
            # Try filter and if an attribute error throw invalid err.
            query = query.filter(getattr(User, key) == value)
        except AttributeError:
            raise InvalidRequestError
        # Check if user exists.
    if query.first() is None:
        raise NoResultFound
    return query.first()


def update_user(user_id: int, **kwargs: Any) -> None:
    '''Update user'''
    user_to_update = find_user_by(id=user_id)
    for key, value in kwargs.items():
        # Check if passed key is available in user attributes
        if not hasattr(user_to_update, key):
            raise ValueError
        setattr(user_to_update, key, value)
        db.session.commit()
    return None


class Auth:
    @staticmethod
    def register_user(data: tuple) -> User:
        password = data.pop('password', None)
        email = data.pop('email', None)
        try:
            find_user_by(email=email)
            raise ValueError(f"User {email} already exists")
        except NoResultFound:
            pwd = hash_password(password)
            data['password'] = pwd
            data['email'] = email
            newUser = add_user(data)
            return newUser

    @staticmethod
    def valid_login(email: str, password: str) -> bool:
        try:
            user = find_user_by(email=email)
            if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                return {
                    "role": user.role,
                    "id": user.id,
                }
        except NoResultFound:
            return False
        else:
            return False

    @staticmethod
    def create_session(email: str) -> str:
        try:
            user = find_user_by(email=email)
            session_id = generate_uuid()
            update_user(user.id, session_id=session_id)
            return str(user.session_id)
        except NoResultFound:
            return None

    @staticmethod
    def get_user_from_session_id(session_id: str) -> User or None:
        if session_id is None:
            return None
        try:
            user = find_user_by(session_id=session_id)
            return user
        except NoResultFound:
            return None

    @staticmethod
    def destroy_session(user_id: int) -> None:
        update_user(user_id, session_id=None)
        return None

    @staticmethod
    def get_reset_password_token(email: str) -> str:
        try:
            user = find_user_by(email=email)
            otp = generate_otp_code()
            update_user(user.id, reset_token=otp)
            return user.reset_token
        except NoResultFound:
            raise ValueError

    @staticmethod
    def update_password(reset_token: str, password: str) -> None:
        try:
            user = find_user_by(reset_token=reset_token)
            hashed = hash_password(password)
            update_user(user.id, password=hashed, reset_token=None)
            return None
        except NoResultFound:
            raise ValueError

    @staticmethod
    def filter_food_banks(min_lat, max_lat, min_lon, max_lon):
        print(min_lat, max_lat, min_lon, max_lon)
        try:
            users = User.query.filter(
                and_(
                    User.role == 'foodbank',
                    User.latitude.between(float(min_lat), float(max_lat)),
                    User.longitude.between(float(min_lon), float(max_lon))
                )
            ).all()
            return [user.to_dict() for user in users]
        except Exception as e:
            traceback.print_exc()  # Print the traceback for debugging
            return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500
