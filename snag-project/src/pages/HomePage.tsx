import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
/* import TestimonialSection from '../components/TestimonialSection'; */
import CallToAction from '../components/CallToAction';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      {/* <TestimonialSection /> */}
      <CallToAction />
    </>
  );
};

export default HomePage;
