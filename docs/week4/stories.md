# StudentWallet — Week 4 User Stories

**Project:** StudentWallet — University Student Budget Management Web Application  
**Jira project:** [SW](https://abdullahmohamedharoon8.atlassian.net/plugins/servlet/project-config/SW)  
**Backlog:** [View all StudentWallet stories in Jira](https://abdullahmohamedharoon8.atlassian.net/issues/?jql=project%20%3D%20SW%20AND%20issuetype%20%3D%20Story%20ORDER%20BY%20key%20ASC)

This document records the 15 stories currently present in the Jira backlog. Story keys, summaries, estimates, labels, and sprint assignments were checked against Jira when this document was prepared. Acceptance criteria below follow the corresponding Jira descriptions.

## Story format

> As a **[user]**, I want **[capability]**, so that **[benefit]**.

## Backlog

### Epic: Transactions Management

#### SW-5 — Register and sign in with email and password
**Priority:** Must-have · **Estimate:** 5 points · **Planned sprint:** Sprint 1 – Walking Skeleton

As a student, I want to create an account and sign in with my email and password so that my financial data is private.

**Acceptance Criteria**
- Given valid registration details, when I submit the form, then an account is created.
- Given valid credentials, when I sign in, then I reach my wallet dashboard.
- Given invalid credentials, when I sign in, then a clear error is shown and access is denied.

#### SW-6 — Sign in with Google
**Priority:** Should-have · **Estimate:** 3 points · **Planned sprint:** Sprint 4 – Improvements and Release

As a student, I want to sign in with Google so that I can access my account conveniently.

**Acceptance Criteria**
- Given a valid Google account, when I complete Google authentication, then I am signed in.
- If authentication is cancelled or fails, then no session is created and an error is shown.

#### SW-7 — Add an income transaction
**Priority:** Must-have · **Estimate:** 3 points · **Planned sprint:** Sprint 1 – Walking Skeleton

As a student, I want to record income in EGP so that my wallet balance is up to date.

**Acceptance Criteria**
- I can enter an amount greater than zero, date, category, and optional note.
- The amount is stored with exactly two decimal places.
- The new income appears in the transaction list and updates totals.

#### SW-8 — Add an expense transaction
**Priority:** Must-have · **Estimate:** 3 points · **Planned sprint:** Sprint 1 – Walking Skeleton

As a student, I want to record an expense in EGP so that I can track my spending.

**Acceptance Criteria**
- I can enter an amount greater than zero, date, category, and optional note.
- The amount is stored with exactly two decimal places.
- The new expense appears in the transaction list and updates totals.

#### SW-9 — Edit a transaction
**Priority:** Must-have · **Estimate:** 2 points · **Planned sprint:** Sprint 2 – Second Increment

As a student, I want to edit a transaction so that I can correct mistakes.

**Acceptance Criteria**
- The edit form is prefilled with the transaction's current values.
- Saving valid changes updates the transaction and relevant totals.
- Invalid amounts are rejected with a clear message.

#### SW-10 — Delete a transaction
**Priority:** Must-have · **Estimate:** 2 points · **Planned sprint:** Sprint 2 – Second Increment

As a student, I want to delete a transaction so that incorrect records are removed.

**Acceptance Criteria**
- The app asks for confirmation before deletion.
- After confirmation, the transaction is removed from the list and totals are recalculated.
- Cancelling confirmation leaves the transaction unchanged.

#### SW-11 — View the transaction history
**Priority:** Must-have · **Estimate:** 3 points · **Planned sprint:** Sprint 1 – Walking Skeleton

As a student, I want to view my income and expenses so that I can review my financial activity.

**Acceptance Criteria**
- Transactions are displayed with amount, type, category, and date.
- The newest transactions appear first by default.
- An empty state is displayed when no transactions exist.

#### SW-12 — Filter transactions by category, type, and date
**Priority:** Should-have · **Estimate:** 3 points · **Planned sprint:** Sprint 2 – Second Increment

As a student, I want to filter transactions so that I can find specific records quickly.

**Acceptance Criteria**
- I can filter by income/expense type, category, and date range.
- Applied filters only show matching transactions.
- I can clear filters and return to the full list.

### Epic: Categories

#### SW-13 — Use default transaction categories
**Priority:** Must-have · **Estimate:** 2 points · **Planned sprint:** Sprint 2 – Second Increment

As a student, I want predefined categories so that I can classify transactions consistently.

**Acceptance Criteria**
- Common categories such as Food, Transport, Books, and Entertainment are available.
- I can select a category when adding or editing a transaction.
- The selected category is saved with the transaction.

#### SW-14 — Create a custom category
**Priority:** Should-have · **Estimate:** 3 points · **Planned sprint:** Sprint 2 – Second Increment

As a student, I want to create my own category so that the wallet matches my spending habits.

**Acceptance Criteria**
- I can create a category with a non-empty name.
- Duplicate category names are rejected or prevented.
- The new category becomes available when recording transactions.

### Epic: Monthly Budget and Alerts

#### SW-15 — Set a monthly spending limit
**Priority:** Must-have · **Estimate:** 3 points · **Planned sprint:** Sprint 3 – MVP and User Feedback

As a student, I want to set a monthly spending limit so that I can control my expenses.

**Acceptance Criteria**
- I can set a positive monthly limit in EGP.
- The limit is stored with exactly two decimal places.
- The current month's spending is compared with the configured limit.

#### SW-16 — Warn when spending reaches 80% of the monthly limit
**Priority:** Must-have · **Estimate:** 3 points · **Planned sprint:** Sprint 3 – MVP and User Feedback

As a student, I want to be warned when I use 80% of my budget so that I can adjust my spending early.

**Acceptance Criteria**
- When monthly expenses reach or exceed 80% but remain below 100%, an 80% warning is shown.
- The warning is not shown below the threshold.
- The calculation uses the current month's expense total.

#### SW-17 — Alert when monthly spending reaches or exceeds 100% of the limit
**Priority:** Must-have · **Estimate:** 2 points · **Planned sprint:** Sprint 3 – MVP and User Feedback

As a student, I want an alert when I reach or exceed my monthly limit so that I know I have exceeded my budget.

**Acceptance Criteria**
- When monthly expenses reach or exceed 100% of the limit, an exceeded-budget alert is shown.
- The 100% alert takes precedence over the 80% warning.
- The alert updates when transactions are edited or deleted.

### Epic: Monthly Reports

#### SW-18 — View a monthly spending summary by category
**Priority:** Must-have · **Estimate:** 5 points · **Planned sprint:** Sprint 3 – MVP and User Feedback

As a student, I want a monthly summary of my spending by category so that I understand where my money goes.

**Acceptance Criteria**
- I can select a month and see total income, total expenses, and net balance.
- Expenses are grouped by category with correct totals.
- Only transactions in the selected month are included.

#### SW-19 — Export transactions to CSV
**Priority:** Could-have · **Estimate:** 3 points · **Planned sprint:** Sprint 4 – Improvements and Release

As a student, I want to export my transactions to CSV so that I can analyze or keep a backup of my records.

**Acceptance Criteria**
- I can export the transactions included by the selected filters.
- The CSV contains date, type, amount, category, and note columns.
- The downloaded file opens as a valid CSV with correctly formatted amounts.

---

## Definition of Ready (DoR)
A story is ready for sprint planning when it has a clear user value, acceptance criteria, an agreed priority, an estimate, and no unresolved dependency that prevents the team from starting.

## Definition of Done (DoD)
A story is done when:
- All acceptance criteria pass.
- Code is reviewed and merged into the agreed integration branch.
- Relevant automated tests pass.
- Lint/type checks and production build pass.
- No known critical defect remains for the story.
- The increment is integrated and demonstrated to the Product Owner.

## Scope note
The MVP boundary in `story-map.svg` is a proposed release-scope cut based on the current Jira priorities and sprint plan. The team should confirm it during story mapping and with the Product Owner before treating it as final.
