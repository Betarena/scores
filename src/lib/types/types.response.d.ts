/**
 * @description
 * 📝 `Permalink` validation response.
 */
export interface IPermalinkValidationResponse
{
  isValid: boolean;
  objRedirect:
  {
    isRedirect: boolean;
    strRedirectUrl: string | null;
  }
}