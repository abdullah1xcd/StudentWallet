# Week 5 Findings — Grade Calculator Kata

## Findings table

| Area | Finding | Evidence / impact | Suggested action |
|---|---|---|---|
| Correctness (hidden bug) | Original grade thresholds used strict `>` comparisons. | A score of exactly 90 was classified as B; exactly 80 as C, and so on. | Define the grade boundaries explicitly and use inclusive comparisons. |
| Input handling | Empty score lists are not validated. | `calculate_grade([])` raises `ZeroDivisionError` rather than a meaningful validation error. | Reject empty input with `ValueError`. |
| Input handling | Scores are not range-checked. | Negative scores or scores above 100 can produce misleading grades. | Validate every score is numeric and between 0 and 100. |
| Readability | Accumulation is written as a manual loop. | More lines and mutable state than needed for a simple average. | Use `sum(scores) / len(scores)` after validation. |
| Maintainability | Grade thresholds and labels are embedded in conditional logic. | Changing the grading scale requires editing the function body. | Keep threshold rules clear and covered by boundary tests. |
| Testing | The original tests cover ordinary values but not boundaries. | The strict-comparison bug can pass happy-path tests. | Add one test for each exact threshold and invalid input. |

## Hidden-bug explanation

The hidden bug in the original Kata was an off-by-one boundary error. The original
condition `average > 90` meant an average of exactly 90 did not qualify for A and
fell through to B. The same defect repeated at 80, 70, and 60. The test
`test_exactly_ninety_is_an_a` exposed the problem; the submitted `grades.py` fixes
it with inclusive lower-bound comparisons (`>=`). The intended scale is A for
90–100, B for 80–89.99, C for 70–79.99, D for 60–69.99, and F below 60.

## Additional code smells

- **Missing guard clause:** empty input reaches division instead of failing early.
- **Primitive obsession / magic numbers:** thresholds are hard-coded with no names or explanation.
- **Weak contract:** accepted score types and valid range are undocumented and unchecked.
- **Insufficient edge-case coverage:** tests focus on representative averages, not exact cutoffs.

## Fee calculator validation decision

Negative `late_days` is now rejected with `ValueError("late_days cannot be negative")`,
and a regression test verifies this behavior. This is an explicit input-validation
decision made during review; because the original `fees.py` was unavailable, it is
not presented as behavior preserved from a legacy implementation.

## Pair review prompts

1. Does the agreed grading scale treat each lower boundary as inclusive?
2. Should non-integer scores be allowed, and should booleans be rejected explicitly?
3. Are invalid input errors documented and tested consistently?
