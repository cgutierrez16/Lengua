import React from "react";
import image from "../images/green-tree.png";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="base">
      <div className="container">
        <div className="row justify-content-evenly">
          <div className="col-sm-6 text-start ps-5 py-5">
            <h1 className="pt-4 primary-font logo" style={{ fontSize: "80px" }}>
              Lengua!
            </h1>
            <h2 className="mt-3 grey" style={{ fontSize: "40px" }}>
              Learn like never before!
            </h2>
            <h2 style={{ fontSize: "35px" }} className="grey mt-2">
              Spanish that sticks
            </h2>
            <Link to="/about">
              <button className="home-btn primary mt-4">Learn More</button>
            </Link>
          </div>
          <div className="col-sm-5 text-center">
            <img src={image} alt="Tree" className="hero-image" />
          </div>
        </div>
      </div>
    </div>
  );
};
