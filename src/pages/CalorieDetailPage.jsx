import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CalorieProgressRing from '../components/CalorieProgressRing';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import DailyCaloriesBarChart from '../components/DailyCaloriesBarChart';

const APP_ID = 'c164bea0';
const APP_KEY = '689d98ae585534e8c545e374797c87f0';

const CalorieDetailPage = () => {
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [foodQuery, setFoodQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [calorieGoal, setCalorieGoal] = useState(null);

  const getTotal = (meal) =>
    meals[meal].reduce((sum, item) => sum + item.calories, 0);

  const openModal = (meal) => {
    setSelectedMeal(meal);
    setShowModal(true);
    setFoodQuery('');
    setSelectedFood(null);
    setQuantity(100);
  };

  const closeModal = () => {
    setShowModal(false);
    setFoodQuery('');
    setSelectedFood(null);
    setQuantity(100);
  };

  // 🔄 Fetch calorie goal from backend
  useEffect(() => {
    const fetchGoal = async () => {
      const token = localStorage.getItem('accessToken');
      const username = localStorage.getItem('username');

      if (!token || !username) {
        toast.error('User not logged in');
        return;
      }

      try {
        const res = await axios.get('https://myhealthpilot-backend.onrender.com/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username },
        });

        if (res.data.success && res.data.profile) {
          setCalorieGoal(res.data.profile.calorieGoal || 2000);
        } else {
          toast.error('Failed to load calorie goal');
        }
      } catch (err) {
        console.error('Error fetching calorie goal:', err);
        toast.error('Error fetching calorie goal');
      }
    };

    fetchGoal();
  }, []);

  // 🔄 Fetch meals when date changes
  useEffect(() => {
    const fetchMeals = async () => {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('accessToken');

      if (!username || !token) {
        toast.warn('You must be logged in to view meals.');
        return;
      }

      try {
        const res = await axios.get('https://myhealthpilot-backend.onrender.com/api/meals/getmeal', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username, date: selectedDate },
        });

        if (res.data.success && res.data.meals) {
          setMeals(res.data.meals);
        } else {
          setMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] });
        }
      } catch (err) {
        console.error('Error fetching meals:', err);
        toast.error('Failed to load meals from database.');
      }
    };

    fetchMeals();
  }, [selectedDate]);

  const handleSearch = async () => {
    if (!foodQuery.trim()) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.edamam.com/api/food-database/v2/parser`,
        {
          params: {
            ingr: foodQuery,
            app_id: APP_ID,
            app_key: APP_KEY,
          },
        }
      );

      const food = res.data.hints[0]?.food;

      if (food) {
        setSelectedFood(food);
      } else {
        toast.error('Food not found.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch food info.');
    } finally {
      setLoading(false);
    }
  };

  const addFoodWithQuantity = async () => {
    if (!selectedFood) return;

    const caloriesPer100g = selectedFood.nutrients.ENERC_KCAL || 0;
    const totalCalories = Math.round((caloriesPer100g * quantity) / 100);

    const newItem = {
      name: selectedFood.label,
      calories: totalCalories,
      quantity,
      unit: 'g',
    };

    const updatedMeals = {
      ...meals,
      [selectedMeal]: [...meals[selectedMeal], newItem],
    };

    setMeals(updatedMeals);
    closeModal();

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');

    if (!username || !token) {
      toast.warn('You must be logged in to save meals.');
      return;
    }

    try {
      const res = await axios.post(
        'https://myhealthpilot-backend.onrender.com/api/meals/addmeal',
        {
          username,
          date: selectedDate,
          meals: updatedMeals,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success('Meal saved successfully!');
      } else {
        toast.error(res.data.message || 'Failed to save meal.');
      }
    } catch (err) {
      console.error('API error:', err);
      toast.error('Error saving meal item.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2 text-green-400 text-center">
          Today's Calories
        </h1>

        <div className="text-center mb-6">
          <label className="mr-2">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-800 text-white px-3 py-1 rounded"
          />
        </div>

        {calorieGoal !== null && (
          <CalorieProgressRing date={selectedDate} goal={calorieGoal} className="mb-8" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
            <div key={meal} className="bg-gray-900 p-6 rounded shadow">
              <h2 className="text-xl font-semibold capitalize text-green-300 mb-2">
                {meal}
              </h2>
              <p className="text-sm text-gray-400 mb-2">
                Total: {getTotal(meal)} kcal
              </p>

              <ul className="mb-4">
                {meals[meal].map((item, idx) => (
                  <li key={idx} className="text-sm">
                    🍽 {item.name} — {item.calories} kcal ({item.quantity} {item.unit})
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openModal(meal)}
                className="text-sm bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
              >
                + Add Food
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <h3 className="text-xl mb-4 font-semibold text-green-400">
              Add Food to {selectedMeal}
            </h3>

            {!selectedFood ? (
              <>
                <input
                  type="text"
                  value={foodQuery}
                  onChange={(e) => setFoodQuery(e.target.value)}
                  placeholder="Enter food name"
                  className="w-full px-3 py-2 mb-4 rounded bg-gray-700 text-white focus:outline-none"
                />

                <div className="flex justify-between">
                  <button
                    onClick={closeModal}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-2">
                  Selected Food: <strong>{selectedFood.label}</strong>
                </p>
                <label className="block mb-4">
                  Quantity (grams):
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="ml-2 w-24 px-2 py-1 rounded bg-gray-700 text-white focus:outline-none"
                  />
                </label>

                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setSelectedFood(null);
                      setQuantity(100);
                    }}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={addFoodWithQuantity}
                    className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Add Food
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {calorieGoal !== null && <DailyCaloriesBarChart goal={calorieGoal} />}
    </div>
  );
};

export default CalorieDetailPage;
