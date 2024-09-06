import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        role,
      });

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You have been registered successfully.',
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || 'An error occurred during registration. Please try again.',
      });
      console.error('Registration error:', error.message);
    }
  };

  return (
    <div className="register-container card">
      <h1 style={{"fontSize":"2rem"}}>Register</h1>
      <form onSubmit={handleRegister}>
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <span className='register-span'><button type="submit" className='form-btn'>Register</button></span>
      </form>
    </div>
  );
};

export default Register;
