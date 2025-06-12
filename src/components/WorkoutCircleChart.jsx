import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const WorkoutCircleChart = ({ done = false }) => {
  // Data and color based on done status
  const data = [{ name: done ? 'Done' : 'Not Done', value: 100 }];
  const COLORS = [done ? '#22c55e' : '#ef4444']; // green or red

  return (
    <div className="bg-gray-900 text-white p-9 rounded-lg shadow-lg ">
      <h2 className="text-xl font-semibold mb-4 text-white text-center">
        Workout Today
      </h2>

      <div className="relative w-[250px] h-[250px]">
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            startAngle={90}
            endAngle={-270}
            innerRadius={70}
            outerRadius={90}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">
            {done ? 'Done' : 'Not Done'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCircleChart;
