import unittest

from fees import calculate_fee


class FeeCharacterizationTests(unittest.TestCase):
    """Lock down the legacy fee rules before changing their structure."""

    def test_regular_fee_is_unchanged(self):
        self.assertEqual(calculate_fee(40), 40)

    def test_member_discount_is_applied_before_late_fee(self):
        self.assertEqual(calculate_fee(100, is_member=True, late_days=2), 94)

    def test_late_fee_is_two_per_day(self):
        self.assertEqual(calculate_fee(40, late_days=3), 46)

    def test_fee_is_capped_after_discount_and_late_fee(self):
        self.assertEqual(calculate_fee(120, is_member=True, late_days=2), 100)

    def test_negative_late_days_do_not_add_a_fee(self):
        self.assertEqual(calculate_fee(40, late_days=-2), 40)

    def test_result_is_rounded_to_two_decimal_places(self):
        self.assertEqual(calculate_fee(10.005), 10.01)

    def test_negative_amount_is_rejected(self):
        with self.assertRaises(ValueError):
            calculate_fee(-1)


if __name__ == "__main__":
    unittest.main()
