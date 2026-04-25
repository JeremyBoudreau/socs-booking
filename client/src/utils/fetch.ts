// wrapper around fetch that attaches the JWT token to every request
// and redirects to /login if the token is expired or invalid (401)
export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  // get the token from localStorage
  const token = localStorage.getItem("token");

  // creates the complete headers object of the form:
  // { "Content-Type": "application/json",
  //   "Authorization": "Bearer <token>"
  //   ...other headers from options.headers if any
  // }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>), // spread existing headers if any
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // make the API request
  // options are the same as the ones passed to authFetch
  // and headers override any headers passed in options.headers
  const res = await fetch(url, { ...options, headers });

  // token is invalid or expired, log out the user and redirect to login page
  // checks if the response status is 401 (Unauthorized) because that's what's returned by the backend (see src/server/middleware/auth.ts)
  // when the token is invalid or expired
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return res;
}
