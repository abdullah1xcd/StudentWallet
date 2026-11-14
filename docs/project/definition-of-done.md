# StudentWallet — Definition of Done

A Product Backlog item is Done only when all applicable conditions below are satisfied and the team can demonstrate the result.

## User story and acceptance
- The story has clear acceptance criteria agreed before implementation.
- All acceptance criteria pass in the delivered application.
- The implementation fits the agreed MVP scope and does not introduce unrelated changes.

## Engineering
- Code is committed to the shared GitHub repository through a pull request.
- At least one other team member reviews the pull request before merge.
- TypeScript checks pass with `bun run lint`.
- Relevant automated tests pass with `bun run test`.
- The production build succeeds with `bun run build`.
- No known critical defects remain in the changed functionality.
- No secrets, real student records, or real payment data are committed.

## Product quality
- The feature works in the supported responsive layouts.
- Inputs are validated and errors or empty states are understandable.
- Monetary values use two decimal places; budget warnings follow the 80% and 100% rules where relevant.
- Existing functionality is not knowingly broken.

## Evidence and tracking
- The Jira issue is updated with its actual status and linked pull request where applicable.
- Tests and acceptance evidence are available to the team.
- Documentation is updated when setup, behavior, or user-facing workflows change.

## Sprint-level completion
A Sprint is complete only after its Sprint Review and Retrospective have actually taken place and the outcomes are recorded. A green CI run must be verified from GitHub Actions; it must not be assumed from the existence of this workflow.
