import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Landing: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  const featureCards = [
    {
      number: "1",
      title: "Reserve Office Hours",
      text: "Browse your professors' and TAs' posted slots and book a time that works for you instantly.",
    },
    {
      number: "2",
      title: "Request a meeting",
      text: "Send a meeting request directly to an owner. They review and confirm (no email chain needed).",
    },
    {
      number: "3",
      title: "Group Scheduling",
      text: "Coordinate with multiple people using a shared calendar view that finds the best time for everyone.",
    },
  ];

  return (
    <div className="page">
      <div className="page-container">
        <Navbar />

        <main>
          <section className="home-title">
            <div className="home-text">
              <h1>
                Book time
                <br />
                with your
                <br />
                <span className="red-text">professors</span> &amp;
                <br />
                TAs.
              </h1>

              <p>
                Reserve office hours, request meetings, manage appointments and
                coordinate group schedules. All in one place.
              </p>

              <div className="home-buttons">
                <Link to="/register">
                  <button>Get Started</button>
                </Link>
                <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                  <button>Browse Slots</button>
                </Link>
              </div>
            </div>

            <div className="home-image">
              <img
                src="/mcgill-building.jpg"
                alt="McGill campus building"
              />
            </div>
          </section>

          <section className="features-section">
            <h2>
              Everything you need to stay{" "}
              <span className="red-text">connected</span>
            </h2>

            <div className="features-grid">
              {featureCards.map((card) => (
                <div className="feature-card" key={card.number}>
                  <div className="feature-number">{card.number}</div>
                  <div className="feature-title">{card.title}</div>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Landing;