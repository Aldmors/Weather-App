let token: string | null = null;

function getToken() {
  if (token) {
    return token;
  }
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    return token;
  }

  return null;
}

function setToken(newToken: string) {
  token = newToken;
  if (typeof window !== "undefined") {
    localStorage.setItem("token", newToken);
  }
}

function clearToken() {
  token = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const authToken = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (authToken) {
    (headers as any).Authorization = `Token ${authToken}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  return res.json();
}


// POST /v1/accounts/change-password/
export async function changePassword(data: any) {
  return fetchWithAuth("http://localhost:5050/api/v1/accounts/change-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// POST /v1/accounts/login/
export async function login(data: any) {
  const res = await fetch("http://localhost:5050/api/v1/accounts/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to login");
  }
  const responseData = await res.json();
  if (responseData.token) {
    setToken(responseData.token);
  }
  return responseData;
}

// POST /v1/accounts/logout/
export async function logout(data: any) {
  const res = await fetchWithAuth("http://localhost:5050/api/v1/accounts/logout/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  clearToken();
  return res;
}

// GET /v1/accounts/profile/
export async function getProfile() {
  return fetchWithAuth("http://localhost:5050/api/v1/accounts/profile/");
}

// POST /v1/accounts/profile/
export async function createProfile(data: any) {
  return fetchWithAuth("http://localhost:5050/api/v1/accounts/profile/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /v1/accounts/profile/
export async function updateProfile(data: any) {
  return fetchWithAuth("http://localhost:5050/api/v1/accounts/profile/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// PATCH /v1/accounts/profile/
export async function patchProfile(data: any) {
  return fetchWithAuth("http://localhost:5050/api/v1/accounts/profile/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// POST /v1/accounts/register-email/
export async function registerEmail(data: any) {
  return fetchWithAuth("http://localhost:5050/api/v1/accounts/register-email/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// POST /v1/accounts/register/
export async function register(data: any) {
  return fetchWithAuth("http://localhost:5050/api/v1/accounts/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// POST /v1/accounts/reset-password/
export async function resetPassword(data: any) {
  return fetchWithAuth("http://localhost:5050/api/v1/accounts/reset-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// POST /v1/accounts/send-reset-password-link/
export async function sendResetPasswordLink(data: any) {
  return fetchWithAuth("http://localhost:5050/api/v1/accounts/send-reset-password-link/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
