from flask import Flask, request, jsonify, abort, make_response
from db.db import DB, db
from db.models import Donation as tblDonation
from controllers.auth import Auth
from controllers.donations import Donation_service as Donation
from sqlalchemy.orm.exc import NoResultFound
from controllers.requests import Requests
from flask_cors import CORS


app = Flask(__name__)
DB = DB(app)
CORS(app, supports_credentials=True)


@app.route('/', methods=['GET'])
def test():
    return jsonify({"message": "Success"})


# UPDATE DONATION AVAILABILITY STATUS ALWAYS
@app.before_request
def update_isAvailable():
    tblDonation.query.filter_by(status='completed').update(
        {tblDonation.isAvailable: True})
    db.session.commit()

# register new user


@app.route('/api/register',  methods=['POST'])
def create_user():
    data = request.json
    email = data.get('email')
    try:
        Auth.register_user(data)
        return jsonify({"message": f'User {email} created successfully', "success": True}), 200
    except ValueError:
        return jsonify({"message": f'User {email} Already registerd', "success": False}), 400

# LOGIN USER


@app.route('/api/session', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return abort(400)
    user = Auth.valid_login(email, password)
    if user:
        session_id = Auth.create_session(email)
        response = make_response(
            {"success": True, "message": "Logged in successfully", "session_id": session_id, "id": user['id'], "role": user['role']})
        # Set the cookie with an expiration time
        response.set_cookie("session_id", value=session_id)
        # max_age=3600
        return response, 200
    return abort(401)

# LOGOUT USER


@app.route('/api/session', methods=['DELETE'])
def logout():
    session_id = request.cookies.get('session_id')
    if not session_id:
        return abort(404)
    try:
        user = Auth.get_user_from_session_id(session_id)
        Auth.destroy_session(user.id)
        response = make_response(
            jsonify({"success": True, "message": "Logged out successfully"}))
        response.set_cookie('session_id', 'deleted', max_age=0)
        return response,  200
    except NoResultFound:
        return jsonify({"success": False, "message": "Invalid Session Id or user does not exist"}), 403

# GET USER DATA


@app.route("/api/profile", methods=["GET"])
def profile():
    try:
        # Retrieve the session ID from the cookie
        session_id = request.cookies.get("session_id")
        print(session_id)
        if not session_id:
            return "Cookie error"
        user = Auth.get_user_from_session_id(session_id)
        return user.to_dict()
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500

# RESET USER PASSWORD


@app.route('/api/reset_password', methods=['POST'])
def get_reset_password_token():
    email = request.json.get('email')
    try:
        token = Auth.get_reset_password_token(email)
        return jsonify({"success": True, "email": email, "reset_token": token}), 200
    except ValueError:
        return abort(403)

# UPDATE PASSWORD


@app.route('/api/reset_password', methods=['PUT'])
def update_password():
    data = request.json
    email = data.get('email')
    reset_token = data.get('reset_token')
    new_password = data.get('new_password')

    try:
        Auth.update_password(reset_token, new_password)
        return jsonify({"email": email, "message": "Password updated", "success": True}), 200
    except Exception:
        return abort(403)


# DONATION ROUTES
# CREATE NEW DONATION
@app.route('/api/donations', methods=['POST'])
def create_donation():
    data = request.json
    try:
        Donation.create_donation(data)
        return jsonify({"message": "Thank You for Your generous donation, a followup will be made", "success": True})
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500

# Get donation by id


@app.route('/api/donations/<int:id>', methods=['GET'])
def get_donation_by_id(id):
    try:
        donation = Donation.get_donation_by_id(id)
        return donation
    except NoResultFound:
        return jsonify({"message": "No donation found", "success": False}), 403


@app.route('/api/donations/<int:id>', methods=['PUT'])
def update_donation_status(id):
    data = request.json
    try:
        Donation.update_donation_status(id, data)
        return jsonify({"message": "Data Updated successfully", "success": True})
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500


@app.route('/api/donate/<int:id>', methods=['PUT'])
def donate_food(id):
    try:
        Donation.make_donation(id)
        return jsonify({"message": "Donation Given out"})
    except Exception:
        return abort(403)

# GET DONATIONS BY USER


@app.route('/api/foodbanks/<int:foodbank_id>/donations', methods=['GET'])
def get_by_foodbank_id(foodbank_id):
    try:
        donations = Donation.get_all_donations_by_foodbank(foodbank_id)
        return donations
    except Exception:
        return abort(403)

# GET DONATIONS BY USER


@app.route('/api/donors/<int:donor_id>/donations', methods=['GET'])
def get_by_donor_id(donor_id):
    try:
        donations = Donation.get_all_donations_by_donor(donor_id)
        return donations
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500


@app.route('/api/foodbanks_near_me', methods=['GET'])
def foodbanks_near_me():
    # data = request.arg
    minLat = request.args.get('minLat')
    maxLat = request.args.get('maxLat')
    minLon = request.args.get('minLon')
    maxLon = request.args.get('maxLon')

    # radius = 10
    try:
        users = Auth.filter_food_banks(minLat, maxLat, minLon, maxLon)
        return users
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500

# JOINED BANK TO DONATIONS


@app.route('/api/foodbank/donations', methods=['GET'])
def get_fdbnk_donations():
    # data = request.arg
    minLat = request.args.get('minLat')
    maxLat = request.args.get('maxLat')
    minLon = request.args.get('minLon')
    maxLon = request.args.get('maxLon')
    try:
        donations = Donation.get_all_available_donations(
            minLat, maxLat, minLon, maxLon)
        return donations
    except ValueError:
        return jsonify({"success": False, "message": "No foods around Your area"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500

# ENDPOINTS TO REQUESTS

# CREATE A REQUEST


@app.route('/api/requests', methods=['POST'])
def create_request():
    data = request.json
    try:
        Requests.create_request(data)
        return jsonify({
            "message": "Created Successfully",
            "success": True
        })
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500

# MAKE A REQUEST BY ID


@app.route("/api/requests/<int:id>", methods=["GET"])
def get_request_by_id(id):
    try:
        request = Requests.get_request_by_id(id)
        return request
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500


# UPDATE REQUEST STATUS
@app.route('/api/requests/<int:id>', methods=['PUT'])
def update_request_status(id):
    data = request.json
    try:
        Requests.update_request(id, data)
        return jsonify({"message": "Data Updated successfully", "success": True})
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500


# GET DONATIONS BY USER
@app.route('/api/requestors/<int:requestor_id>/requests', methods=['GET'])
def get_by_requestor_id(requestor_id):
    try:
        requests = Requests.get_all_requests_by_requestor(requestor_id)
        return requests
    except Exception as e:
        return jsonify({"success": False, "message": "Error occurred", "error": str(e)}), 500


if __name__ == '__main__':
    DB.create_all()
    app.run(debug=True, port='5000')