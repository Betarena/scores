# ⚜️ Code Style

_This_ markdown contains the outlined guidelines as to how the code should be `styled` and `commented`.

> [!IMPORTANT]
> Code structure and/or format are not discussed in this `markdown` as they are enforced already with `EsLint` / `.eslintrc.yaml` and will/should be enforced as standard `Intellisense`.

## 📝 Documentation

For _this_ project, the following `documentation` can be found, and should be followed:

### 📌 Comments/Notes/Remarks

Should be followed **across all files in the project**:

```javascript
// ▓ NOTE:
// ▓ > used to describe code that follows suit.
// ▓ > can be multi-line comment, but preferred to be single-line.
// const targetValue = [..]

// ▓ IMPORTANT:
// ▓ > used to describe important piece of information
// ▓ > that follows suit, or ralted to a target section.

// ▓ WARNING:
// ▓ > used to describe a caution/warning piece of information
// ▓ > that follows suit, or ralted to a target section.

// ▓ CHECK:
// ▓ > used to describe a check/validation step.
// ▓ > that follows suit, or ralted to a target section.
// if (some-logic-here)
// {
//
// }

// ▓ > read-more :|: http://some-link-for-reference-on-below-topic
// const targetValue2 = [..]

// ▓ [🐞]
// console.log('checking');
```

### 🔹 JavaScript/TypeScript

> [!IMPORTANT]
> Code structure and/or format are not discussed *in depth* in this `markdown` as they are
> enforced already with `EsLint (.eslint.yaml)` and will/should be enforced as standard `Intellisense` by
> your preferred `code editor`.

```typescript
/**
 * @author
 *  <-git-user-name-as-author-of-function->
 * @summary
 *  <-quick-function-tag/summary-goes-here->
 *  for-example:
 *  🔹 HELPER | IMPORTANT | 🟥 MAIN | 💠 HASURA | 🔹 TYPES | 🔹 INTERFACE
 * @description
 *  📣 <-function-description-goes-here->
 * @example
 * // returns <-give-example-of-return-here->
 * doSomething(20, 10, false)
 * @param { number } [valueX = 0]
 * **[optional]** <-function-target-parameter-description-goes-here->, `deafult = 0`.
 * @return { number } valueY
 * **[required]** <-function-return-description-goes-here->
 * @param { number } [valueZ = false]
 * **[optional]** <-function-target-parameter-description-goes-here->, `deafult = false`.
 * @returns { string }
 *  <-function-return-description-goes-here->
 */
function doSomething
(
  valueX: number = 0,
  valueY: number,
  valueZ: boolean = false
): string
{
  // doSomething(..) logic goes here;

  return;
}
```

### 🟧 SvelteJs/SvelteKit

Take a look at `./.docs/core.code-style.md/*` to understand the structure/format that should be implied in the `.svelte` files, and other complementary `svelte`/`svelte-kit` common file types.

#### 📝 Nomaculture

Target `.svelte` files should **always** follow the naming scheme: `<SampleName-FurtherName-<Main|Child|Row|Table|PopUp|etc.>.svelte`.

### ⚙️ Makefile

```makefile
make-target-command-example:
  @# ╭──────────────────────────────────────────────────────────────────╮
  @# │ ▓ NOTE: ▓ DESCRIPTION                                            │
  @# │ > add _this_ target description purpose here.                    │
  @# │ > can be multi-line description.                                 │
  @# ╰──────────────────────────────────────────────────────────────────╯

  @echo \
    "$(COLOUR_B)\
    \n╭──────────────────────────────────────────────────────────────────╮\
    \n│ 🚀 target execute running                                        │\
    \n╰──────────────────────────────────────────────────────────────────╯\
    $(END_COLOUR)\n"
  @

  @your-command-goes-here\
    preferrably-multi-line-flags-explained-per-line\
    command-flag-1\
    command-flag-2
  @
#
```