import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import backgroundImage from '../images/background.jpg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WorkoutLogger = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState([{ weight: '', reps: '' }]);
  const [loggedExercises, setLoggedExercises] = useState([]);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const navigate = useNavigate();

  const fetchExercises = async (searchText) => {
    try {
      const res = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/name/${searchText}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.X-RapidAPI-Key,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        }
      );
      setResults(res.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching exercises', err);
      toast.error('Failed to fetch exercises');
    }
  };

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index][field] = value;
    setSets(updatedSets);
  };

  const addSet = () => {
    setSets([...sets, { weight: '', reps: '' }]);
  };

  const handleAddExercise = () => {
    if (!selectedExercise) return;
    setLoggedExercises([
      ...loggedExercises,
      {
        name: selectedExercise.name,
        gifUrl: selectedExercise.gifUrl,
        target: selectedExercise.target,
        equipment: selectedExercise.equipment,
        bodyPart: selectedExercise.bodyPart,
        sets,
      },
    ]);
    toast.success('Exercise added!');
    setSelectedExercise(null);
    setQuery('');
    setResults([]);
    setSets([{ weight: '', reps: '' }]);
  };

  const handleSubmitWorkout = async () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');
    const date = new Date().toISOString().split('T')[0];

    if (!workoutTitle || loggedExercises.length === 0) {
      toast.error('Please provide a title and at least one exercise.');
      return;
    }

    try {
      await axios.post(
        'https://myhealthpilot-backend.onrender.com/api/workout/log',
        {
          username,
          title: workoutTitle,
          exercises: loggedExercises,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Workout saved!');
      setWorkoutTitle('');
      setLoggedExercises([]);
      fetchTodaysWorkout();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save workout');
    }
  };

  const fetchTodaysWorkout = async () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');
    const today = new Date().toISOString().split('T')[0];

    try {
      const res = await axios.get(`https://myhealthpilot-backend.onrender.com/api/workout/history/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const todayWorkout = res.data.workouts.find((w) => w.date === today);
        setTodaysWorkout(todayWorkout || null);
      } else {
        console.error('Error fetching workout history');
      }
    } catch (err) {
      console.error("Error fetching today's workout", err);
    }
  };

  useEffect(() => {
    fetchTodaysWorkout();
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-950 text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Navbar />

      {/* Fixed Workout History Button */}
      <div className="fixed top-20 right-4 z-50 group flex flex-col items-end">
        <button
          onClick={() => navigate('/workout-history')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg transition duration-300 ease-in-out"
        >
          📜
        </button>
        <div className="mt-1 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Workout History
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold mb-8 text-center text-green-400">💪 Log Your Workout</h2>

        {/* Today's Workout */}
        {todaysWorkout && (
          <div className="bg-gray-900 border border-green-600 p-6 rounded mb-10 shadow-md">
            <h3 className="text-2xl text-yellow-400 font-bold mb-2">🔥 Today’s Workout</h3>
            <p className="text-gray-400 mb-4">📅 {todaysWorkout.date}</p>
            <h4 className="text-xl text-green-300 mb-3">{todaysWorkout.title}</h4>
            {todaysWorkout.exercises.map((ex, i) => (
              <div key={i} className="mb-4">
                <p className="text-white font-semibold capitalize">{ex.name}</p>
                {ex.sets.map((set, idx) => (
                  <p key={idx} className="text-sm text-gray-300 ml-4">
                    Set {idx + 1}: {set.weight} kg × {set.reps} reps
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Workout Input Fields */}
        <input
          type="text"
          placeholder="Workout Title (e.g. Push Day)"
          className="px-4 py-2 rounded bg-gray-800 text-white w-full mb-6"
          value={workoutTitle}
          onChange={(e) => setWorkoutTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search Exercise..."
          className="px-4 py-2 rounded bg-gray-800 text-white w-full"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length > 1) fetchExercises(e.target.value);
          }}
        />

        {results.length > 0 && !selectedExercise && (
          <ul className="bg-gray-800 rounded p-4 mb-6 mt-2">
            {results.map((ex, index) => (
              <li
                key={index}
                className="cursor-pointer hover:bg-blue-700 p-2 rounded capitalize transition duration-200"
                onClick={() => {
                  setSelectedExercise(ex);
                  setResults([]);
                }}
              >
                {ex.name}
              </li>
            ))}
          </ul>
        )}

        {/* Selected Exercise Display */}
        {selectedExercise && (
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-green-300 mb-4 capitalize">{selectedExercise.name}</h3>
            <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
              <img
                src={selectedExercise.gifUrl}
                alt={selectedExercise.name}
                className="w-64 h-64 rounded border border-gray-700 shadow-lg"
              />
              <div className="text-gray-400 text-sm space-y-2">
                <p><strong>Target:</strong> {selectedExercise.target}</p>
                <p><strong>Body Part:</strong> {selectedExercise.bodyPart}</p>
                <p><strong>Equipment:</strong> {selectedExercise.equipment}</p>
              </div>
            </div>

            {sets.map((set, idx) => (
              <div key={idx} className="flex gap-4 mb-3 items-center">
                <span className="text-gray-400">Set {idx + 1}</span>
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  className="px-3 py-2 rounded bg-gray-800 text-white w-32"
                  value={set.weight}
                  onChange={(e) => handleSetChange(idx, 'weight', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  className="px-3 py-2 rounded bg-gray-800 text-white w-24"
                  value={set.reps}
                  onChange={(e) => handleSetChange(idx, 'reps', e.target.value)}
                />
              </div>
            ))}

            <button
              onClick={addSet}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded mb-4 mt-2"
            >
              ➕ Add Set
            </button>
            <br />
            <button
              onClick={handleAddExercise}
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded transition"
            >
              ✅ Add Exercise
            </button>
          </div>
        )}

        {/* Review and Submit */}
        {loggedExercises.length > 0 && (
          <div className="bg-gray-900 border border-blue-500 p-6 rounded mt-10 shadow-md">
            <h3 className="text-2xl text-white font-bold mb-4">📝 Review Exercises</h3>
            {loggedExercises.map((ex, i) => (
              <div key={i} className="mb-6">
                <h4 className="text-lg text-green-300 font-semibold capitalize mb-2">{ex.name}</h4>
                {ex.sets.map((s, idx) => (
                  <p key={idx} className="text-sm text-gray-300">
                    Set {idx + 1}: {s.weight} kg x {s.reps} reps
                  </p>
                ))}
              </div>
            ))}
            <button
              onClick={handleSubmitWorkout}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white mt-4"
            >
              💾 Submit Full Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutLogger;
