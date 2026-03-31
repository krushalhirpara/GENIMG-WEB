export function getHeaders(contentType: string = "application/json") {
  const headers: Record<string, string> = {};

  if (contentType !== "multipart/form-data") {
    headers["Content-Type"] = contentType;
  }

  return headers;
}

export async function publicFetch(url: string, options: RequestInit = {}) {
  const headers = {
    ...options.headers,
  } as Record<string, string>;

  // Only add Content-Type if it's not FormData (handled automatically by fetch)
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

