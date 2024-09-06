import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated to use useNavigate
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { 'x-auth-token': token },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users and availability:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    navigate('/'); // Redirect to login page using useNavigate
  };

  return (
    <div className="admin-dashboard-container">
      <h2 style={{ fontSize: '2rem', color: 'white' }}>Admin Dashboard</h2>
      <button onClick={handleLogout} className="logout-button1">Logout</button>
      <div className="user-list">
        <h3>Users and Availability</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index} className="user-item">
              <h4>{user.email}</h4>
              {user.availability && user.availability.length > 0 ? (
                <ul className="availability-list">
                  {user.availability.map((slot, idx) => (
                    <li key={idx} className="availability-item">
                      <div><strong>Start:</strong> {new Date(slot.start).toLocaleString()}</div>
                      <div><strong>End:</strong> {new Date(slot.end).toLocaleString()}</div>
                      <div><strong>Duration:</strong> {slot.duration} mins</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No availability set</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default AdminDashboard;
