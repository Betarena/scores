// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 25.06.2025.                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Capacitor Configuration File (capacitor.config.ts)
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import type { CapacitorConfig } from '@capacitor/cli';

// #endregion ➤ 📦 Package Imports

const
  /**
   * @description
   * 📝 Capacitor configuration for the Betarena WOS application.
   */
  config: CapacitorConfig
    = {
      appId: 'com.betarena.com.betarena',
      appName: 'Betarena WOS',
      webDir: 'build',
    }
;

export default config;
