/**
 * Client-side UI trigger — signals the Angular client to render
 * the inline contact form. No server-side execution required.
 *
 * Returns the extra response header to set before streaming begins.
 */
export function getShowContactFormHeader(): Record<string, string> {
  return { 'X-Tool-Action': 'show_contact_form' };
}
