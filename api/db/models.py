from db.db import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Numeric
from datetime import datetime


class User (db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    role = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    latitude = db.Column(Numeric(precision=10, scale=8), nullable=False)
    longitude = db.Column(Numeric(precision=11, scale=8), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow, onupdate=datetime.utcnow)
    reset_token = db.Column(db.String(36), nullable=True)
    session_id = db.Column(db.String(36), nullable=True)

    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "city": self.city,
            "country": self.country,
            "state": self.state,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "postal_code": self.postal_code,
            "phone": self.phone_number,
            "id": self.id,
        }


class Donation(db.Model):
    __tablename__ = 'donations'

    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    foodbank_id = db.Column(
        db.Integer, db.ForeignKey('users.id'), nullable=False)
    food_item = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer)
    pickup_preference = db.Column(db.String(50))
    status = db.Column(db.String(50), default="pending")
    isDonated = db.Column(db.Boolean, default=False)
    isAvailable = db.Column(db.Boolean, default=False)
    additional_information = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow, onupdate=datetime.utcnow)

    donor = db.relationship('User', foreign_keys=[
                            donor_id], backref='donations_as_donor', lazy=True)
    foodbank = db.relationship('User', foreign_keys=[
                               foodbank_id], backref='donations_as_foodbank', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "donor_id": self.donor_id,
            "foodbank_id": self.foodbank_id,
            "food_item": self.food_item,
            "quantity": self.quantity,
            "pickup_preference": self.pickup_preference,
            "status": self.status,
            "isDonated": self.isDonated,
        }


# FOOD REQUESTS MODULE
class FoodRequests(db.Model):
    __tablename__ = 'food_requests'

    id = db.Column(db.Integer, primary_key=True)
    requestor_id = db.Column(
        db.Integer, db.ForeignKey('users.id'), nullable=False)
    donation_id = db.Column(db.Integer, db.ForeignKey(
        'donations.id'), nullable=False)
    urgency = db.Column(db.String(100), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    additional_informations = db.Column(db.Text)
    status = db.Column(db.String(100), default="pending")

    requestor = db.relationship('User', foreign_keys=[
        requestor_id], backref='requests_as_requestor', lazy=True)
    donations = db.relationship('Donation', foreign_keys=[
        donation_id], backref='donations', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "requestor": self.requestor_id,
            "donation": self.donation_id,
            "urgency": self.urgency,
            "units": self.units,
            "additional_information": self.additional_informations,
            "status": self.status,
        }
