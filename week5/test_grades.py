import unittest

from grades import calculate_grade


class GradeCalculatorTests(unittest.TestCase):
    def test_high_average_returns_a(self):
        self.assertEqual(calculate_grade([95, 96, 97]), "A")

    def test_average_in_eighties_returns_b(self):
        self.assertEqual(calculate_grade([85, 86, 87]), "B")

    def test_average_in_seventies_returns_c(self):
        self.assertEqual(calculate_grade([75, 76, 77]), "C")

    def test_exactly_ninety_is_an_a(self):
        # This boundary test exposes the original strict-comparison bug.
        self.assertEqual(calculate_grade([90]), "A")


if __name__ == "__main__":
    unittest.main()
