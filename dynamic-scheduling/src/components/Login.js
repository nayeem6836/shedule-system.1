import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have been logged in successfully.',
      });

      localStorage.setItem('user', JSON.stringify(response.data));

      if (response.data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-availability');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.error || 'Invalid credentials. Please try again.',
      });
      console.error('Login error:', error.message);
    }
  };

  return (
    <div className="login-container card">
      <h1 style={{"fontSize":"2rem","textAlign":"center"}}>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input style={{"color":"black"}}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input style={{"color":"black"}}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <span className='login-span'><button type="submit" className='form-btn'>Login</button></span>
      </form>
      <div className="register-link">
        <p style={{"textAlign":"center"}}>New user? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};


export default Login;
