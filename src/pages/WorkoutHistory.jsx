import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FaTimes, FaTrash, FaEdit, FaSave } from 'react-icons/fa';

const WorkoutHistory = () => {
  const [history, setHistory] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState(null);

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!username || !token) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/workout/history/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setHistory(res.data.workouts);
      } catch (err) {
        console.error('Error fetching workout history', err);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (workoutId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/workout/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setHistory(history.filter((w) => w._id !== workoutId));
        setSelectedWorkout(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEditClick = (e, workout) => {
    e.stopPropagation();
    setEditMode(true);
    setEditedWorkout(JSON.parse(JSON.stringify(workout))); // deep copy
    setSelectedWorkout(workout);
  };

  const handleInputChange = (exIndex, setIndex, field, value) => {
    const updated = { ...editedWorkout };
    updated.exercises[exIndex].sets[setIndex][field] = value;
    setEditedWorkout(updated);
  };

  const saveEditedWorkout = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/workout/${username}/${editedWorkout._id}`,
        editedWorkout,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setHistory((prev) =>
          prev.map((w) => (w._id === editedWorkout._id ? editedWorkout : w))
        );
        setEditMode(false);
        setSelectedWorkout(null);
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white  ">
      <Navbar />
      <h2 className="text-3xl font-bold text-center py-5 text-green-400 mb-8">Workout History</h2>

      {history.length === 0 ? (
        <p className="text-gray-400">No workouts logged yet.</p>
      ) : (
        <div className="space-y-6">
          {history.map((workout) => (
            <div
              key={workout._id}
              className="bg-gray-800 p-5 rounded shadow hover:bg-gray-700 cursor-pointer transition-all"
              onClick={() => setSelectedWorkout(workout)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-green-300">{workout.title}</h3>
                  <p className="text-gray-400 text-sm">📅 {workout.date}</p>
                </div>
                <div className="flex gap-3 text-sm text-white opacity-60">
                  <button
                    className="hover:text-yellow-400"
                    onClick={(e) => handleEditClick(e, workout)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(workout._id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => {
                setSelectedWorkout(null);
                setEditMode(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>

            <h3 className="text-2xl text-green-400 font-bold mb-2">
              {editMode ? editedWorkout?.title : selectedWorkout.title}
            </h3>
            <p className="text-gray-400 mb-4">📅 {selectedWorkout.date}</p>

            {(editMode ? editedWorkout : selectedWorkout)?.exercises.map((ex, exIndex) => (
              <div key={exIndex} className="mb-4">
                <h4 className="text-lg font-semibold text-white capitalize">{ex.name}</h4>
                {ex.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex gap-2 items-center ml-4">
                    {editMode ? (
                      <>
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) =>
                            handleInputChange(exIndex, setIndex, 'weight', e.target.value)
                          }
                          className="bg-gray-700 text-white px-2 py-1 rounded w-20"
                        />
                        <span className="text-sm">kg ×</span>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) =>
                            handleInputChange(exIndex, setIndex, 'reps', e.target.value)
                          }
                          className="bg-gray-700 text-white px-2 py-1 rounded w-20"
                        />
                        <span className="text-sm">reps</span>
                      </>
                    ) : (
                      <p className="text-sm text-gray-300">
                        Set {setIndex + 1}: {set.weight} kg × {set.reps} reps
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {editMode ? (
              <button
                onClick={saveEditedWorkout}
                className="mt-6 bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full flex items-center justify-center gap-2"
              >
                <FaSave /> Save Changes
              </button>
            ) : (
              <button
                onClick={() => setSelectedWorkout(null)}
                className="mt-6 bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
