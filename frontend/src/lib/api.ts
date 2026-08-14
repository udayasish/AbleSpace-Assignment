export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Internal: prevents the 401 refresh retry from looping. */
  _retried?: boolean;
}

/**
 * Rotation revokes the old refresh token, so two requests that 401 together
 * would replay it and trip the server's reuse detection — which kills every
 * session. Sharing one in-flight rotation keeps concurrent callers to a single
 * refresh.
 */
let rotating: Promise<boolean> | null = null;

function refreshSession() {
  rotating ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      rotating = null;
    });

  return rotating;
}

/**
 * Calls the backend through the Next rewrite at /api, so cookies stay
 * first-party. Unwraps `{ data }` and throws ApiError from `{ error }`.
 */
export async function apiFetch<T>(
  path: string,
  { body, _retried, headers, ...init }: ApiOptions = {},
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Access token expired — rotate once, then replay the original request.
  if (res.status === 401 && !_retried && path !== "/auth/refresh") {
    if (await refreshSession()) {
      return apiFetch<T>(path, { body, headers, ...init, _retried: true });
    }
  }

  const payload = (await res.json().catch(() => null)) as
    | { data?: T; error?: string }
    | null;

  if (!res.ok) {
    throw new ApiError(payload?.error ?? "Request failed", res.status);
  }

  return payload?.data as T;
}
