import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import Register from './components/Register';
import axios from 'axios';
import Swal from 'sweetalert2';

//import UserAvailability from './components/UserAvailability';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-availability" element={<UserAvailability />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};



const UserAvailability = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [availability, setAvailability] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the index of the slot being edited
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailability = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const email = user?.email;

      try {
        const response = await axios.get(`http://localhost:5000/api/availability/${email}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAvailability(response.data);
      } catch (error) {
        console.error('Error fetching availability:', error.message);
      }
    };

    fetchAvailability();
  }, []);

  const handleAddOrUpdateSlot = async (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email;

    try {
      if (editIndex !== null) {
        // Update existing slot
        const response = await axios.put(`http://localhost:5000/api/availability/update/${availability[editIndex]._id}`, {
          user: email,
          start: startTime,
          end: endTime,
          duration,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAvailability(availability.map((slot, index) => (index === editIndex ? response.data : slot)));
        setEditIndex(null); // Reset the editIndex after updating
      } else {
        // Add new slot
        const response = await axios.post('http://localhost:5000/api/availability/add', {
          user: email,
          start: startTime,
          end: endTime,
          duration,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAvailability([...availability, response.data]);
      }

      setStartTime('');
      setEndTime('');
      setDuration('');
      Swal.fire({
        icon: 'success',
        title: editIndex !== null ? 'Slot Updated' : 'Slot Added',
        text: editIndex !== null ? 'Your time slot has been successfully updated.' : 'Your time slot has been successfully added.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Save Slot',
        text: error.response?.data?.error || 'An error occurred while saving the time slot.',
      });
      console.error('Save slot error:', error.message);
    }
  };

  const handleEditSlot = (index) => {
    const slot = availability[index];
    setStartTime(new Date(slot.start).toISOString().slice(0, 16)); // Convert to input format
    setEndTime(new Date(slot.end).toISOString().slice(0, 16)); // Convert to input format
    setDuration(slot.duration);
    setEditIndex(index);
  };

  const handleDeleteSlot = async (index) => {
    const slotId = availability[index]._id;

    try {
      await axios.delete(`http://localhost:5000/api/availability/delete/${slotId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAvailability(availability.filter((_, i) => i !== index));
      Swal.fire({
        icon: 'success',
        title: 'Slot Deleted',
        text: 'Your time slot has been successfully deleted.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Delete Slot',
        text: error.response?.data?.error || 'An error occurred while deleting the time slot.',
      });
      console.error('Delete slot error:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    
    <div className="availability-container">
      <h1>Your Availability</h1>
      <form onSubmit={handleAddOrUpdateSlot}>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? 'Update Time Slot' : 'Add Time Slot'}</button>
      </form>
      <h2>Current Availability</h2>
      <ul className="availability-list">
        {availability.map((slot, index) => (
          <li key={index}>
            {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleString()} ({slot.duration} mins)
            <span className='edit-span'><button className='edit-btn' onClick={() => handleEditSlot(index)}><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button></span>
            <button className='delete-btn' onClick={() => handleDeleteSlot(index)}><i class="fa fa-trash" aria-hidden="true"></i></button>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};




export default App;
