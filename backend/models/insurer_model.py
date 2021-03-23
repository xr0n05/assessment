from app import db

class Insurer(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    contracts = db.relationship('Contract', backref='insurer', lazy=True)