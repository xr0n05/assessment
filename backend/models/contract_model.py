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
    amount = db.Column(db.Float, nullable=False, default=-1)
    status = db.Column(db.String(80), nullable=False)


    def to_dict(self):
        
        return {
            "id": self.id,
            "treatment_start": str(self.treatment_start),
            "status": self.status,
            "producer_id": self.producer_id,
            "producer_name": self.producer.name,
            "insurer_id": self.insurer_id,
            "insurer_name": self.insurer.name,
            "product_id": self.product_id,
            "medication_brand": self.product.brand,
            "medication_product": self.product.product,
            "medication_units": self.product.units,
            "medication_baseprice": self.product.baseprice,
            "patient_id": self.patient_id,
            "patient_name": self.patient.name,
            "patient_surname": self.patient.surname,
            "patient_birthday": str(self.patient.birthday),
            "patient_cancer_stage": self.patient.cancer_stage.value,
            "payable_amount_id": self.payable_amount_id,
            "os_payable": self.payable_amounts.os_after_12_months,
            "no_os_payable": self.payable_amounts.no_os_after_12_months,
            "pfs_payable": self.payable_amounts.pfs_after_9_months,
            "no_pfs_payable": self.payable_amounts.no_pfs_after_9_months,
            "amount": self.amount
        }
