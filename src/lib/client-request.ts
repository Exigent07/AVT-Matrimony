export class RequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "RequestError";
    this.statusCode = statusCode;
  }
}

export async function requestJson<TResponse>(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & TResponse;

  if (!response.ok) {
    throw new RequestError(
      payload.error ?? "Something went wrong. Please try again.",
      response.status,
    );
  }

  return payload;
}
