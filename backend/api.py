from flask import Flask, render_template, Response, request
from app import app, db
from datetime import datetime
from dateutil import parser
import json
from models import Contract, Patient, Product, Producer, Insurer, PayableAmount, CancerStage
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


    try:
        treatment_start = parser.parse(request.json['treatment_start']).date()

        # Find or create insurer
        insurer_name = request.json['insurer']
        match = db.session.query(Insurer) \
                .filter(Insurer.name == insurer_name) \
                .first()

        if match:
            insurer = match
        else:
            insurer = Insurer(name=insurer_name)

        # Find or create manufacturer
        manufacturer_name = request.json['manufacturer']
        match = db.session.query(Producer) \
                .filter(Producer.name == manufacturer_name) \
                .first()

        if match:
            manufacturer = match
        else:
            manufacturer = Producer(name=manufacturer_name)

        # Find or create patient
        patient_surname = request.json['patient_surname']
        patient_name = request.json['patient_name']
        patient_birthday = parser.parse(request.json['patient_birthday']).date()
        patient_cancer_stage = CancerStage(request.json['patient_cancer_stage'])

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
        product_brand = request.json['product_brand']
        product_name = request.json['product_name']
        product_units = request.json['product_units']
        product_baseprice = request.json['product_baseprice']
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
        os = request.json['os']
        no_os = request.json['no_os']
        pfs = request.json['pfs']
        no_pfs = request.json['no_pfs']
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

        
        new_contract = Contract(insurer=insurer, producer=manufacturer, product=product, patient=patient, status='ongoing', treatment_start=treatment_start, payable_amounts=payable_amounts)
        db.session.add(new_contract)
        db.session.commit()

        return Response('{"status": "ok"}', status=200)

    except:

        return Response('{"status": "error"}', status=500)

    





if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)