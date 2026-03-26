# GITHUB ISSUES & WORKFLOW GUIDE

This document serves as the mandatory protocol for AI Dev Agents working on THE PROJECT. Proper tracking ensures visibility, collaboration, and project maturity.

## 🚨 MANDATORY PROTOCOL FOR AI AGENTS

### 1. Pre-Implementation Audit
Before modifying any code, you MUST:
-   **Check Existing Issues**: Call `list_issues` to see what is currently open.
-   **Identify the Task**: Match the USER request to an existing issue OR create a new one if it doesn't exist.
-   **Check Milestones**: Call `list_milestones` to ensure the task aligns with the current project goals.

### 2. Standard Issue Lifecycle

#### A. Creation
When starting a new feature or fix that isn't yet tracked:
-   **Title**: Use a concise, action-oriented title (e.g., `feature: add contact form validation`).
-   **Body**: Include a "Objective" and "Implementation Plan" (bullet points).
-   **Labels**: Use appropriate labels (e.g., `bug`, `feature`, `refactor`, `documentation`).

#### B. In-Progress Updates
-   **Comments**: If a task takes multiple turns, add a progress comment to the issue.
-   **Linking**: Mention the issue number in commit messages (e.g., `fix: mobile navigation issue #12`).

#### C. Completion & Closure
-   **Resolution**: Before finishing the turn, add a final comment to the issue summarizing the changes made.
-   **Closure**: Explicitly close the issue if the task is fully completed.

### 3. Milestone Discipline
-   **Progress Tracking**: Regularly update the state of issues linked to milestones.
-   **Completion Check**: If all issues for a milestone are closed, notify the USER and suggest opening the next milestone.

## 📝 TEMPLATES

### Issue Title Format:
- `feature: [short description]`
- `bug: [short description]`
- `chore: [short info]`
- `ui: [visual change description]`

### Issue Body Template:
```markdown
### Objective
[Brief description of what must be achieved]

### Implementation Plan
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
```

---

*This guide is part of the project's Core DNA. Deviating from these rules is considered a failure in professional AI development.*
