declare global
{
  namespace NodeJS
  {
    interface ProcessEnv
    extends
    ImportMetaEnv
    {
      /** @description Target `file` of type `.env.*` used */
      ENV_TARGET?: string | undefined;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { };
