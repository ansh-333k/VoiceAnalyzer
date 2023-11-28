import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_marshmallow import Marshmallow

app = Flask(__name__,
						template_folder='../templates/',
						static_folder='../static/')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.abspath(os.getcwd()) + '/database/database.sqlite3'
app.secret_key = 'P@&&w0rd'

db = SQLAlchemy(app)
api = Api(app)
mm = Marshmallow(app)

# from application.models import *
# with app.app_context(): db.create_all()

from application.apis import *

api.add_resource(HomeAPI, '/')
api.add_resource(UserAPI, '/user', '/user/<string:email>')
api.add_resource(TranscriptAPI, '/transcript', '/transcript/<int:id>')
api.add_resource(AnalysisAPI, '/analysis')