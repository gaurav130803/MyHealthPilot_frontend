import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import {
  FaUser,
  FaWeight,
  FaRulerVertical,
  FaBurn,
  FaTint,
  FaDumbbell,
  FaCompressArrowsAlt,
  FaRunning,
  FaHandshake,
  FaBullseye,
} from 'react-icons/fa';

import backgroundImage from '../images/background.jpg';


const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editedFields, setEditedFields] = useState({});
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      const username = localStorage.getItem('username');

      if (!token || !username) {
        toast.warn('Login required to access profile.');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { username },
        });

        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
        } else {
          toast.error('Failed to fetch profile.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading profile.');
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setEditedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/updateprofile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success('Profile updated successfully!');
        setEditedFields({});
        setEditingField(null);
      } else {
        toast.error(res.data.message || 'Update failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating profile.');
    }
  };

  const fields = [
    { label: 'Username', name: 'username', icon: <FaUser className="text-green-400 mr-2" /> },
    { label: 'Weight (kg)', name: 'weight', icon: <FaWeight className="text-green-400 mr-2" /> },
    { label: 'Height (cm)', name: 'height', icon: <FaRulerVertical className="text-green-400 mr-2" /> },
    { label: 'Calorie Goal', name: 'calorieGoal', icon: <FaBurn className="text-green-400 mr-2" /> },
    { label: 'Water Intake Goal (L)', name: 'waterIntakeGoal', icon: <FaTint className="text-green-400 mr-2" /> },
    { label: 'Weight Goal (kg)', name: 'weightGoal', icon: <FaBullseye className="text-green-400 mr-2" /> },
    { label: 'Arm Size (in)', name: 'armSize', icon: <FaDumbbell className="text-green-400 mr-2" /> },
    { label: 'Chest Size (in)', name: 'chestSize', icon: <FaCompressArrowsAlt className="text-green-400 mr-2" /> },
    { label: 'Quads Size (in)', name: 'quadsSize', icon: <FaRunning className="text-green-400 mr-2" /> },
    { label: 'Forearm Size (in)', name: 'forearmSize', icon: <FaHandshake className="text-green-400 mr-2" /> },

  ];

  return (
    <div
      className="min-h-screen bg-gray-950 text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-green-400 text-center mb-8">Profile</h2>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1 flex items-center">
                  {field.icon}
                  {field.label}
                </label>
                {editingField === field.name ? (
                  <input
                    type="text"
                    name={field.name}
                    value={profile[field.name] || ''}
                    onChange={handleChange}
                    onBlur={() => setEditingField(null)}
                    className="px-4 py-2 rounded bg-gray-800 border border-green-500 text-white focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span
                    className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer transition"
                    onClick={() => handleEditClick(field.name)}
                  >
                    {profile[field.name] || <span className="italic text-gray-500">Not set</span>}
                  </span>
                )}
              </div>
            ))}
          </div>

          {Object.keys(editedFields).length > 0 && (
            <div className="text-center pt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full text-white transition-all shadow-md"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
