/**
 * Centralized API Client & Resilient URL Resolver for Legalens
 * Handles IPv4 (127.0.0.1), localhost (::1), and production cloud deployments.
 */

export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // 1. Explicit environment variable if configured
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    }

    // 2. Match the current browser hostname (localhost, 127.0.0.1, or local IP)
    const hostname = window.location.hostname || "localhost";
    return `http://${hostname}:8000`;
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
};

export const apiUrl = (endpoint: string): string => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};

/**
 * Resilient fetch wrapper with automatic fallback between 127.0.0.1 and localhost
 */
export async function resilientFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const primaryUrl = apiUrl(endpoint);

  try {
    const res = await fetch(primaryUrl, options);
    return res;
  } catch (err) {
    // If primary failed with connection error, try alternate endpoint
    const fallbackBase = primaryUrl.includes("127.0.0.1:8000")
      ? "http://localhost:8000"
      : primaryUrl.includes("localhost:8000")
      ? "http://127.0.0.1:8000"
      : null;

    if (fallbackBase) {
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const fallbackUrl = `${fallbackBase}${cleanEndpoint}`;
      try {
        const fallbackRes = await fetch(fallbackUrl, options);
        return fallbackRes;
      } catch {
        // Both network endpoints unreachable
      }
    }

    // Also attempt Next.js rewrite proxy as last resort
    try {
      const cleanEndpoint = endpoint.startsWith("/api/")
        ? endpoint.replace(/^\/api\//, "/api/backend/")
        : `/api/backend${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
      const proxyRes = await fetch(cleanEndpoint, options);
      return proxyRes;
    } catch {
      throw err;
    }
  }
}
