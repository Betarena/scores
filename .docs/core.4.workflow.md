# 🌊 Workflow

**This section (markdown)** explains on how the workflow is done on this project and that has been embraced and encouraged for developers to follow.

## 🐙 Version Control

When working on the project, your aim should be the following:

1. One `Git Commit` should contain a fully working implementation of a `feature`, `fix`, `chore`, etc. that is related to a single `GitHub Issue`.
2. Commit messages should be clear and concise, with a simple glance conveying the nature of the commit and what it entails.
3. The `Git History` should be linear and easily followed.

### 🐶 Husky (enforcer)

Following the conventions of standard code development :|: [link](https://www.conventionalcommits.org/en/v1.0.0/#specification).

This project uses `Husky` to better describe changes and commits in a structured and correctly written way. More specifically, used to validate:

- Correct format of commit messages written.
- Correct branch names used and created.

Although `Husky` enforces by default the prevously mentioned validations, you can find out more below about these exact conventions below and follow some examples.

### 🪵 Branch Convention

https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4

### ⭕️ Commit Convention

Following :|: https://www.conventionalcommits.org/en/v1.0.0/

<img
  src='git-workflow.png'
  width=600
  alt='Git Workflow Asset Snapshot'
/>

#### [1] 🚀 Standard change

In general, as previously mentioned and can be explored in the overview chart above:

> [!TIP]
> `1 Commit` *should* equate to `1 Issue` being tackled.

So, for example, when working on an implementation of a single widget with a related issue number `#1345`. This issue should have **only a single commit associated to it** when checked on the `git` history.

To achieve this, follow the recommended workflow for standard development:

> [!IMPORTANT]
> Always start working on a new task by creating a new branch from `origin/dev` (in its most latest state).

1. Select a new issue to work on, for example: `#1345: Implementation of Investor Section`.
2. Create a new branch from `origin/dev`, (using the convetional branching naming convention) and calling it `feature/investor-section`.
3. Start working on the implementation of the said **investor section** and create the necessary widgets/components.
4. Once you are happy with your work, create commits to keep track of your work and its progress.

In the situation that you have forgotten to commit a change related to said implementation/issue being worked on that is rather important/critical to grouping of `1 commit` = `1 issue`. You can do the following:

1. Revert/Undo the recently made commit
2. Apply your changes, and commit the updated changes.

However, in the case that the changes where made a while back, you can do the following:

1. If you have not pushed your working branch to `origin` (a.k.a remote), perform a `git history-rewrite`.

   1. To do this, follow the standard git stashing procedure, using the following commands:

      ```bash
      HUSKY=0 git rebase -i <target-commit-SHA-to-update-until>~ # DO NOT FORGET TILDE AT THE END!
      HUSKY=0 git add <target-file-from-git-stash>
      HUSKY=0 git commit --amend --no-edit
      HUSKY=0 git rebase --continue
      ```

      > [!NOTE]
      > When rewriting a `git` history, remember to:
      > - not contain any `working tree` items/files/changes,
      > - use `HUSKY=0` in case it's enabled in project repository,
      > - make use of the (tilde) `~` for target `SHA` commit inclusion.

2. If you have already pushed to a remote, the use of `git history-rewrite` is entirely forbidden, so simply create a new commit and try not to commit to remote to use the power of `git history-rewrite` in the case of other stuff missing and/or changes that where omitted.

> [!NOTE]
> Pushing to a `Heroku Live` project development target server does not count as a `remote`, as it is not used a clean `git` repository, but rather as a `draft` live preview of changes made by a developer, and `git history-rwerite` can be done in such cases.

> [!NOTE]
> When working with new widget and/or respective `server-side` logic implementation via endpoint(s), please be sure to update the respective `.docs/openapi.yaml` documentation. It is recommended to implement the logic of the `openapi.yaml` first, prior to development and implementation to avoid forgetting, as well as, it makes for an overall faster implementation when a respective endpoint has been clearly documented and defiend.

#### [2] 🤔 Unrelated feature/fix/documentation change

If you find yourself working on a `fix/feature` (or something else), and you happen to make a critical change that is urgent/necessary going forward, but is rather unrelated to the currently being worked on task, do the following:

1. Stash target change in its final corrected state (the change that is unrelated to the main worked on task).
2. Check, if you have some other changes related to the recently stashed ones. If so, group those changes into a new branch focusing on that topic.

    ---
    **Example:**

    While working on a new widget, the developer decides to change a critical change to the entire `*.css` and convert it to `*.scss`. The developer will complete this said (unrelated to current work change) and stash it. He will then re-apply back said *stash*, to bring back the just *stashed change* to not break their current `git worktree`.

    The developer will then create a new branch from `origin/dev` and name it with respect to the recently made change topic, such as: `refractor/restructure` and apply their stash there as a `commit`. The developer will then return to the existing `work` on the active branch that was being worked on, and create a `branch merge` from the `refractor/restructure` branch containg the latest unrelated, but necessary changes going forward.

> [!NOTE]
> It is recommended to stay focused on the currently being worked on task, and only after completion should work on unrleated stuff be made.