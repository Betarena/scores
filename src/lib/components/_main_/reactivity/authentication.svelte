<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  // ╭─────
  // │ > 🔥 Authentication listener.
  // │ IMPORTANT
  // │ > [x3] Kicker(s)
  // ╰─────
  $: if_R_0
    = browser
    && user == undefined
  ;
  $:
  if (if_R_0)
  {
    _DEBUG_('Option0');
    sessionStore.updateData
    (
      'globalStateAdd',
      'NotAuthenticated'
    );
  }
  else
  {
    _DEBUG_('Option0');
    sessionStore.updateData
    (
      'globalStateAdd',
      'Authenticated'
    );
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>
