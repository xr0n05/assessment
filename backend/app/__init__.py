import sys
from app import conf
from flask import Flask, render_template
from flask_sqlalchemy  import SQLAlchemy


sys.path.append('..')

app = Flask(__name__, static_folder="../../frontend/build/static", template_folder="../../frontend/build")
app.config['SQLALCHEMY_DATABASE_URI'] = conf.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = conf.SQLALCHEMY_TRACK_MODIFICATIONS
db = SQLAlchemy(app)

db.create_all()