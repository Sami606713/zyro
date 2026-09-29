const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && token) {
    const refreshToken = localStorage.getItem("zyro-refresh-token") || localStorage.getItem("zyro-admin-refresh-token");
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE}/users/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem("zyro-token", data.access_token);
          localStorage.setItem("zyro-refresh-token", data.refresh_token);
          if (localStorage.getItem("zyro-admin-token")) {
            localStorage.setItem("zyro-admin-token", data.access_token);
            localStorage.setItem("zyro-admin-refresh-token", data.refresh_token);
          }
          headers["Authorization"] = `Bearer ${data.access_token}`;
          res = await fetch(`${API_BASE}${path}`, { ...options, headers });
        }
      } catch {
        localStorage.removeItem("zyro-token");
        localStorage.removeItem("zyro-refresh-token");
        localStorage.removeItem("zyro-admin-token");
        localStorage.removeItem("zyro-admin-refresh-token");
      }
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, error.detail || "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string, token?: string | null) => request<T>(path, {}, token),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }, token),
  put: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }, token),
  delete: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "DELETE" }, token),
  upload: <T>(path: string, formData: FormData, token?: string | null) =>
    request<T>(path, { method: "POST", body: formData }, token),
};
