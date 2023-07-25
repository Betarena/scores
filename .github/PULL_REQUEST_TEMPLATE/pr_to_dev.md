### 📃 Description

> Please include a summary of the change and which issue is fixed.
> List any dependencies that are required for this change.
> Please also include relevant motivation and context, using the respective @user-name and the relevant fix/code created.

> For example:
> - @migbash Updated documentation.
> - @migbash Fixed a bug.

- @<github-user-name> `<what-has-been-done>`

----

**Fixes** 

- #`<issue-number>`

----

### 📌 Type of change

> Please delete options (below) that are not relevant to `this` Pull-Request.

- [ ] 📑 Chore update
> Changes that invlove simple `chore` / `maintenance` changes, such as:
> - `documentation`
> - `folder/file simple restructure`
> - `syntax`
> - `typos`
> - `code clean`
> - etc.

- [ ] 🐞 Bug fix
> Changes involving **small** and **minor** `bug-fixes`, such as:
> - `fixing functionality`
> - `fixing faulty logic`
> - `fixing errors`
> - `fixing error handling/exceptions`
> - etc.

- [ ] ⚡️ New feature
> Changes involving **minor** and **major** new **feature/enhancements**, such as:
> - `new widget`
> - `new improvements`
> - `new endpoints`
> - `new pages`
> - `new logic`

- [ ] ❌ Breaking change
> **Major** changes that will and/or can cause issues and functionality to break.
> - `major project restructiring`
> - `major project feature change`
> - `major project bug fix`
> - `major project endpoints update`

----

### 🧰 How Has This Been Tested?

> Please describe the tests that you ran to verify your changes.
> by simply checking the appropiate checkbox 

- [ ] `localhost`
- [ ] `heroku (DEV)`

----

### ✔ Self-checklist:

- [ ] `This code` follows the style guidelines of this project.
- [ ] `This code` is self-reviewed.
- [ ] `This code` is peer-reviewed.
- [ ] `This code` is properly commented, __particularly in hard-to-understand areas__.
- [ ] `Documentation` has been updated.
- [ ] `This code` does not generate new warnings.
- [ ] `This code` contains added tests that prove my fix is effective or that my feature works.
- [ ] `This code` new and existing unit tests pass locally with my changes.
- [ ] Any dependent changes have been merged and published in downstream modules.

----

### ⚠ Warning(s):

Please ensure that your code does not contain `console` without the `if (dev) console...`
to avoid memory overflows on the server. Use the internal `debug.ts` project methods to gurantee no `poroduction`
leaks of `console` errors. Or remove the `console` if no longer needed.

----
