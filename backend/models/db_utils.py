from app import db
from dateutil import parser
from models import Contract, Insurer, Patient, CancerStage, PatientEventType, PayableAmount, Producer, Product


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
    payable_amount_conf = PayableAmount(os_after_12_months=0.75,
                                        no_os_after_12_months=0.35,
                                        pfs_after_9_months=0.85,
                                        no_pfs_after_9_months=0.40)

    db.session.add(payable_amount_conf)

    # Add manufacturers
    manufacturer_1 = Producer(name="Roche")
    manufacturer_2 = Producer(name="Novartis")
    manufacturer_3 = Producer(name="Orion")

    db.session.add(manufacturer_1)
    db.session.add(manufacturer_2)
    db.session.add(manufacturer_3)

    # Add insurers
    insurer_1 = Insurer(name="Helsana")
    insurer_2 = Insurer(name="Swica")
    insurer_3 = Insurer(name="OEKK")

    db.session.add(insurer_1)
    db.session.add(insurer_2)
    db.session.add(insurer_3)

    # Add patients
    patient_1 = Patient(surname="Muster",
                        name="Max",
                        birthday=parser.parse('1990-01-01'),
                        cancer_stage=CancerStage.two)
    patient_2 = Patient(surname="Muller",
                        name="Jan",
                        birthday=parser.parse('1998-01-01'),
                        cancer_stage=CancerStage.zero)
    patient_3 = Patient(surname="Zindel",
                        name="Alice",
                        birthday=parser.parse('1985-06-01'),
                        cancer_stage=CancerStage.three)

    # Add example contracts
    contract_1 = Contract(producer=manufacturer_1,
                          insurer=insurer_1,
                          product=product_conf_1,
                          payable_amounts=payable_amount_conf,
                          patient=patient_1,
                          treatment_start=parser.parse('2020-08-01'),
                          status="ongoing")
    contract_2 = Contract(producer=manufacturer_2,
                          insurer=insurer_2,
                          product=product_conf_1,
                          payable_amounts=payable_amount_conf,
                          patient=patient_2,
                          treatment_start=parser.parse('2020-04-30'),
                          status="ongoing")
    contract_3 = Contract(producer=manufacturer_1,
                          insurer=insurer_1,
                          product=product_conf_1,
                          payable_amounts=payable_amount_conf,
                          patient=patient_3,
                          treatment_start=parser.parse('2020-11-30'),
                          status="ongoing")

    db.session.add(contract_1)
    db.session.add(contract_2)
    db.session.add(contract_3)
    db.session.commit()


if __name__ == "__main__":
    delete_db()
    create_db()
    fill_db()
