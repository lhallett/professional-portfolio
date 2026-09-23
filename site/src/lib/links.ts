// Support both a custom-domain root and a GitHub Pages project subpath.
export function sitePath(path: string) {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
