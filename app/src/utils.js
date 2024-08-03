const HTTPS = 'https://';

export function sanitizeUrl(url) {
  if (!url.startsWith(HTTPS)) {
    return HTTPS + url;
  }
  return url;
}
