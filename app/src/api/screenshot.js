import { get } from './httpClient';

export async function getScreenshot(url, format) {
  console.log(`Getting screenshot...`);
  const response = await get(`/screenshot?url=${url}&format=${format}`);
  if (response.status === 200) {
    return response.blob();
  }
  throw new Error(`Error in server, status ${response.status}`);
}
