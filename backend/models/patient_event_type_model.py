from app import db
import enum


class CancerStage(enum.Enum):
    zero = 0
    one = 1
    two = 2
    three = 3


patient_events = db.Table('patient_events',
    db.Column('event_id', db.Integer, db.ForeignKey('patient_event_type.id'), primary_key=True),
    db.Column('patient_id', db.Integer, db.ForeignKey('patient.id'), primary_key=True),
    db.Column('event_ts', db.Date, nullable=False)
)


class PatientEventType(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(80), nullable=False)
    

class Patient(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    surname = db.Column(db.String(80), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    cancer_stage = db.Column(db.Enum(CancerStage), nullable=False)
    patient_events = db.relationship('PatientEventType', secondary=patient_events, lazy='subquery',
        backref=db.backref('patients', lazy=True))
    contracts = db.relationship('Contract', backref='patient', lazy=True)

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "surname": self.surname,
            "birthday": str(self.birthday),
            "cancer_stage": self.cancer_stage.value
        }

