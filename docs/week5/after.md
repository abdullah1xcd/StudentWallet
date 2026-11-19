# Week 5 — Before / After and Pairing Reflection

## Before / after comparison

| Concern | Before refactoring | After refactoring |
|---|---|---|
| Structure | Fee calculation mixed validation, discount, late fee, cap, and rounding in one block. | Each rule is expressed as a named constant and a clear sequential step. |
| Magic numbers | `0.90`, `2`, and `100` were embedded in the function. | `MEMBER_DISCOUNT`, `LATE_FEE_PER_DAY`, and `MAX_FEE` explain the policy. |
| Readability | Short variable names and implicit ordering made the rules harder to scan. | Descriptive names and a docstring make the calculation order explicit. |
| Behavior | Legacy behavior was implicit and easy to change accidentally. | Characterization tests lock down discount order, late fees, cap, rounding, and validation. |
| Verification | No focused test suite protected the fee rules. | `test_fees.py` covers the observable fee behavior. |

## Pairing reflection (3–4 sentences)

**Suggested draft — edit this to describe what your pair actually did:**

We used the characterization tests to agree on the existing fee-calculation behavior before refactoring.
The tests helped us preserve the order of the member discount, late fee, maximum cap, and rounding.
We separated the policy values into named constants, which made the calculation easier to read and review.
Next time, we would add the edge-case tests earlier and ask the reviewer to challenge our assumptions about invalid inputs.

## Commands to run before submission

From the repository root:

```bash
python -m unittest discover -s week5 -v
ruff check week5
pylint week5/fees.py week5/test_fees.py
```

Record the actual test and lint results in the pull request. The lint output in
`docs/week5/before.txt` must be captured from the unrefactored baseline, not
reconstructed after the refactor.
