import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

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

    // redirect user to the dashboard
    navigate("/dashboard");
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
