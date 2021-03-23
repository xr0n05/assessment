from app import db

class Contract(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    producer_id = db.Column(db.Integer, db.ForeignKey('producer.id'),
        nullable=False)
    insurer_id = db.Column(db.Integer, db.ForeignKey('insurer.id'),
        nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'),
        nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'),
        nullable=False)
    payable_amount_id = db.Column(db.Integer, db.ForeignKey('payable_amount.id'),
        nullable=False)
    treatment_start = db.Column(db.Date, nullable=False)