/** Breadcrumb identifiers refer to the production site, including during prerender. */
export function breadcrumbUrl(path: string): string {
  return new URL(path, 'https://vidsiq.com/').href;
}