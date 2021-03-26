import json
from dateutil import parser, relativedelta
from flask import render_template, Response, request

from app import app, db
from models import Contract, Patient, patient_events, Product, Producer, \
                   Insurer, PayableAmount, CancerStage, PatientEventType
from utils import get_age, check_contract_status


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


@app.route('/event', methods=['POST'])
def create_new_event():

    patient_id = request.json["patient_id"]
    event_name = request.json["event_name"]
    event_ts = request.json["event_ts"]

    event_type = db.session.query(PatientEventType) \
        .filter(PatientEventType.event_name == event_name) \
        .first()

    statement = patient_events.insert() \
        .values(patient_id=patient_id, event_id=event_type.id, event_ts=parser.parse(event_ts))
    db.session.execute(statement)
    db.session.commit()

    # Check contract status
    contract = db.session.query(Contract) \
        .filter(Contract.patient_id == patient_id) \
        .first()

    patient_events_list = db.session.query(patient_events, PatientEventType.event_name) \
        .join(Patient) \
        .join(PatientEventType) \
        .filter(Patient.id == patient_id) \
        .all()

    payable_amount = check_contract_status(contract.to_dict(), patient_events_list)

    if payable_amount == -1:
        pass
    else:
        start_to_event_months = relativedelta.relativedelta(parser.parse(event_ts).replace(tzinfo=None),
                                                            contract.treatment_start).months
        contract.amount = start_to_event_months * (contract.product.baseprice * payable_amount)
        contract.status = 'finished'
        db.session.commit()

    return Response('{"status": "ok"}', 200)


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


@app.route('/patients', methods=['GET'])
def get_all_patients():
    patients = db.session.query(Patient).all()

    patients_json = [patient.to_dict() for patient in patients]

    return json.dumps(patients_json)


@app.route('/patient/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    # Patient info
    patient = db.session.query(Patient) \
        .filter(Patient.id == patient_id) \
        .first()

    patient_json = patient.to_dict()

    # Patient events
    patient_events_list = db.session.query(patient_events, PatientEventType.event_name) \
        .join(Patient) \
        .join(PatientEventType) \
        .filter(Patient.id == patient_id) \
        .all()

    patient_events_dict = [f"Event: {x[3]} on date: {x[2].strftime('%d/%m/%Y')}" for x in patient_events_list]
    patient_json["events"] = patient_events_dict

    # Contract info

    patient_contract = db.session.query(Contract) \
        .filter(Contract.patient_id == patient_id) \
        .first()

    patient_json["treatment_start"] = str(patient_contract.treatment_start)
    patient_json["medication"] = f"{patient_contract.product.brand} {patient_contract.product.product} {patient_contract.product.units}; Baseprice {patient_contract.product.baseprice} CHF"
    patient_json["contract_status"] = patient_contract.status

    print(patient_json)
    return json.dumps(patient_json)


@app.route('/contracts', methods=['GET'])
def get_all_contracts():
    contracts = db.session.query(Contract).all()

    contracts_json = [contract.to_dict() for contract in contracts]

    return json.dumps(contracts_json)


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
            return Response(f"{{'Error':'Patient does not fullfill enrollment criteria: Age {patient_age} >= 55'}}",
                            status=400,
                            mimetype='application/json')

        match = db.session.query(Patient) \
            .filter(Patient.name == patient_name) \
            .filter(Patient.surname == patient_surname) \
            .filter(Patient.birthday == patient_birthday) \
            .first()

        if match:
            patient = match
        else:
            patient = Patient(name=patient_name,
                              surname=patient_surname,
                              birthday=patient_birthday,
                              cancer_stage=patient_cancer_stage)

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
            product = Product(brand=product_brand,
                              product=product_name,
                              units=product_units,
                              baseprice=product_baseprice)

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
            payable_amounts = PayableAmount(os_after_12_months=os,
                                            no_os_after_12_months=no_os,
                                            pfs_after_9_months=pfs,
                                            no_pfs_after_9_months=no_pfs)

        new_contract = Contract(insurer=insurer,
                                producer=manufacturer,
                                product=product,
                                patient=patient,
                                status='ongoing',
                                treatment_start=treatment_start,
                                payable_amounts=payable_amounts)

        # Check if contract is already finished -> simulation purposes
        payable = check_contract_status(new_contract.to_dict(), [])

        if not payable == -1:
            # No events could have been generated at contract creation -> bill for 9 months PFS
            new_contract.amount = 9 * (product_baseprice * payable)
            new_contract.status = 'finished'

        db.session.add(new_contract)
        db.session.commit()

        return Response('{"status": "ok"}', status=200)

    except:

        return Response('{"status": "error"}', status=500)


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
