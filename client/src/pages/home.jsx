import React from "react";
import { Hero } from '../components/hero'
import { Features } from '../components/features'
import { About } from '../components/about'

export const Home = () => {
  return (
    <div className="base">
      <Hero />
      <Features />
      <About />
    </div>
  );
};
