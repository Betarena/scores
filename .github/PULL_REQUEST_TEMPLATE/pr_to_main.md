![Static Badge](https://img.shields.io/badge/pull--request-%E2%9E%A8_branch%3Amain-black?logo=github&color=%23FF7518%09&cacheSeconds=0)

### 📌 Pull-Request Squash

### ⤴ PR's

> ❗️ Add below, a bulleted list of `Pull Requests` that are a part of `this` merge/squash to `branch:main`
> for example:
> 
> - `#<issue-number>`
> - `#<issue-number>`
---

### ➕ PR in detail

> ❗️ Group below by `Pull Request`, with each section containing the issues relevant to set `Pull Request`,
> for example:
> 
> **PR** `#73023`
> - closes `#<issue-number>`
> - closes `#<issue-number>`

----

### 📌 PR type(s)

> ❗️ Please remove checkbox options (below) that are not relevant to `this` Pull-Request.

- [ ] 📑 Chore update(s)
> ⤥ changes that invlove simple **chore** / **maintenance** changes, such as: documentation, folder/file simple restructure, syntax, typos, code clean, etc.

- [ ] 🐞 Bug fix(es)
> ⤥ changes involving **small** and **minor** **bug-fixes**, such as: fixing functionality, fixing faulty logic, fixing errors, fixing error handling/exceptions, etc.

- [ ] ⚡️ New feature(s)
> ⤥ changes involving **minor** and **major** new **feature/enhancements**, such as: new widget, new improvements, new endpoints, new pages, new logic

- [ ] ❌ Breaking change(s)
> ⤥ **major** changes that will and/or can cause **issues and functionality to break**, such as: major project restructiring, major project feature change, major project bug fix, major project endpoints update, etc.

----

### 🧰 How was code tested?

> ❗️ Please select the checkboxes to inform of the ran tests to verify code.

- [ ] `local testing`
- [ ] `heroku (DEV)`

----

### ✔ Self-checklist

> ❗️ Please select the checkboxes that apply below, as a developer **self-checklist**, for completion.

- [ ] This code follows the style guidelines of this project.
- [ ] This code is self-reviewed.
- [ ] This code is peer-reviewed.
- [ ] This code is properly commented, __particularly in hard-to-understand areas__.
- [ ] Documentation has been updated.
- [ ] This code does not generate new warnings.
- [ ] This code contains added tests that prove my fix is effective or that my feature works.
- [ ] This code new and existing unit tests pass locally with my changes.
- [ ] Any dependent changes have been merged and published in downstream modules.

----

### ⚠ Warning(s)

- `console.(..)`

> ⤥ Please ensure that your code does not contain `console` without the `if (dev) console...`
> to avoid memory overflows on the server. Use the internal `debug.ts` project methods to gurantee no `poroduction`
> leaks of `console` errors. Or remove the `console` if no longer needed.

----
