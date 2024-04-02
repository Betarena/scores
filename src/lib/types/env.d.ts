declare const
  /**
   * @description
   * 📝 Scores pacakge version
   * @note
   * Previously used as `VITE_SCORES_PKG_VERSION=v.$(npm pkg get version --workspaces=false | tr -d \\\") npm run [..]`
   * @example
   * => 0.5
   */
  __PKG_VERSION_SCORES__: string,
  /**
   * @description
   * 📝 Scores-Lib package version
   * @note
   * Previously used as `VITE_SCORES_LIB_PKG_VERSION=v.$(npm info @betarena/scores-lib version | tr -d \\\") npm run [..]`
   * @example
   * => 0.5
   */
  __PKG_VERSION_SCORES_LIB__: string,
  /**
   * @description
   * 📝 Ad-Engine package version
   * @example
   * => 0.5
   */
  __PKG_VERSION_AD_ENGINE__: string
;