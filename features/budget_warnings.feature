Feature: Monthly Budget & Spending Alerts
  As a university student on a fixed allowance
  I want to receive warning alerts when approaching or exceeding my budget
  So that I do not run out of money before the end of the academic month

  Scenario: Budget reaches 80% warning threshold
    Given the student has set a monthly budget of "3000 EGP" for month "2026-11"
    When the student logs cumulative expenses totaling "2400 EGP"
    Then the budget usage indicator should display "80% used"
    And the alert banner should warn "You have used 80% of your monthly budget. Be careful with your spending."
    And the status badge should show "Warning" with amber styling

  Scenario: Budget exceeds 100% limit
    Given the student has set a monthly budget of "3000 EGP" for month "2026-11"
    When the student logs cumulative expenses totaling "3300 EGP"
    Then the budget usage indicator should display "110% used"
    And the alert banner should display "You have exceeded your monthly budget by 300"
    And the status badge should show "Budget Exceeded" with rose red styling
