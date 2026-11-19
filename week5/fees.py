"""Fee calculation rules for StudentWallet's Week 5 refactoring exercise."""

MEMBER_DISCOUNT = 0.10
LATE_FEE_PER_DAY = 2
MAX_FEE = 100


def calculate_fee(amount: float, is_member: bool = False, late_days: int = 0) -> float:
    """Calculate a fee using the legacy order of discount, late fee, cap, rounding.

    Negative amounts are invalid. As in the original implementation, zero or
    negative late_days do not add a late fee.
    """
    if amount < 0:
        raise ValueError("amount cannot be negative")

    fee = amount
    if is_member:
        fee *= 1 - MEMBER_DISCOUNT

    if late_days > 0:
        fee += late_days * LATE_FEE_PER_DAY

    fee = min(fee, MAX_FEE)
    return round(fee, 2)
