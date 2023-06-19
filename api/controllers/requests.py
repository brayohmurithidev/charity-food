from db.models import Donation, User, FoodRequests
from db.db import db
from typing import Any
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.orm.exc import NoResultFound
from typing import Any


# ADD REQUEST
def add_request(data: Any) -> FoodRequests:
    request = FoodRequests(**data)
    db.session.add(request)
    db.session.commit()
    request_obj = FoodRequests.query.filter(request.id == Donation.id).first()
    return request_obj


# Find request
def find_request(**kwargs: Any):
    query = FoodRequests.query
    for key, value in kwargs.items():
        try:
            query = query.filter(getattr(FoodRequests, key) == value)
        except AttributeError:
            raise InvalidRequestError
    if query is None:
        raise NoResultFound
    return query


def update_request(id: int, **kwargs: Any) -> None:
    request_to_update = find_request(id=id).first()
    for key, value in kwargs.items():
        if not hasattr(request_to_update, key):
            raise ValueError
        setattr(request_to_update, key, value)
        db.session.commit()
    return None


class Requests:
    # CREATE A RELIEF REQUEST
    @staticmethod
    def create_request(data):
        new_request = add_request(data)
        return new_request

    # @GET DONATION BY ID
    @staticmethod
    def get_request_by_id(id: int) -> FoodRequests:
        request = find_request(id=id).first()
        return request.to_dict()

    # UPDATE REQUEST STATUS
    @staticmethod
    def update_request(id: int, data: Any) -> None:
        try:
            request = find_request(id=id).first()
            update_request(request.id, **data)
            return None
        except NoResultFound:
            return ValueError

    # GET REQUESTS BY REQUESTOR

    @staticmethod
    def get_all_requests_by_requestor(requestor_id: int):
        try:
            requests = db.session.query(FoodRequests, User, Donation).join(
                Donation, FoodRequests.donation_id == Donation.id).join(
                User, User.id == Donation.foodbank_id).filter(
                FoodRequests.requestor_id == requestor_id).all()

            request_list = []
            for request, user, donation in requests:
                request_data = request.to_dict()
                user_data = user.to_dict()
                donation_data = donation.to_dict()

                request_data['user'] = user_data
                request_data['donation'] = donation_data
                request_list.append(request_data)
            return request_list
        except NoResultFound:
            raise ValueError

    # @staticmethod
    # def get_all_requests_by_requestor(requestor_id: int):
    #     try:
    #         requests = db.session.query(FoodRequests, User, Donation).join(
    #             User, FoodRequests.requestor_id == User.id).join(
    #             Donation, FoodRequests.donation_id == Donation.id).filter(
    #             FoodRequests.requestor_id == requestor_id).all()

    #         request_list = []
    #         for request, user, donation in requests:
    #             request_data = request.to_dict()
    #             user_data = user.to_dict()
    #             donation_data = donation.to_dict()

    #             request_data['user'] = user_data
    #             request_data['donation'] = donation_data
    #             request_list.append(request_data)
    #         return request_list
    #     except NoResultFound:
    #         raise ValueError

    # GET REQUESTS SENT for A donation
