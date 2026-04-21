// wrapper around fetch that attaches the JWT token to every request
// and redirects to /login if the token is expired or invalid (401)
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // make the API request with the attached token in the Authorization header
  const res = await fetch(url, { ...options, headers });

  // token is invalid or expired, log out the user and redirect to login page
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return res;
}
