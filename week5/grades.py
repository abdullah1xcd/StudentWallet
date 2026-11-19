def calculate_grade(scores):
    total = 0
    for score in scores:
        total = total + score
    average = total / len(scores)

    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"
