def ph_answer(ph):
    if ph <= 7.38:
        return "acidosis"
    elif ph >= 7.42:
        return "alkalosis"
    else:
        return "regular"