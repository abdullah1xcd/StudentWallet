# StudentWallet — University Student Budget Management Web Application

> **Tagline:** "Take Control of Your Money."  
> **Target Audience:** University students seeking to build financial discipline, track daily campus expenses, set monthly spending limits, and visualize spending habits.

---

## 1. Project Overview

**StudentWallet** is a modern, responsive, full-stack personal finance web application built specifically for university students. Managing limited student allowances, textbooks, cafeteria lunches, housing costs, and part-time jobs can be overwhelming. StudentWallet provides real-time financial tracking, monthly budget thresholds with warning alerts, categorized breakdowns, and automated reports.

---

## 2. Key Features

- **Authentication & User Isolation**:
  - Secure Email/Password registration & login with client-side validation.
  - One-click Google Sign-In.
  - Password recovery flow via Firebase Auth.
  - Profile customization with display name and currency preferences (EGP default).
  - Strict Firestore document isolation (`users/{userId}/...`).

- **Income & Expense Tracking (CRUD)**:
  - Add, view, edit, and delete income and expense transactions.
  - Instant balance calculation (`Total Income - Total Expenses`).
  - Search, multi-criteria filtering (Type, Category, Month), and date sorting.
  - Confirmation modals before transaction deletion to prevent accidental loss.

- **Monthly Budget Management & Smart Warnings**:
  - Set a monthly allowance ceiling (e.g., 3,000 EGP).
  - Automated budget usage percentage calculation.
  - Proactive warning triggers:
    - **0% – 49%**: Healthy spending
    - **50% – 79%**: Normal spending
    - **80% – 99%**: Warning threshold alert (*"You have used 80% of your monthly budget. Be careful with your spending."*)
    - **100%+**: Budget exceeded alert (*"You have exceeded your monthly budget..."*)
  - Historical view of past monthly budgets with performance tracking.

- **Interactive Visualizations (Recharts)**:
  - **Income vs Expenses**: 6-month historical bar chart comparing monthly cash inflows and outflows.
  - **Expense Distribution**: Donut chart with category colors and percentage share.
  - **Monthly Spending Trend**: Monotone line chart tracking expenditures over time.

- **Reports & Exporting**:
  - Dynamic timeframe filters (This Month, Previous Month, Last 3 Months, Last 6 Months, Custom Range).
  - Monthly comparison between current and previous month with percentage growth indicators.
  - One-click CSV export of transaction records.

- **Category Customization**:
  - Default campus expense categories (Food, Transportation, Education, Entertainment, Shopping, Healthcare, Housing, Other).
  - Default income categories (Allowance, Scholarship, Part-time Job, Freelance, Other).
  - Create custom categories with custom icons and color swatches.
  - Delete validation preventing deletion of categories currently linked to active transactions.

---

## 3. Technology Stack

- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Form Management**: React Hook Form + Zod
- **Backend Infrastructure**: Firebase Authentication & Cloud Firestore
- **Testing**: Vitest + React Testing Library + Gherkin BDD Features

---

## 4. Architecture & Database Design

Cloud Firestore data layout:

```text
users/{userId}
  ├── fullName: string
  ├── email: string
  ├── currency: "EGP" | "USD" | "EUR" | ...
  ├── createdAt: ISO string
  │
  ├── transactions/{transactionId}
  │     ├── type: "income" | "expense"
  │     ├── amount: number (> 0)
  │     ├── categoryId: string
  │     ├── categoryName: string
  │     ├── description: string
  │     ├── notes: string (optional)
  │     ├── date: YYYY-MM-DD
  │     └── createdAt: ISO string
  │
  ├── budgets/{budgetId}  // ID format: YYYY-MM (e.g. 2026-11)
  │     ├── amount: number (> 0)
  │     ├── month: number (1-12)
  │     ├── year: number (2020-2035)
  │     └── createdAt: ISO string
  │
  └── categories/{categoryId}
        ├── name: string
        ├── type: "income" | "expense"
        ├── icon: string (Lucide name)
        ├── color: string (hex code)
        ├── isDefault: boolean
        └── createdAt: ISO string
```

---

## 5. Getting Started & Local Development

### Prerequisites
- Bun (latest stable) — the repository includes `bun.lock`
- Git

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repo-url>
   cd studentwallet
   ```

2. Install dependencies:
   ```bash
   bun install --frozen-lockfile
   ```

3. Configure Firebase:
   - Provide your Firebase client credentials inside `firebase-applet-config.json` or `.env`.
   - Deploy `firestore.rules` to ensure secure database read/write permissions.

4. Start development server:
   ```bash
   bun run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 6. Running Automated Tests

The repository uses **Vitest** for automated unit tests. The `test` script runs `vitest run`, and the `lint` script runs the TypeScript compiler with `tsc --noEmit`.

Run the test suite verifying all 12 core financial calculation scenarios:

```bash
bun run test
```

### BDD Scenarios
Gherkin feature specifications are located in `/features/`:
- `features/add_expense.feature`
- `features/budget_warnings.feature`

---

## 7. Deployment

Build the optimized production bundle:

```bash
bun run build
```

The compiled assets will be output to the `dist/` folder, ready for deployment to Firebase Hosting, Cloud Run, Vercel, or Netlify.

---

## 8. License & Authorship

Developed for the University Software Engineering Agile Project.  
Built with Apache 2.0 license.
