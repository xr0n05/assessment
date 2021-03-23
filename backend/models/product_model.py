from app import db

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(80), nullable=False)
    product = db.Column(db.String(80), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    baseprice = db.Column(db.Integer, nullable=False)
    contracts = db.relationship('Contract', backref='product', lazy=True)