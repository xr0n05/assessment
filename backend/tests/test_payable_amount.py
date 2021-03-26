from dateutil import parser
from utils import check_contract_status


def test_no_events_9_months_passed():

    treatment_start = '2020-04-10'

    test_contract = {
            "os_payable": 0.1,
            "no_os_payable": 0.2,
            "pfs_payable": 0.3,
            "no_pfs_payable": 0.4,
            "treatment_start": treatment_start
    }

    events = []

    assert check_contract_status(test_contract, events) == test_contract["pfs_payable"]


def test_no_events_9_months_ongoing():

    treatment_start = '2021-01-10'

    test_contract = {
            "os_payable": 0.1,
            "no_os_payable": 0.2,
            "pfs_payable": 0.3,
            "no_pfs_payable": 0.4,
            "treatment_start": treatment_start
    }

    events = []

    assert check_contract_status(test_contract, events) == -1


def test_patient_dead_before_month_9():

    treatment_start = '2020-10-10'
    event_date = parser.parse('2021-01-10').date()

    test_contract = {
            "os_payable": 0.1,
            "no_os_payable": 0.2,
            "pfs_payable": 0.3,
            "no_pfs_payable": 0.4,
            "treatment_start": treatment_start
    }

    events = [(0, 0, event_date, "dead")]

    assert check_contract_status(test_contract, events) == test_contract["no_os_payable"]


def test_patient_dead_after_month_9():

    treatment_start = '2020-03-10'
    event_date = parser.parse('2021-01-10').date()

    test_contract = {
            "os_payable": 0.1,
            "no_os_payable": 0.2,
            "pfs_payable": 0.3,
            "no_pfs_payable": 0.4,
            "treatment_start": treatment_start
    }

    events = [(0, 0, event_date, "dead")]

    assert check_contract_status(test_contract, events) == test_contract["pfs_payable"]


def test_patient_progressed_after_month_9():

    treatment_start = '2020-03-10'
    event_date = parser.parse('2021-01-10').date()

    test_contract = {
            "os_payable": 0.1,
            "no_os_payable": 0.2,
            "pfs_payable": 0.3,
            "no_pfs_payable": 0.4,
            "treatment_start": treatment_start
    }

    events = [(0, 0, event_date, "progressed")]

    assert check_contract_status(test_contract, events) == test_contract["pfs_payable"]


def test_patient_progressed_before_month_9_contract_running_12_months():

    treatment_start = '2020-01-01'
    event_date = parser.parse('2020-03-10').date()

    test_contract = {
            "os_payable": 0.1,
            "no_os_payable": 0.2,
            "pfs_payable": 0.3,
            "no_pfs_payable": 0.4,
            "treatment_start": treatment_start
    }

    events = [(0, 0, event_date, "progressed")]

    assert check_contract_status(test_contract, events) == test_contract["os_payable"]


def test_patient_progressed_and_dead_before_month_9():

    treatment_start = '2020-01-01'
    event_1_date = parser.parse('2020-03-10').date()
    event_2_date = parser.parse('2020-04-10').date()

    test_contract = {
            "os_payable": 0.1,
            "no_os_payable": 0.2,
            "pfs_payable": 0.3,
            "no_pfs_payable": 0.4,
            "treatment_start": treatment_start
    }

    events = [(0, 0, event_1_date, "progressed"), (0, 0, event_2_date, "dead")]

    assert check_contract_status(test_contract, events) == test_contract["no_os_payable"]


def test_patient_progressed_and_dead_after_month_9():

    treatment_start = '2020-01-01'
    event_1_date = parser.parse('2020-11-10').date()
    event_2_date = parser.parse('2020-12-10').date()

    test_contract = {
            "os_payable": 0.1,
            "no_os_payable": 0.2,
            "pfs_payable": 0.3,
            "no_pfs_payable": 0.4,
            "treatment_start": treatment_start
    }

    events = [(0, 0, event_1_date, "progressed"), (0, 0, event_2_date, "dead")]

    assert check_contract_status(test_contract, events) == test_contract["pfs_payable"]


def test_patient_progressed_before_and_dead_after_month_9():

    treatment_start = '2020-01-01'
    event_1_date = parser.parse('2020-04-10').date()
    event_2_date = parser.parse('2020-12-10').date()

    test_contract = {
            "os_payable": 0.1,
            "no_os_payable": 0.2,
            "pfs_payable": 0.3,
            "no_pfs_payable": 0.4,
            "treatment_start": treatment_start
    }

    events = [(0, 0, event_1_date, "progressed"), (0, 0, event_2_date, "dead")]

    assert check_contract_status(test_contract, events) == test_contract["no_os_payable"]
