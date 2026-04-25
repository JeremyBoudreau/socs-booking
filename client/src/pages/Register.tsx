import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

    // send first name, last name, email and password to server
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    // parse the response from the server (raw JSON text -> JavaScript object).
    const data = await res.json();

    // display the error returned by the server (if any)
    if (!res.ok) {
      setError(data.error || "Unexpected error. Sign up failed.");
      return;
    }

    // redirect user to login page
    navigate("/login");
  };

  return (
    <div className="user-page">
      <div className="user-container">
        <Navbar />

        <main className="user-main">
          <section className="user-left">
            <h1>
              Join <br />
              <span className="red-text">SOCS Connect</span> <br />
              today.
            </h1>

            <p className="user-subtext">
              Join SOCS Connect to book or host office hours, request meetings,
              and coordinate group schedules.
            </p>

            <h3 className="user-side-heading">TWO TYPES OF ACCOUNTS</h3>

            <div className="account-type-list">
              <div className="account-type-item">
                <span className="account-icon">🎓</span>
                <div>
                  <strong>Student</strong>
                  <p>Browse slots and book appointments</p>
                </div>
              </div>

              <div className="account-type-item">
                <span className="account-icon">🧑‍🏫</span>
                <div>
                  <strong>Professor / TA</strong>
                  <p>Create and manage office hours</p>
                </div>
              </div>
            </div>
          </section>

          <section className="user-right">
            <div className="user-right-inner">
              <h2>Create an Account</h2>

              <form className="user-form-card" onSubmit={handleSubmit}>
                <div className="name-row">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <input
                  type="email"
                  placeholder="you@mail.mcgill.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="role-section">
                  <p>I am registering as a...</p>

                  <div className="role-options">
                    <button
                      type="button"
                      className={`role-card ${role === "student" && "active"}`}
                      onClick={() => setRole("student")}
                    >
                      <strong>Student</strong>
                      <small>@mail.mcgill.ca</small>
                    </button>

                    <button
                      type="button"
                      className={`role-card ${role === "prof" && "active"}`}
                      onClick={() => setRole("prof")}
                    >
                      <strong>Professor / TA</strong>
                      <small>@mcgill.ca</small>
                    </button>
                  </div>
                </div>

                {error && <p className="form-error">{error}</p>}

                <button type="submit" className="user-submit-btn">
                  Sign Up
                </button>
              </form>

              <p className="user-switch-text">
                Already have an account?{" "}
                <Link to="/login" className="user-inline-link">
                  Sign In
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

export default Register;
