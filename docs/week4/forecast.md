# StudentWallet — Week 4 Release Forecast

## Forecast basis

The current Jira backlog contains **15 stories / 45 Story Points**. Jira assigns the stories to four planned delivery sprints. Sprint 1 has a stated planned scope of **14 points**. Since the planned Sprint 1 dates are 22–28 November 2026 and no completed sprint velocity is available in the project information checked for this document, this is a **capacity-based initial forecast**, not a historical-velocity prediction.

## Sprint forecast from current Jira assignments

| Sprint | Planned dates | Planned stories | Planned points |
|---|---|---:|---:|
| Sprint 1 – Walking Skeleton | 22–28 Nov 2026 | 4 | 14 |
| Sprint 2 – Second Increment | 29 Nov–5 Dec 2026 | 5 | 12 |
| Sprint 3 – MVP and User Feedback | 6–12 Dec 2026 | 4 | 13 |
| Sprint 4 – Improvements and Release | 13–19 Dec 2026 | 2 | 6 |
| **Total** | **4 sprints** | **15** | **45** |

Sprint allocations are the current Jira plan, not a guarantee that every story will be completed in that sprint.

## Forecast interpretation

- The team is planning an initial capacity of approximately **12–14 points per sprint**.
- The four-sprint plan distributes 45 points as 14 + 12 + 13 + 6.
- Sprint 1 is the Walking Skeleton: account access, adding income and expenses, and viewing transaction history.
- Sprint 2 expands transaction management and category support.
- Sprint 3 completes the budget-control and monthly-summary capabilities identified as MVP scope.
- Sprint 4 is reserved for lower-priority improvements and release preparation.

## MVP scope proposal

The proposed MVP includes the 13 must-have stories currently marked as must-have in Jira, plus the planned transaction/category workflow needed to use the wallet. The two explicitly deferred stories are:
- **SW-6 — Google Sign-In (3 points):** alternative authentication method; email/password sign-in remains in the MVP.
- **SW-19 — CSV Export (3 points):** useful export enhancement, but not required for the first usable budget-tracking release.

This puts the proposed MVP at **39 points**, with **6 points deferred**. The team should validate this cut against the actual story map and Product Owner priorities. In the story map, the MVP Line separates the proposed MVP slice from these deferred enhancements.

## Reforecast after Sprint 1

At the end of Sprint 1, calculate actual velocity as the total points of stories that meet the Definition of Done and are accepted—not merely the points started or moved to In Progress.

Then:
1. Compare actual completed points with the 14-point plan.
2. Record unfinished stories and reasons.
3. Use the completed Sprint 1 velocity as the first empirical data point.
4. Reforecast the remaining backlog with the team's observed capacity; avoid treating one sprint as a stable long-term average.
5. Reorder the backlog if feedback or dependencies change priorities.

## Risks and assumptions

- Team availability is assumed to remain similar across the planned sprint dates.
- The sprint assignments in Jira remain the baseline until the team changes them.
- External service configuration, integration defects, or delayed feedback may affect delivery.
- The Sprint 4 allocation is a buffer for improvements and release readiness, not unused guaranteed capacity.
- No historical velocity or burndown result is claimed in this forecast.

**Forecast confidence:** Low-to-medium until at least one sprint is completed and actual velocity is known.
