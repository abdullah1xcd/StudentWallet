Feature: Add Expense
  As a university student
  I want to record an expense for campus living
  So that my total balance and monthly budget reflect my current spending

  Scenario: Student adds a valid cafeteria expense
    Given the student is authenticated with UID "student_123"
    And the initial monthly expense total is "0 EGP"
    When the student adds an expense of "150 EGP" for category "Food" with description "Cafeteria Lunch"
    Then the expense should be saved in Firestore under "/users/student_123/transactions"
    And the dashboard expense total should increase by "150 EGP"
    And the student should see a success toast notification "Transaction saved successfully!"

  Scenario: Student attempts to add an invalid expense amount
    Given the student is authenticated with UID "student_123"
    When the student submits an expense with amount "-50 EGP"
    Then the validation system should block the submission with "Amount must be greater than zero"
    And no document should be created in Firestore
