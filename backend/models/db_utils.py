from app import db
from datetime import datetime
from models import Contract, Insurer, Patient, CancerStage, PatientEventType, PayableAmount, Producer, Product, patient_events


def delete_db():
    db.drop_all()

def create_db():
    db.create_all()

    print(db.engine.table_names())


def fill_db():

    # Add example products
    product_conf_1 = Product(brand="ABC", product="vial 10mg/ml", units=10, baseprice=1000)
    product_conf_2 = Product(brand="ABC", product="vial 10mg/ml", units=20, baseprice=1800)
    product_conf_3 = Product(brand="ABC", product="vial 10mg/ml", units=30, baseprice=2500)
    product_conf_4 = Product(brand="ABC", product="vial 20mg/ml", units=10, baseprice=1000)
    product_conf_5 = Product(brand="ABC", product="vial 20mg/ml", units=20, baseprice=2700)
    product_conf_6 = Product(brand="ABC", product="vial 20mg/ml", units=30, baseprice=4100)

    products = [product_conf_1, product_conf_2, product_conf_3, product_conf_4, product_conf_5, product_conf_6]

    for product in products:
        db.session.add(product)

    # Add patient event types
    patient_event_type_1 = PatientEventType(event_name="progressed")
    patient_event_type_2 = PatientEventType(event_name="dead")

    db.session.add(patient_event_type_1)
    db.session.add(patient_event_type_2)

    # Add default payable amount configuration
    payable_amount_conf = PayableAmount(os_after_12_months=0.75, no_os_after_12_months=0.35, pfs_after_9_months=0.85, no_pfs_after_9_months=0.40)

    db.session.add(payable_amount_conf)

    # Add manufacturer
    manufacturer_1 = Producer(name="Roche")
    manufacturer_2 = Producer(name="Novartis")
    manufacturer_3 = Producer(name="Orion")

    db.session.add(manufacturer_1)
    db.session.add(manufacturer_2)
    db.session.add(manufacturer_3)

    # Add insurer
    insurer_1 = Insurer(name="Helsana")
    insurer_2 = Insurer(name="Swica")

    db.session.add(insurer_1)
    db.session.add(insurer_2)

    # Add patient
    patient = Patient(surname="Muster", name="Max", birthday=datetime.now(), cancer_stage=CancerStage.two)

    # Add example contract 
    contract = Contract(producer=manufacturer_1, insurer=insurer_1, product=product_conf_1, payable_amounts=payable_amount_conf, patient=patient, treatment_start=datetime.now(), status="ongoing")

    db.session.commit()


def get_all_contracts():

    # contract = db.session.query(Contract).join(Product).join(Insurer).join(Producer).join(PayableAmount).join(Patient).first()
    contract = db.session.query(Contract).join(Patient).filter(Contract.status == "ongoing").filter(Patient.name == "Max").first()
    print(contract.to_dict())



if __name__ == "__main__":
    # delete_db()
    # create_db()
    # fill_db()
    get_all_contracts()