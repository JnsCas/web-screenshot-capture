const BASE_URL = 'http://localhost:4000';

export async function get(endpoint) {
  return fetch(`${BASE_URL}${endpoint}`);
}
