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
              <h3 className="grey">
                By taking advantage of effective language learning methods that
                other apps don't
              </h3>
            </div>
          </div>
          <div className="row mt-5 mb-3 py-4 features-card">
            <div className="col-sm-6">
              <h1 className="pt-5 text-start ps-4">Lyric Learner</h1>
              <p className="pt-3 text-start ps-4" style={{ fontSize: "17px" }}>
                Introducing our most groundbreaking and revolutionary learning
                technique yet, Lyric Learner. By taking advantage of auditory
                learning, this tool can help take your Spanish to the next
                level. Our intelligent evaluation system grades your translation
                accuracy and give valuble feedback. Test your lingustic ability
                and see just how close you come to capturing the essence of
                music.
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
              <p className="pt-3 text-start" style={{ fontSize: "17px" }}>
                It's one thing to know the vocab of a new language and a
                completely different thing to be able to form coherent
                sentences. With Free Write, you'll satisfy the latter and be
                speaking fluent Spanish faster than ever! Watch as timed,
                prompted free writes train your brain to start thinking like a
                native speaker.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
