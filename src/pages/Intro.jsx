import React from 'react';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleGetStarted = () => {
    if (accessToken) {
      navigate('/calories');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="bg-gray-950 text-white">
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-green-500">
          Welcome to MyHealthPilot
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8">
          Take control of your fitness journey with MyHealthPilot. Track your progress, monitor health stats, and stay motivated every day.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 text-sm sm:text-base rounded font-semibold transition"
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Intro;
