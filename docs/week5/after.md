# Week 5 — Before / After and Pairing Reflection

## Before / after comparison

| Concern | Before refactoring | After refactoring |
|---|---|---|
| Structure | Fee calculation mixed validation, discount, late fee, cap, and rounding in one block. | Each rule is expressed as a named constant and a clear sequential step. |
| Magic numbers | Policy values were embedded in the function. | `MEMBER_DISCOUNT`, `LATE_FEE_PER_DAY`, and `MAX_FEE` explain the policy. |
| Readability | The calculation rules and their ordering were harder to scan. | Descriptive names and a docstring make the calculation order explicit. |
| Behavior | Existing behavior could be changed accidentally during cleanup. | Characterization tests cover the observable fee behavior. |
| Verification | The original baseline lint output is not preserved in this repository. | Current implementation checks are run separately; baseline evidence remains pending. |

## Pairing reflection — pending the actual session

Do not submit a first-person reflection until the pair session has happened.
After the session, replace this section with 3–4 truthful sentences covering:

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
source file and recorded in docs/week5/before.txt.
