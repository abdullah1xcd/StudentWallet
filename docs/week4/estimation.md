# StudentWallet — Week 4 Estimation

## Estimation approach

The team uses **Story Points** as a relative measure of the effort and uncertainty involved in completing a user story. Points are not hours or days. The estimate considers:
- **Effort:** amount of implementation and testing work.
- **Complexity:** technical difficulty and number of behaviours.
- **Uncertainty / risk:** unclear requirements, dependencies, or integration risk.

The backlog uses a modified Fibonacci scale: **1, 2, 3, 5, 8, 13**. Larger values indicate comparatively greater work or uncertainty. If a story feels larger than 8 points, the team should discuss splitting it into smaller, independently valuable stories.

## Planning Poker process

1. The Product Owner explains the user story and its acceptance criteria.
2. Team members ask clarification questions and identify dependencies.
3. Each estimator privately selects a point value.
4. The team reveals estimates together.
5. High and low estimators explain their reasoning.
6. The team discusses differences and agrees on a final estimate.
7. The agreed value is recorded in Jira's **Story point estimate** field.

Estimates below are the values currently recorded in Jira. They should be treated as team-agreed estimates only if the team actually completed the discussion and consensus process.

## Current Jira estimates

| Jira key | User story | Points | Planned sprint |
|---|---|---:|---|
| SW-5 | Register and sign in with email and password | 5 | Sprint 1 |
| SW-6 | Sign in with Google | 3 | Sprint 4 |
| SW-7 | Add an income transaction | 3 | Sprint 1 |
| SW-8 | Add an expense transaction | 3 | Sprint 1 |
| SW-9 | Edit a transaction | 2 | Sprint 2 |
| SW-10 | Delete a transaction | 2 | Sprint 2 |
| SW-11 | View the transaction history | 3 | Sprint 1 |
| SW-12 | Filter transactions by category, type, and date | 3 | Sprint 2 |
| SW-13 | Use default transaction categories | 2 | Sprint 2 |
| SW-14 | Create a custom category | 3 | Sprint 2 |
| SW-15 | Set a monthly spending limit | 3 | Sprint 3 |
| SW-16 | Warn at 80% of the monthly limit | 3 | Sprint 3 |
| SW-17 | Alert at or above 100% of the monthly limit | 2 | Sprint 3 |
| SW-18 | View a monthly spending summary by category | 5 | Sprint 3 |
| SW-19 | Export transactions to CSV | 3 | Sprint 4 |
| **Total** | **15 stories** | **45** | |

## Rationale for selected estimates

- **2 points:** focused, limited behaviour with relatively low uncertainty (for example, deleting a transaction with a confirmation step).
- **3 points:** a standard feature involving validation, persistence, and UI feedback (for example, adding income or filtering).
- **5 points:** a broader workflow with multiple states or integration concerns (for example, account registration/sign-in or a monthly summary).

The team should revisit estimates if implementation reveals materially different complexity. Any change should be discussed and updated in Jira with a brief reason.

## Important distinction

The estimates and sprint assignments above were read from the current Jira backlog. This document does not claim that Planning Poker was performed in a particular meeting, nor that any sprint velocity has already been measured.
