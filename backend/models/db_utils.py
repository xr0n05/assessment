from app import db
from models import Contract, Insurer, Patient, PatientEventType, PayableAmount, Producer, Product, patient_events

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
    db.session.commit()


    

# create_db()
fill_db()