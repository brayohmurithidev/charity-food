from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os


load_dotenv()

# Create a database object.
db = SQLAlchemy()
load_dotenv()


class DB:
    '''Define the DB class.'''

    def __init__(self, app=None):
        '''The `app` argument is the Flask application object.'''
        self.app = app
        self.db = db
        self.session = db.session

        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
            'MYSQL_DATABASE_URI')
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.secret_key = os.environ.get('SECRET_KEY')

        db.init_app(app)

    def create_all(self):
        '''Create all the database tables with the SQLAlchemy object.'''
        with self.app.app_context():
            self.db.create_all()

    def drop_all(self):
        '''Drop all the database tables with the SQLAlchemy object.'''
        with self.app.app_context():
            self.db.drop_all()

    def save(self, user):
        '''Save the database'''
        self.db.session.add(user)
        self.db.session.commit()

    def delete(self, user):
        '''delete a user from the database'''
        self.db.session.delete(user)
        self.db.session.commit()
