import React from "react";

export const About = () => {
  return (
    <div className="my-5 py-5 rectangle base">
      <div className="container-fluid">
        <div className="row justify-content-evenly">
          <div className="col-sm-4 text-end">
            <h1 className="mission-headline pt-5">By Students,</h1>
            <h1 className="mission-headline">For Students.</h1>
          </div>
          <div className="col-sm-6">
            <p className="text-start" style={{ fontSize: "18px" }}>
              Today, learning a new langauge can feel generic and mundane.
              Everyone learns differently, and with most lanugage learning apps
              using the same cookie cutter formula, one student decided to
              create his own solution. Driven by the desire to inspire learners
              and offer them a new avenue for growth, Lengua was born - a
              refreshing alternative to the greyscale language learning space.
            </p>
            <p className="text-start pt-1" style={{ fontSize: "20px" }}>
              Welcome to a new era. Welcome, to Lengua
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
