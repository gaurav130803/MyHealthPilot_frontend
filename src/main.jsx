import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CalorieDetailPage from './pages/CalorieDetailPage.jsx';
import Profile from './pages/Profile.jsx';
import WorkoutLogger from './pages/WorkoutLogger.jsx';
import WorkoutHistory from './pages/WorkoutHistory.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/calories" element={<CalorieDetailPage/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/workout' element={<WorkoutLogger/>}/>
      <Route path='workout-history' element={<WorkoutHistory/>}/>
  </Routes>
  </BrowserRouter>
)
