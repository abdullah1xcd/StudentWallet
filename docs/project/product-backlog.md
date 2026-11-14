# StudentWallet — Product Backlog

**Course:** SET 312 — Agile Software Engineering  
**Project:** StudentWallet (Idea 9 — Student Budget Tracker)  
**Team:** StudentWallet — Team 10 — g2/1

Story-point estimates below are the team's proposed estimates from the project documentation. Confirm them through the team's Planning Poker discussion and keep Jira estimates synchronized.

| ID | Epic | User story | Priority | Points |
|---|---|---|---|---:|
| US01 | Authentication | As a student, I want to register using my email and password so that I can create a personal account. | Must | 5 |
| US02 | Authentication | As a student, I want to sign in using Google so that I can access my account easily. | Should | 3 |
| US03 | Transaction Management | As a student, I want to add an income transaction so that I can track the money I receive. | Must | 3 |
| US04 | Transaction Management | As a student, I want to add an expense transaction so that I can monitor my spending. | Must | 3 |
| US05 | Transaction Management | As a student, I want to edit a transaction so that I can correct inaccurate information. | Must | 2 |
| US06 | Transaction Management | As a student, I want to delete a transaction so that I can remove incorrect records. | Must | 2 |
| US07 | Transaction Management | As a student, I want to view all my transactions so that I can review my financial history. | Must | 3 |
| US08 | Transaction Management | As a student, I want to filter transactions by category, type, and date so that I can find specific records. | Should | 3 |
| US09 | Category Management | As a student, I want to view default income and expense categories so that I can organise my transactions. | Must | 2 |
| US10 | Category Management | As a student, I want to create custom categories so that I can personalise my organisation. | Should | 3 |
| US11 | Budget Management | As a student, I want to set a monthly spending limit so that I can control my expenses. | Must | 3 |
| US12 | Budget Management | As a student, I want to receive a warning when I spend 80% of my monthly budget so that I can reduce unnecessary spending. | Must | 3 |
| US13 | Budget Management | As a student, I want to receive an alert when I exceed my monthly budget so that I know my spending is too high. | Must | 2 |
| US14 | Reports and Summary | As a student, I want to view monthly income and expense summaries so that I can understand my financial situation. | Must | 5 |
| US15 | Reports and Summary | As a student, I want to export my transactions as a CSV file so that I can keep an external record. | Could | 3 |

## Prioritisation and estimation

- **MoSCoW:** Must = essential to the MVP; Should = important improvement; Could = optional if time allows.
- **Story points:** Relative estimate of complexity, effort, and testing. Confirm estimates as a team using Planning Poker.
- **Backlog ordering:** The Product Owner orders stories by business value, dependencies, and effort, with input from the team.

## MVP and stretch scope

The MVP includes authentication, income and expense management, categories, monthly summaries, and monthly budget thresholds. CSV export (US15) is a stretch item and should not displace required MVP work.

## Key business rules

- Currency: EGP.
- Monetary amounts are stored and displayed to exactly two decimal places.
- Budget warning at 80% of the monthly limit.
- Exceeded-budget alert at 100% or above.
- Test data only; no real payment processing or real personal financial data.

## Jira alignment

Jira is the source of truth for current issue keys, estimates, priorities, sprint placement, and assignees. Update this document if the team changes the backlog in Jira.
