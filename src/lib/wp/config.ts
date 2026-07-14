/**
 * Базовый URL WordPress REST API.
 * Можно переопределить через VITE_WP_BASE_URL.
 */
export const WP_BASE_URL =
  (import.meta.env.VITE_WP_BASE_URL as string | undefined) ??
  "https://content.vestnikmecenata.ru";

export const WP_API = `${WP_BASE_URL}/wp-json/wp/v2`;