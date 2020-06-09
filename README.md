# lyon-api-server

## Repo Rules

### Project board
- Never touch the Project board.
- To add new tasks to Project board, please submit an issue,
  - If it is a feature, use the Feature Request template then prefix the title with "Feature: ".
    - Assign the user responsible for the task.
    - Set the label to "enhancement".
    - Set the Project to the repo's project board.
   - If it is a bug, use the Bug Report template then prefix the title with "Bug".
    - Assign the user responsible for the task
    - Set the label to "bug".
    - Set the Project to the repo's project board.
- If you have progressed with the issue, open the issue then set the Project status to "In Progress"
  - The board is automated to migrate the card.
- If you feel that everything is done, submit a PR with the same issue title, then at the description, write "Resolves #(Issue no") for automated issue reference.

### Branches
- If you are working on a new feature, create a branch from 'develop' with a prefix "feature-" with a kebab-cased feature title.

### Pull Requests
- Upon submission of a PR, wait for the reviewer's (Alexis) approval. Upon approval, Alexis will merge the PR to the destination branch and delete the source branch.

### Master Branch
- Do not touch master branch

### Dev Branch
- Every new branch should be made from this branch.
- Only touch this branch for minor fixes.
