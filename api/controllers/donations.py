from db.models import Donation, User
from db.db import db
from typing import Any
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import and_


# ADD donation
def add_donation(data) -> Donation:
    donation = Donation(**data)
    db.session.add(donation)
    db.session.commit()
    donation_obj = Donation.query.filter(donation.id == Donation.id).first()
    return donation_obj

# find donations by


def find_donations_by(**kwargs: Any):
    query = Donation.query
    for key, value in kwargs.items():
        try:
            query = query.filter(getattr(Donation, key) == value)
        except AttributeError:
            raise InvalidRequestError
    if query is None:
        raise NoResultFound
    return query


def update_donation(id: int, **kwargs: Any) -> None:
    donation_to_update = find_donations_by(id=id).first()
    for key, value in kwargs.items():
        if not hasattr(donation_to_update, key):
            raise ValueError
        setattr(donation_to_update, key, value)
        db.session.commit()
    return None


class Donation_service():
    @staticmethod
    def create_donation(data: tuple) -> Donation:
        new_donation = add_donation(data)
        return new_donation

    @staticmethod
    def get_donation_by_id(id: int) -> Donation:
        donation = find_donations_by(id=id).first()
        return donation.to_dict()

    @staticmethod
    def update_donation_status(id: int, data: Any) -> None:
        try:
            donation = find_donations_by(id=id).first()
            update_donation(donation.id, **data)
            return None
        except NoResultFound:
            raise ValueError

    @staticmethod
    def make_donation(id: int) -> None:
        try:
            donation = find_donations_by(id=id).first()
            update_donation(donation.id, isDonated=True)
            return None
        except NoResultFound:
            raise ValueError

# GET BY FOODBANK ID
    @staticmethod
    def get_all_donations_by_foodbank(foodbank_id: int):
        try:
            donations = db.session.query(Donation, User).join(
                User, Donation.donor_id == User.id).filter(Donation.foodbank_id == foodbank_id).all()

            donations_list = []
            for donation, user in donations:
                donation_data = donation.to_dict()
                user_data = user.to_dict()
                donation_data['user'] = user_data
                donations_list.append(donation_data)
            return donations_list
        except NoResultFound:
            raise ValueError


# GET BY FOODBANK ID WHERE

    @staticmethod
    def get_all_donations_by_foodbank_where(foodbank_id: int, **kwargs):
        query = db.session.query(Donation, User).join(
            User, Donation.donor_id == User.id).filter(Donation.foodbank_id == foodbank_id)
        for key, value in kwargs.items():
            try:
                query = query.filter(
                    and_(
                        getattr(Donation, key) == value,
                        Donation.foodbank_id == foodbank_id,
                    )
                )
            except AttributeError:
                raise InvalidRequestError
        if query is None:
            raise NoResultFound
        donations = query.all()

        donations_list = []
        for donation, user in donations:
            donation_data = donation.to_dict()
            user_data = user.to_dict()
            donation_data['user'] = user_data
            donations_list.append(donation_data)
        return donations_list

    # GET BY FOODBANK ID

    @staticmethod
    def get_all_available_donations(min_lat, max_lat, min_lon, max_lon):
        try:
            donations = Donation.query.filter(
                Donation.isAvailable == True).all()
            donation_lists = []
            for donation in donations:
                donation_bank = User.query.filter(
                    and_(
                        donation.foodbank_id == User.id,
                        User.latitude.between(float(min_lat), float(max_lat)),
                        User.longitude.between(float(min_lon), float(max_lon)),
                    )
                ).first()
                if donation_bank is None:
                    donation_bank = User.query.filter(
                        donation.foodbank_id == User.id,
                    ).first()
                donation_bank_data = donation_bank.to_dict()
                donation_data = donation.to_dict()
                donation_data['foodbank'] = donation_bank_data
                donation_lists.append(donation_data)
            return donation_lists
        except NoResultFound:
            raise ValueError

    # GET BY DONOR ID
    @staticmethod
    def get_all_donations_by_donor(donor_id: int):
        try:
            donations = db.session.query(Donation, User).join(
                User, Donation.foodbank_id == User.id).filter(Donation.donor_id == donor_id).all()

            donations_list = []
            for donation, foodbank in donations:
                donation_data = donation.to_dict()
                foodbank_data = foodbank.to_dict()
                donation_data['foodbank'] = foodbank_data
                donations_list.append(donation_data)
            return donations_list
        except NoResultFound:
            raise ValueError
