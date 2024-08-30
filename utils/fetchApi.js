import { API_HOST } from "@/constants";

async function get(relativeURL) {
  const res = await fetch(`${API_HOST}/wp-json/mirae/v1${relativeURL}`);
//   console.log(res, relativeURL)
  if (res.status === 404) {
    return []
  } else {
    return await res.json();
  }
}

export default async function fetchAPIOnPageLoad(...urls) {
    const urlData = await Promise.all(urls.map((url) => get(url)));
    return urlData;
}
