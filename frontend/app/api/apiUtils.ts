const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost";
const API_BASE = `${API_HOST}:5050/api/v1`;

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        (headers as any).Authorization = `Token ${token}`;
    }

    const res = await fetch(`${API_BASE}${url}`, {...options, headers});

    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    // Handle empty responses (e.g., 204 No Content for DELETE)
    const contentType = res.headers.get("content-type");
    if (res.status === 204 || !contentType || !contentType.includes("application/json")) {
        return null;
    }

    return res.json();
}
