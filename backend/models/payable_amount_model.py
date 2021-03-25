from app import db

class PayableAmount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    os_after_12_months = db.Column(db.Float, nullable=False)
    no_os_after_12_months = db.Column(db.Float, nullable=False)
    pfs_after_9_months = db.Column(db.Float, nullable=False)
    no_pfs_after_9_months = db.Column(db.Float, nullable=False)
    contracts = db.relationship('Contract', backref='payable_amounts', lazy=True)


    def to_dict(self):
        return {
            "id": self.id,
            "os_after_12_months": self.os_after_12_months,
            "no_os_after_12_months": self.no_os_after_12_months,
            "pfs_after_9_months": self.pfs_after_9_months,
            "no_pfs_after_9_months": self.no_pfs_after_9_months
        }