import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Intro from "./pages/Intro";
import CalorieCircleChart from "./components/CalorieProgressRing";
import WaterChart from "./components/WaterChart";
import WorkoutCircleChart from "./components/WorkoutCircleChart";
import { Link } from "react-router-dom";
import axios from "axios";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";

function App() {
  const today = new Date().toISOString().split("T")[0];
  const [workoutDone, setWorkoutDone] = useState(false);

  useEffect(() => {
    const fetchWorkoutStatus = async () => {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("accessToken");

      if (!username || !token) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/workout/history/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const todayWorkout = res.data.workouts.find(
          (w) => w.date === today
        );
        setWorkoutDone(!!todayWorkout);
      } catch (err) {
        console.error("Failed to fetch workout status", err);
      }
    };

    fetchWorkoutStatus();
  }, [today]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Intro />

      {/* Chart section with responsive layout */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 px-8 md:px-20 w-full max-w-6xl mx-auto">
        <Link to="/calories">
          <CalorieCircleChart date={today} />
        </Link>
        <WaterChart consumed={2} goal={3} />
        <Link to='/workout'>
        <WorkoutCircleChart done={workoutDone} />
        </Link>
      </div>
      <Contact/>
      <Footer/>
    </div>
  );
}

export default App;
