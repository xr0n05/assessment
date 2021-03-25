from datetime import date

def get_age(birthday):

    today = date.today()
    return today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))