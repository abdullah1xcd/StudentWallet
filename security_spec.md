# Security Specification & Test Payloads for StudentWallet

## 1. Data Invariants

1. **User Ownership & Isolation**: Every user document at `/users/{userId}` can only be read and written by the authenticated user whose `request.auth.uid == userId`.
2. **Subcollection Encapsulation**: Transactions, budgets, and categories under `/users/{userId}/...` can strictly be accessed, created, updated, and deleted only by `request.auth.uid == userId`.
3. **Data Integrity & Type Safety**:
   - `amount` in transactions and budgets must be a positive number (`amount > 0`).
   - `type` in transactions and categories must be either `'income'` or `'expense'`.
   - String boundaries: Description <= 200 chars, category name <= 64 chars, notes <= 500 chars.
   - Document ID hardening: all document IDs must satisfy `isValidId(id)` (`id.size() <= 128` and matching alphanumeric/dash/underscore).
4. **Immutable Fields**:
   - `createdAt` cannot be altered upon update.
   - For budgets, `month` and `year` are immutable once created.
5. **No Blanket Reads**:
   - Queries must be bounded to the authenticated user's own path (`/users/{userId}/...`). Default deny on the root documents space.

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Identity Spoofing - Profile Takeover)**:
   Authenticated user `uid_attacker` attempts to create or update `/users/uid_victim`.
   *Expected: PERMISSION_DENIED*

2. **Payload 2 (Transaction Cross-Tenant Write)**:
   Authenticated user `uid_attacker` attempts to insert an expense into `/users/uid_victim/transactions/t1`.
   *Expected: PERMISSION_DENIED*

3. **Payload 3 (Negative or Zero Amount in Transaction)**:
   Writing a transaction with `amount: -500` or `amount: 0`.
   *Expected: PERMISSION_DENIED*

4. **Payload 4 (Invalid Transaction Type)**:
   Writing a transaction with `type: "crypto_transfer"` or non-enum string.
   *Expected: PERMISSION_DENIED*

5. **Payload 5 (Unbounded String / Denial of Wallet Attack)**:
   Writing a transaction with `description: <100KB string>`.
   *Expected: PERMISSION_DENIED*

6. **Payload 6 (Shadow Field Injection)**:
   Creating a user profile with injected admin property: `{ fullName: "Evil", email: "evil@test.com", currency: "EGP", isAdmin: true }`.
   *Expected: PERMISSION_DENIED*

7. **Payload 7 (Document ID Poisoning)**:
   Creating a document with a 2KB junk character ID or path traversal sequence.
   *Expected: PERMISSION_DENIED*

8. **Payload 8 (Budget Invalid Month)**:
   Creating a budget with `month: 13` or `month: -1`.
   *Expected: PERMISSION_DENIED*

9. **Payload 9 (Budget Negative Amount)**:
   Creating a monthly budget with `amount: -2000`.
   *Expected: PERMISSION_DENIED*

10. **Payload 10 (Immutable Field Modification)**:
    Updating a transaction and attempting to backdate `createdAt` or change the document owner.
    *Expected: PERMISSION_DENIED*

11. **Payload 11 (Unauthenticated Access)**:
    An unauthenticated guest (`auth == null`) attempting to read any transactions or user profiles.
    *Expected: PERMISSION_DENIED*

12. **Payload 12 (Category Type Corruption)**:
    Creating a category with `type: "invalid_type"` or missing name.
    *Expected: PERMISSION_DENIED*
