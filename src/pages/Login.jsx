import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const Navigate = useNavigate();
  const handleSubmit = async(values) => {
    console.log('Login:', values);

    const response=await axios.post("https://myhealthpilot-backend.onrender.com/api/auth/login",values);
    if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem("accessToken", response.data.jwt_token);
                //localStorage.setItem("role", response.data.role);
                localStorage.setItem("username", response.data.username);
                setTimeout(() => Navigate("/"), 2000);
            }
           
                //toast.error(response.data.message);


    console.log(response);
    
  };

  const wrapperStyle = {
    marginLeft: '1.5rem',
    marginRight: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    
  };

  const elementStyle = {
    maxWidth: '350px',
    width: '100%',
  };

  const labelStyle = {
    marginLeft: '3rem',
    color: '#D1D5DB', // Tailwind text-gray-300
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Navbar />

      <div className="flex justify-center items-center py-16">
        <Form
          onFinish={handleSubmit}
          className="bg-gray-900 p-8 rounded-xl shadow-xl max-w-md w-full py-10"
          layout="vertical"
        >
          <h2 className="text-3xl font-extrabold mb-8 text-center text-green-400 tracking-wide">
            Login
          </h2>

          <Form.Item
            label={<span style={labelStyle} className="text-sm">Email</span>}
            name="email"
            rules={[
              {  message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <div style={wrapperStyle}>
              <Input
                style={elementStyle}
                className="px-4 py-3 rounded-lg bg-gray-800 text-sm text-white placeholder-gray-400
                           focus:outline-none focus:ring-4 focus:ring-green-500 transition duration-300"
                placeholder="Enter your email"
              />
            </div>
          </Form.Item>

          <Form.Item
            label={<span style={labelStyle} className="text-sm">Password</span>}
            name="password"
            rules={[{  message: 'Please enter your password' }]}
          >
            <div style={wrapperStyle}>
              <Input.Password
                style={elementStyle}
                className="px-4 py-3 rounded-lg bg-gray-800 text-sm text-white placeholder-gray-400
                           focus:outline-none focus:ring-4 focus:ring-green-500 transition duration-300"
                placeholder="Enter your password"
              />
            </div>
          </Form.Item>

          <Form.Item>
            <div style={wrapperStyle}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ ...elementStyle, paddingTop: '12px', paddingBottom: '12px' }}
                className="bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-sm shadow-md transition"
              >
                Login
              </Button>
            </div>
          </Form.Item>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 hover:underline">
              Register
            </Link>
          </p>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
