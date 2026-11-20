"""Grade calculation kata used in the Week 5 exercise."""


def calculate_grade(scores):
    """Return the letter grade for the arithmetic mean of the scores.

    Raises:
        ValueError: If no scores are provided.
    """
    if not scores:
        raise ValueError("scores cannot be empty")

    average = sum(scores) / len(scores)

    if average >= 90:
        return "A"
    if average >= 80:
        return "B"
    if average >= 70:
        return "C"
    if average >= 60:
        return "D"
    return "F"
