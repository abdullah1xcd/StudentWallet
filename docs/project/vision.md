# StudentWallet — Product Vision

For university students who need to manage limited allowances, income, and everyday expenses, StudentWallet is a responsive personal budgeting web application that helps them record transactions, organize spending into categories, set monthly limits, and understand their financial habits. Unlike manual notes or scattered spreadsheets, StudentWallet brings income and expense tracking, monthly summaries, and clear budget-threshold warnings into one accessible place, with EGP as the default currency. The initial MVP focuses on reliable transaction management, categories, monthly budget limits with warnings at 80% and 100%, and monthly spending summaries.

## Product scope

### MVP
- Record, view, edit, and delete income and expense transactions.
- Organize transactions with default and custom categories.
- Set a monthly spending limit.
- Show a warning at 80% of the limit and an exceeded-budget alert at 100%.
- View a monthly summary of income, expenses, balance, and category totals.

### Stretch goals
- CSV export.
- Additional charts and visual analytics.
- Other enhancements selected from user feedback.

## Product guardrails
- Use test data only; do not store real student financial or payment credentials for this course project.
- EGP is the default currency.
- Store and display monetary amounts to two decimal places.
- A 100% budget-exceeded alert takes precedence over the 80% warning.
