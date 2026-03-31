export class RequestError extends Error {
  statusCode: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    options?: { fieldErrors?: Record<string, string> },
  ) {
    super(message);
    this.name = "RequestError";
    this.statusCode = statusCode;
    this.fieldErrors = options?.fieldErrors;
  }
}

function getDefaultRequestError() {
  if (typeof window !== "undefined" && window.localStorage.getItem("language") === "ta") {
    return "ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.";
  }

  return "Something went wrong. Please try again.";
}

function normalizeRequestError(
  value: unknown,
  fallback: string,
): { message: string; fieldErrors?: Record<string, string> } {
  if (Array.isArray(value)) {
    const firstMessage = value.find(
      (item): item is { message?: string } =>
        typeof item === "object" && item !== null && "message" in item,
    )?.message;

    return {
      message:
        typeof firstMessage === "string" && firstMessage.trim() ? firstMessage : fallback,
    };
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed.startsWith("[")) {
      try {
        return normalizeRequestError(JSON.parse(trimmed), fallback);
      } catch {
        return { message: trimmed || fallback };
      }
    }

    return { message: trimmed || fallback };
  }

  if (typeof value === "object" && value !== null) {
    const message =
      "message" in value && typeof value.message === "string"
        ? value.message
        : fallback;
    const fieldErrors =
      "fieldErrors" in value &&
      typeof value.fieldErrors === "object" &&
      value.fieldErrors !== null
        ? (value.fieldErrors as Record<string, string>)
        : undefined;

    return { message, fieldErrors };
  }

  return { message: fallback };
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
    error?: unknown;
    fieldErrors?: Record<string, string>;
  } & TResponse;

  if (!response.ok) {
    const fallback = getDefaultRequestError();
    const normalized = normalizeRequestError(payload.error, fallback);

    throw new RequestError(
      normalized.message,
      response.status,
      {
        fieldErrors: payload.fieldErrors ?? normalized.fieldErrors,
      },
    );
  }

  return payload;
}
