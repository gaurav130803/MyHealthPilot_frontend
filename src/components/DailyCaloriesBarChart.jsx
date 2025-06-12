// src/components/DailyCaloriesBarChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

const DailyCaloriesBarChart = ({ goal = 3000 }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCalories = async () => {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('accessToken');

      if (!username || !token) {
        toast.warn('You must be logged in to see history.');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/meals/gethistory', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username },
        });

        if (res.data.success && res.data.history) {
          const formatted = res.data.history.map((entry) => {
            const total = Object.values(entry.meals).flat().reduce((sum, i) => sum + (i.calories || 0), 0);
            return {
              date: entry.date.split('-').slice(1).join('/'), // e.g. MM/DD
              calories: total,
              percent: (total / goal) * 100,
            };
          });
          setData(formatted);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch calorie history.');
      }
    };

    fetchCalories();
  }, [goal]);

  const getColor = (percent) => {
    if (percent < 70) return '#f87171'; // red-400
    if (percent < 90) return '#facc15'; // yellow-400
    return '#22c55e'; // green-500
  };

  return (
    <div className=" rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-xl text-green-400 font-semibold mb-4 text-center">Weekly Calorie Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="calories">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.percent)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyCaloriesBarChart;
