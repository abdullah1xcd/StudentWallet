"""Unit tests for the Week 5 grade calculator kata."""

import unittest

from grades import calculate_grade


class GradeCalculatorTests(unittest.TestCase):
    """Verify grade boundaries and representative averages."""

    def test_high_average_returns_a(self):
        """A high average receives an A."""
        self.assertEqual(calculate_grade([95, 96, 97]), "A")

    def test_average_in_eighties_returns_b(self):
        """An average in the eighties receives a B."""
        self.assertEqual(calculate_grade([85, 86, 87]), "B")

    def test_average_in_seventies_returns_c(self):
        """An average in the seventies receives a C."""
        self.assertEqual(calculate_grade([75, 76, 77]), "C")

    def test_exactly_ninety_is_an_a(self):
        """The exact 90-point boundary receives an A."""
        self.assertEqual(calculate_grade([90]), "A")


if __name__ == "__main__":
    unittest.main()
