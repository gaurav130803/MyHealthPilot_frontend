import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { Modal, Button } from 'antd';
import { toast } from 'react-toastify';

const WaterChart = () => {
  const [consumed, setConsumed] = useState(0);
  const goal = 3;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchWaterIntake = async () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');
    const date = new Date().toISOString().split('T')[0];

    try {
      const res = await axios.get('https://myhealthpilot-backend.onrender.com/api/water/get', {
        headers: { Authorization: `Bearer ${token}` },
        params: { username, date },
      });
      if (res.data.success) {
        setConsumed(res.data.amount);
      }
    } catch (err) {
      toast.error('Failed to fetch water intake');
    }
  };

  const addWater = async (ml) => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');
    const date = new Date().toISOString().split('T')[0];
    const amount = ml / 1000; // convert to liters

    try {
      const res = await axios.post('https://myhealthpilot-backend.onrender.com/api/water/log', {
        username,
        date,
        amount,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setConsumed(res.data.entry.amount);
        toast.success(`Added ${ml}ml`);
      }
    } catch (err) {
      toast.error('Failed to log water');
    }

    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchWaterIntake();
  }, []);

  const percent = Math.min((consumed / goal) * 100, 100);
  const data = [
    { name: 'Consumed', value: percent },
    { name: 'Remaining', value: 100 - percent },
  ];
  const COLORS = ['#3b82f6', '#1e40af'];

  return (
    <div className=" mt-4 bg-gray-900 text-white p-7 rounded-lg shadow-lg mb-5 text-center cursor-pointer" onClick={() => setIsModalVisible(true)}>
      <h2 className="text-2xl font-semibold text-blue-400 mb-6">Water Intake</h2>

      <div className="relative w-[250px] h-[250px] mx-auto">
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
          <span className="text-4xl font-bold text-blue-400">{consumed.toFixed(2)}</span>
          <span className="text-sm text-gray-400">/ {goal} liters</span>
        </div>
      </div>

      <Modal
        title="Add Water Intake"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="flex flex-wrap gap-4 justify-center">
          {[250, 500, 750, 1000].map((ml) => (
            <Button key={ml} type="primary" onClick={() => addWater(ml)}>
              +{ml} ml
            </Button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default WaterChart;
