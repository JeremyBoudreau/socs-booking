import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Landing: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("token");

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
                <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                  <button>Get Started</button>
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
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Landing;
