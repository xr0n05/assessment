from datetime import date
from dateutil import parser, relativedelta


def get_age(birthday: date) -> int:

    today = date.today()
    return today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))


def check_contract_status(contract: dict, events: [tuple]) -> float:

    treatment_start = parser.parse(contract["treatment_start"]).date()
    today = date.today()

    time_delta = relativedelta.relativedelta(today, treatment_start)
    months_since_start = time_delta.years * 12 + time_delta.months

    # No progression happend and patient didn't die
    if len(events) == 0:

        # If first 9 months of treatment are over and no progression has occured, return PFS payable amount
        # else the contract is still ongoing
        if months_since_start >= 9:
            return contract["pfs_payable"]
        else:
            return -1

    # If the patients disease progressed and he is still alive
    if len(events) == 1 and events[0][3] == 'progressed':

        # Progression happend after 9 months -> PFS payable amount
        if relativedelta.relativedelta(events[0][2], treatment_start).months >= 9:
            return contract["pfs_payable"]

        # Progression happend before 9 months and 12 months have passed since start of treatment -> OS payable amount
        elif months_since_start >= 12:
            return contract["os_payable"]

    # If the patient died without progression
    if len(events) == 1 and events[0][3] == 'dead':

        # Died after 9 months -> PFS payable amount
        if relativedelta.relativedelta(events[0][2], treatment_start).months >= 9:
            return contract["pfs_payable"]

        # Died before 9 months -> no_OS payable amount
        elif months_since_start < 9:
            return contract["no_os_payable"]

    # If the disease progressed and the patient died within 12 months
    if len(events) == 2 and events[0][3] == "progressed" and events[1][3] == "dead":
        # If progression happend after 9 months -> PFS payable amount
        if relativedelta.relativedelta(events[0][2], treatment_start).months >= 9:
            return contract["pfs_payable"]
        # If progression happend before 9 months -> no_OF payable amount
        else:
            return contract["no_os_payable"]

    # Same as above, just with different event ordering
    if len(events) == 2 and events[1][3] == "progressed" and events[0][3] == "dead":
        # If progression happend after 9 months -> PFS payable amount
        if relativedelta.relativedelta(events[1][2], treatment_start).months >= 9:
            return contract["pfs_payable"]
        # If progression happend before 9 months -> no_OF payable amount
        else:
            return contract["no_os_payable"]

    return -1
