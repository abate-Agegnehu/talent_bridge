export type ApiErrorShape = {
  message?: string;
  details?: unknown;
};

export async function postJson<TResponse>(
  url: string,
  body: unknown,
): Promise<TResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errBody: ApiErrorShape | undefined;
    try {
      errBody = (await res.json()) as ApiErrorShape;
    } catch {
      // ignore
    }
    const message = errBody?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return (await res.json()) as TResponse;
}

export async function getJson<TResponse>(url: string): Promise<TResponse> {
  const res = await fetch(url, { method: "GET" });

  if (!res.ok) {
    let errBody: ApiErrorShape | undefined;
    try {
      errBody = (await res.json()) as ApiErrorShape;
    } catch {
      // ignore
    }
    const message = errBody?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return (await res.json()) as TResponse;
}

