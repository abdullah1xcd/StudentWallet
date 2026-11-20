# Week 5 — Before / After and Pairing Reflection

## Before / after comparison

| Concern | Documented starting point | Current implementation |
|---|---|---|
| Structure | The available assignment/repository documentation describes fee calculation, discount, late fee, cap, and rounding rules, but the original source file is unavailable. | The calculation is expressed as clear sequential steps. |
| Magic numbers | The documented policy values are a 10% member discount, 2 units per late day, and a 100-unit maximum. | `MEMBER_DISCOUNT`, `LATE_FEE_PER_DAY`, and `MAX_FEE` name those policy values. |
| Readability | The original source cannot be inspected to make a direct readability comparison. | Descriptive names and a docstring make the calculation order explicit. |
| Behavior | The original implementation is unavailable, so its exact behavior cannot be independently confirmed. | Tests cover the documented fee rules and the explicit validation decisions in the current implementation. |
| Verification | Original baseline lint output is not preserved in this repository. | Current implementation checks are run separately; baseline evidence remains unavailable. |

## Baseline limitation

The original pre-refactoring `fees.py` was not present in the repository history, and no starter file was available for comparison. The current tests therefore verify the documented expected rules; they should not be described as proof that the refactored code preserves every behavior of the unavailable original implementation.

The decision to reject negative `amount` and negative `late_days` with `ValueError` is an explicit validation rule for the current implementation. It is not claimed to reproduce legacy behavior.

## Pairing reflection — pending the actual session

Do not submit a first-person reflection until the pair session has actually happened. After the session, replace this section with 3–4 truthful sentences covering:

- Which part of the code you and Hazem reviewed together.
- Which test case or edge case you discussed.
- What change or decision you made together, and why.
- What you would improve in your next pairing session.

If no pairing session has happened yet, state that clearly rather than describing a session that did not occur.

## Verification commands

From the repository root:

```bash
python -m unittest discover -s week5 -v
ruff check week5
pylint week5/fees.py week5/test_fees.py week5/grades.py week5/test_grades.py
```

These commands check the current refactored code. The pre-refactoring Ruff
and Pylint evidence must be captured separately from the exact original
source file, if it can be recovered. Do not present current-code results as
pre-refactoring evidence.
