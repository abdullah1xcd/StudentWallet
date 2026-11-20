Feature: Add an income transaction (SW-7)
  As a student
  I want to record income in EGP
  So that my wallet balance is up to date

  Scenario: Save a valid income transaction
    Given the student is authenticated
    And the current income total is "0.00 EGP"
    When the student records income of "500" EGP dated "2026-11-20" in category "Allowance" with note "Monthly allowance"
    Then the income is saved with amount "500.00 EGP"
    And the income appears in the transaction list
    And the income total increases to "500.00 EGP"

  Scenario: Refuse an income amount that is not greater than zero
    Given the student is authenticated
    When the student attempts to record income of "0" EGP
    Then the income submission is rejected with "Amount must be greater than zero"
    And no income transaction is saved

  Scenario: Store a fractional income amount to exactly two decimal places
    Given the student is authenticated
    When the student records income of "125.5" EGP dated "2026-11-20" in category "Part-time Job" without a note
    Then the income is saved with amount "125.50 EGP"
    And the income appears in the transaction list
    And the income total increases by "125.50 EGP"
