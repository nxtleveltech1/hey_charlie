export async function readApiError(
  response: Response,
  fallback = "Request failed",
): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const data = (await response.json()) as { error?: string };
      return data.error || fallback;
    } catch {
      return fallback;
    }
  }

  if (response.status === 401) return "Unauthorized — please sign in again";
  if (response.status === 403) return "Forbidden — admin access required";

  return `${fallback} (${response.status})`;
}
