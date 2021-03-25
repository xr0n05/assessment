from flask import Flask, render_template, Response
from app import app, db
from datetime import datetime
import json
from models import Contract, Patient, Product, Producer, Insurer, PayableAmount
from utils import get_age

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/contracts', methods=['GET'])
def get_all_contracts():
    contracts = db.session.query(Contract).all()

    contracts_json = [contract.to_dict() for contract in contracts]

    return json.dumps(contracts_json)

@app.route('/products', methods=['GET'])
def get_all_products():
    products = db.session.query(Product).all()

    products_json = [product.to_dict() for product in products]

    return json.dumps(products_json)

@app.route('/payable-amounts', methods=['GET'])
def get_existing_payable_amounts():
    payable_amounts = db.session.query(PayableAmount).all()

    payable_amounts_json = [payable_amount.to_dict() for payable_amount in payable_amounts]

    return json.dumps(payable_amounts_json)

@app.route('/contract', methods=['POST'])
def create_contract():

    treatment_start = request.form['treatment_start']

    # Find or create insurer
    insurer_name = request.form['insurer']
    match = db.session.query(Insurer) \
            .filter(Insurer.name == insurer_name) \
            .first()

    if match:
        insurer = match
    else:
        insurer = Insurer(name=insurer_name)

    # Find or create manufacturer
    manufacturer_name = request.form['manufacturer']
    match = db.session.query(Producer) \
            .filter(Producer.name == manufacturer_name) \
            .first()

    if match:
        manufacturer = match
    else:
        manufacturer = Producer(name=manufacturer_name)

    # Find or create patient
    patient_surname = request.form['patient_surname']
    patient_name = request.form['patient_name']
    patient_birthday = request.form['patient_birthday']
    patient_cancer_stage = request.form['patient_cancer_stage']

    # Check if patient is young enough for enrollment
    patient_age = get_age(patient_birthday)
    if patient_age >= 55:
        return Response(f"{{'Error':'Patient does not fullfill enrollment criteria: Age {patient_age} >= 55'}}", status=400, mimetype='application/json')

    match = db.session.query(Patient) \
            .filter(Patient.name == patient_name) \
            .filter(Patient.surname == patient_surname) \
            .filter(Patient.birthday == patient_birthday) \
            .first()

    if match:
        patient = match
    else:
        patient = Patient(name=patient_name, surname=patient_surname, birthday=patient_birthday, cancer_stage=patient_cancer_stage)

    # Find or create product configuration
    product_brand = request.form['product_brand']
    product_name = request.form['product_name']
    product_units = request.form['product_units']
    product_baseprice = request.form['product_baseprice']
    match = db.session.query(Product) \
            .filter(Product.brand == product_brand) \
            .filter(Product.product == product_name) \
            .filter(Product.units == product_units) \
            .filter(Product.baseprice == product_baseprice) \
            .first()

    if match:
        product = match
    else:
        product = Product(brand=product_brand, product=product_name, units=product_units, baseprice=product_baseprice)


    # Find or create payable amounts configuration
    os = request.form['os']
    no_os = request.form['no_os']
    pfs = request.form['pfs']
    no_pfs = request.form['no_pfs']
    match = db.session.query(PayableAmount) \
            .filter(PayableAmount.os_after_12_months == os) \
            .filter(PayableAmount.no_os_after_12_months == no_os) \
            .filter(PayableAmount.pfs_after_9_months == pfs) \
            .filter(PayableAmount.no_pfs_after_9_months == no_pfs) \
            .first()

    if match:
        payable_amounts = match
    else:
        payable_amounts = PayableAmount(os_after_12_months=os, no_os_after_12_months=no_os, pfs_after_9_months=pfs, no_pfs_after_9_months=no_pfs)

    
    new_contract = Contract(insurer=insurer, producer=producer, product=product, patient=patient, status='ongoing', treatment_start=treatment_start, payable_amounts=payable_amounts)
    db.session.add(new_contract)
    db.commit()





if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)