MAX_HOURS = 18


class RegistrationError(Exception):
    """Raised when a course registration rule is violated."""


class Student:
    def __init__(self, student_id):
        self.student_id = student_id
        self.courses = {}

    @property
    def total_hours(self):
        return sum(self.courses.values())

    def register(self, code, hours):
        self.courses[code] = hours
