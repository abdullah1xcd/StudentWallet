# SET 312 — Agile Software Engineering Lab 6

This folder contains the standalone Python implementation for Lab 6. It is intentionally isolated from the StudentWallet React/TypeScript/Firebase application.

## Setup

From this directory:

```bash
python -m venv .venv
# Windows PowerShell:
.venv\\Scripts\\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

python -m pip install -r requirements.txt
```

## Part A — TDD

Run:

```bash
python -m pytest -q
python -m pytest --cov=registration --cov-report=term-missing
```

The five tests cover successful registration, the 18-hour limit (including state preservation after rejection), duplicate registration, successful drop, and dropping an unregistered course.

**Coverage answer:** No; 100% coverage only shows that every measured statement was executed, not that the tests check every requirement or edge case.

## Part B — BDD

Run:

```bash
python -m behave
```

The feature includes registration, limit, duplicate, outline examples, and the requested drop scenario.

## Part C — Code smells (Task C1)

| Smell | Where | Principle / impact |
|---|---|---|
| Long conditional chain | `make_invoice` branches on `kind` | OCP: adding a fee type requires editing the function |
| Magic numbers | 1200, 2000, 5000, and 0.5 | Readability/maintainability: fee rules are hidden in literals |
| Multiple responsibilities | Calculation, formatting, file I/O, and printing in one function | SRP: several independent reasons to change |
| Direct file dependency | Function opens and writes a disk file itself | DIP: cannot substitute an in-memory writer cleanly |
| Manual resource handling | `open` / `write` / `close` without a context manager | Reliability: file may not close if an exception occurs |
| Repeated per-course calculation | Loops through courses to calculate a total based only on total hours | DRY/readability: unnecessary repeated logic |

## Part C — Refactoring and SiblingPolicy (Task C2)

The characterization tests preserve the three original totals. The refactored `invoice.py` moves fee rules into policy classes, selects them through `POLICIES`, and injects a writer. `SiblingPolicy` applies a 25% discount to the regular fee and is registered by adding one class and one mapping entry; `make_invoice` remains unchanged.

Run the full suite:

```bash
python -m pytest -q
ruff check --select C901 --config "lint.mccabe.max-complexity=1" invoice.py
```

## Part D — StudentWallet story

See `team_story.feature`. It covers **SW-7 — Add an income transaction**, a Must-have story planned for Sprint 1 in `docs/week4/stories.md`. The three scenarios cover the happy path, a refused zero-amount submission, and two-decimal precision with an optional note omitted.
