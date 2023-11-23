## About

`_this_` markdown contains the outlined guidelines as to how the code should be `styled` and `commented`.

> **Important ::**
> Code structure and/or format are not discussed in this `markdown` as they are enforced already with `EsLint` and will/should be enforced as standard `Intellisense`.

### 📝 Documentation

For `_this_` project, the following `documentation` can be found, and should be followed:


#### JavaScript/TypeScript

```typescript
/**
 * @author
 *  migbash
 * @summary
 *  quick-function-tag/summary-goes-here
 * @description
 *  function-description-goes-here
 * @param { number } [valueX = 0]
 *  function-target-parameter-description-goes-here
 * @return { number }
 *  function-return-description-goes-here
 */
function doSomething
(
  valueX: number = 0
): number
{
  // logic goes here
}
```

#### SvelteJs/SvelteKit

Take a look at `.github/CONTRIBUTING_TEMPLATES/Svelte-Boilerplate.v6.svelte` to understand the structure that should be implied in the `.svelte` files.

In addition, take a look at the other files provided in `.github/CONTRIBUTING_TEMPLATES` folder/directory to better understand different types of possible `.svelte` structures that should be employed in different situations.

#### Makefile

```makefile
target-execute:
  @echo ""
  # ▓ DESCRIPTION
  # ▓ > add _this_ target description purpose here.
  # ▓ > can be multi-line description.
  @echo ""

  @ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  @echo\
    "$(COLOUR_G)\
    \n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
    \n▓ 🚀 target execute running                ▓\
    \n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
    $(END_COLOUR)\n"

  @ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  @your-command-goes-here\
    preferrably-multi-line

  @ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  @echo ""
#
```

### 📌 Comments

For this project, the following `comments` can be found, and should be followed:

```javascript
// ▓ NOTE:
// ▓ > used to describe code that follows suit.
// ▓ > can be multi-line comment, but preferred to be single-line.
// const doSomething = [..]

// ▓ @see :> http://some-link-for-reference-on-below-topic
// const doSomethingUnique = [..]
```