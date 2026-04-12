import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

type Slot = {
  id: number;
  month: string;
  day: string;
  name: string;
  course: string;
  time: string;
  type: string;
  status: string;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const todaySlots: Slot[] = [
    {
      id: 1,
      month: "APR",
      day: "11",
      name: "Prof. Vybihal",
      course: "COMP 307",
      time: "10:00 AM",
      type: "Office Hours",
      status: "Open",
    },
    {
      id: 2,
      month: "APR",
      day: "11",
      name: "TA Sarah A.",
      course: "COMP 307",
      time: "3:00 PM",
      type: "Lab Help",
      status: "Open",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <div className="user-page">
      <div className="user-container">
        <header className="user-navbar">
          <div className="user-navbar-left">
            <img
              src="/mcgill-logo.png"
              alt="McGill logo"
              className="user-navbar-logo"
            />
            <span className="user-navbar-title">| SOCS Connect</span>
          </div>

          <nav className="user-navbar-links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </header>

        <main className="user-main">
          {/* LEFT */}
          <section className="user-left">
            <h1>
              Welcome <br />
              back to <br />
              <span className="red-text">SOCS Connect.</span>
            </h1>

            <p className="user-subtext">
              Log in to manage your schedule
            </p>

            <h3 className="user-side-heading">AVAILABLE TODAY</h3>

            <div className="slot-list">
              {todaySlots.map((slot) => (
                <div className="slot-card" key={slot.id}>
                  <div className="slot-date">
                    <span className="slot-month">{slot.month}</span>
                    <span className="slot-day">{slot.day}</span>
                  </div>

                  <div className="slot-info">
                    <div className="slot-name-course">
                      {slot.name} · {slot.course}
                    </div>
                    <div className="slot-time-type">
                      {slot.time} · {slot.type}
                    </div>
                  </div>

                  <div className="slot-status open">{slot.status}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="user-right">
            <div className="user-right-inner">
              <p className="user-label-top">SIGN IN</p>
              <h2>Log into your account</h2>

              <p className="user-switch-text">
                No account yet?{" "}
                <Link to="/register" className="user-inline-link">
                  Register here →
                </Link>
              </p>

              <form className="user-form-card" onSubmit={handleSubmit}>
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@mail.mcgill.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <p className="user-input-note">
                  @mail.mcgill.ca or @mcgill.ca only
                </p>

                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <p className="forgot-password">Forgot password?</p>

                <button type="submit" className="user-submit-btn">
                  Log in →
                </button>
              </form>

              <p className="user-footer-note">
                McGill accounts only — no external email addresses.
              </p>
            </div>
          </section>
        </main>

        <footer className="user-footer">
          © 2026 McGill University · School of Computer Science
        </footer>
      </div>
    </div>
  );
};

export default Login;