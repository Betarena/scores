# 📃 Squash Description

**PRs**

> Bulleted list of `Pull Requests` Part of this merge to `main`

> - `#3452` - `example`

---

**Detailed**

> Grouped by `Pull Request`, with each section containing the issues relevant to set `Pull Request` - `example`

> **PR** `#73023`
> - closes `#56`
> - closes `#695`

## ℹ Type of change

> Please delete options that are not relevant.

- [ ] 🛠 Bug fix (non-breaking change which fixes an issue)
- [ ] 🚀 New feature (non-breaking change which adds functionality)
- [ ] ❌ Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📃 This change requires a documentation update

# 🧰 How Has This Been Tested?

> Please describe the tests that you ran to verify your changes.
> by simply checking the appropiate checkbox 

- [ ] `localhost`
- [ ] `heroku` | `DEV`

> 🔽 (Optional)
**Test Configuration**:
* Firmware version:
* Hardware:
* Toolchain:
* SDK:

# ✔ Self-checklist:

- [ ] `This code` follows the style guidelines of this project
- [ ] `This code` is self-reviewed
- [ ] `This code` is commented, __particularly in hard-to-understand areas__
- [ ] `Documentation` has been updated
- [ ] `This code` does not generate new warnings
- [ ] `This code` contains added tests that prove my fix is effective or that my feature works
- [ ] `This code` new and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

# ⚠ Warning:

Please ensure that your code does not contain `console` without the `if (dev) console...`
to avoid memory overflows on the server. Or remove the `console` if no longer needed.

Please ensure that any `GraphQL` query used starts with the `prefix` - `REDIS_CACHE_` or `FRONTEND_`. 