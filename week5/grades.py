"""Grade calculation kata used in the Week 5 exercise."""


def calculate_grade(scores):
    """Return the letter grade for the arithmetic mean of the scores."""
    total = 0
    for score in scores:
        total = total + score
    average = total / len(scores)

    if average >= 90:
        return "A"
    if average >= 80:
        return "B"
    if average >= 70:
        return "C"
    if average >= 60:
        return "D"
    return "F"
