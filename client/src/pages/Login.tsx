import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Login.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/dashboard";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // prevent page reload on form submit, and reset any previous error
    e.preventDefault();
    setError("");

    // send email and password to server
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // parse the response from the server (raw JSON text -> JavaScript object).
    const data = await res.json();

    // display the error returned by the server (if any)
    if (!res.ok) {
      setError(data.error || "Unexpected error. Sign in failed.");
      return;
    }

    // store JWT token
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate(from);
  };

  return (
    <div className="user-page">
      <div className="user-container">
        <Navbar />

        <main className="user-main">
          <section className="user-left">
            <h1>
              Welcome <br />
              back to <br />
              <span className="red-text">SOCS Connect.</span>
            </h1>

            <p className="user-subtext">
              Book or host office hours, request meetings, and manage
              appointments. All in one place.
            </p>
          </section>

          <section className="user-right">
            <div className="user-right-inner">
              <h2>Sign In</h2>

              <form className="user-form-card" onSubmit={handleSubmit}>
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@mail.mcgill.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <p className="user-input-note">
                  Only email addresses with the domain names @mail.mcgill.ca or
                  @mcgill.ca are valid.
                </p>

                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="form-error">{error}</p>}

                <button type="submit" className="user-submit-btn">
                  Sign In
                </button>
              </form>

              <p className="user-switch-text">
                No account yet?{" "}
                <Link to="/register" className="user-inline-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Login;
