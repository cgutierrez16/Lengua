import React from "react";
import temp1 from "../images/features-temp-1.png";
import temp2 from "../images/features-temp-2.png";

export const Features = () => {
  return (
    <div className="base">
      <div className="container my-5">
        <div className="row">
          <div className="col text-center">
            <h1 className="primary-font logo" style={{ fontSize: "60px" }}>
              Lengua Seperates Itself.
            </h1>
          </div>
          <div className="row my-4">
            <div className="col text-center">
              <h3>
                insert some shit about how goated this is and how nothing comes
                close
              </h3>
            </div>
          </div>
          <div className="row mt-5 mb-3 py-4 features-card">
            <div className="col-sm-6">
              <h1 className="pt-5 text-start ps-4">Lyric Learner</h1>
              <p className="pt-3 text-start ps-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                unde veniam sit, sequi aliquid ad officiis a autem est
                voluptatum accusamus aliquam aspernatur sed modi consectetur
                impedit dolor deserunt dolorum.
              </p>
            </div>
            <div className="col-sm-6 justify-content-center d-flex">
              <img
                src={temp2}
                alt="temp 2"
                className="features-img text-center"
              />
            </div>
          </div>
          <div className="row my-4 py-4 features-card">
            <div className="col-sm-6 justify-content-center d-flex">
              <img
                src={temp1}
                alt="temp"
                className="features-img text-center"
              />
            </div>
            <div className="col-sm-6">
              <h1 className="pt-5 text-start">Free Write</h1>
              <p className="pt-3 text-start">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
                repudiandae odit soluta perspiciatis quo eius expedita a quidem
                dignissimos! In eius esse et ipsum, accusamus possimus nulla
                adipisci aliquid mollitia?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
