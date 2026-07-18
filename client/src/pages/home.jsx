import React from "react";
import { Link } from "react-router-dom";
import image from "../images/green-tree.png";
import temp1 from "../images/features-temp-1.png";
import temp2 from "../images/features-temp-2.png";
import "../styles/home.css";

export const Home = () => {
  return (
    <div className="home-page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">Lengua!</h1>
          <h2 className="hero-subtitle">Learn like never before!</h2>
          <h2 className="hero-tagline">Spanish that sticks</h2>
          <Link to="/about">
            <button className="home-btn">Learn More</button>
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <img src={image} alt="Tree" className="hero-image" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-header">
          <h1 className="features-title">Lengua Seperates Itself.</h1>
          <h3 className="features-subtitle">
            By taking advantage of effective language learning methods that other apps don't
          </h3>
        </div>

        <div className="feature-card">
          <div className="feature-card-text">
            <h1>Lyric Learner</h1>
            <p>
              Introducing our most groundbreaking and revolutionary learning
              technique yet, Lyric Learner. By taking advantage of auditory
              learning, this tool can help take your Spanish to the next level.
              Our intelligent evaluation system grades your translation accuracy
              and gives valuable feedback. Test your linguistic ability and see
              just how close you come to capturing the essence of music.
            </p>
          </div>
          <div className="feature-card-image">
            <img src={temp2} alt="Lyric Learner preview" className="features-img" />
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-card-image">
            <img src={temp1} alt="Free Write preview" className="features-img" />
          </div>
          <div className="feature-card-text">
            <h1>Free Write</h1>
            <p>
              It's one thing to know the vocab of a new language and a
              completely different thing to be able to form coherent sentences.
              With Free Write, you'll satisfy the latter and be speaking fluent
              Spanish faster than ever! Watch as timed, prompted free writes
              train your brain to start thinking like a native speaker.
            </p>
          </div>
        </div>
        
      </section>

      {/* About */}
      <section className="about">
        <div className="about-headline">
          <h1>By Students,</h1>
          <h1>For Students.</h1>
        </div>
        <div className="about-text">
          <p>
            Today, learning a new language can feel generic and mundane.
            Everyone learns differently, and with most language learning apps
            using the same cookie cutter formula, one student decided to create
            his own solution. Driven by the desire to inspire learners and offer
            them a new avenue for growth, Lengua was born - a refreshing
            alternative to the greyscale language learning space.
          </p>
          <p className="about-welcome">
            Welcome to a new era. Welcome, to Lengua
          </p>
        </div>
      </section>

    </div>
  );
};