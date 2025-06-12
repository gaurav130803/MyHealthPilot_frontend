import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const CalorieProgressRing = ({ date }) => {
  const [consumed, setConsumed] = useState(0);
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('accessToken');

      if (!username || !token) {
        toast.error('User not logged in');
        return;
      }

      try {
        // ✅ Fetch Calorie Goal
        const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username },
        });

        if (profileRes.data.success && profileRes.data.profile) {
          const userGoal = profileRes.data.profile.calorieGoal || 2000;
          setGoal(userGoal);
          console.log('Calorie Goal:', userGoal);
        } else {
          toast.error('Failed to fetch calorie goal');
        }

        // ✅ Fetch Meals
        const mealRes = await axios.get('http://localhost:5000/api/meals/getmeal', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username, date },
        });

        if (mealRes.data.success && mealRes.data.meals) {
          const totalCalories = Object.values(mealRes.data.meals)
            .flat()
            .reduce((sum, item) => sum + (item.calories || 0), 0);
          setConsumed(totalCalories);
          console.log('Calories Consumed:', totalCalories);
        } else {
          setConsumed(0);
          console.log('No meals found for selected date');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load calorie data');
      }
    };

    if (date) fetchData();
  }, [date]);

  const percent = goal ? Math.min((consumed / goal) * 100, 100) : 0;
  const data = [
    { name: 'Consumed', value: percent },
    { name: 'Remaining', value: 100 - percent },
  ];
  const COLORS = ['#22c55e', '#1f2937'];

  return (
    <div className="mt-3 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-5 text-center">
        <h2 className="text-2xl font-semibold text-green-400 mb-4">
          Calorie Goal Progress
        </h2>

        <div className="relative w-[250px] h-[250px]">
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              startAngle={90}
              endAngle={-270}
              innerRadius={80}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-green-500">
              {consumed || 0}
            </span>
            <span className="text-sm text-gray-400">
              / {goal || '...'} kcal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieProgressRing;
