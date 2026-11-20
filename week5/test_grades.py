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

    def test_exactly_eighty_is_a_b(self):
        """The exact 80-point boundary receives a B."""
        self.assertEqual(calculate_grade([80]), "B")

    def test_below_eighty_is_a_c(self):
        """A score immediately below 80 receives a C."""
        self.assertEqual(calculate_grade([79]), "C")

    def test_exactly_seventy_is_a_c(self):
        """The exact 70-point boundary receives a C."""
        self.assertEqual(calculate_grade([70]), "C")

    def test_below_seventy_is_a_d(self):
        """A score immediately below 70 receives a D."""
        self.assertEqual(calculate_grade([69]), "D")

    def test_exactly_sixty_is_a_d(self):
        """The exact 60-point boundary receives a D."""
        self.assertEqual(calculate_grade([60]), "D")

    def test_below_sixty_is_an_f(self):
        """A score immediately below 60 receives an F."""
        self.assertEqual(calculate_grade([59]), "F")


if __name__ == "__main__":
    unittest.main()
