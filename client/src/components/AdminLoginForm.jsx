import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Add this

const AdminLoginForm = ({ onClose }) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const navigate = useNavigate(); // <-- Add this

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin/login', {
        email: adminEmail,
        password: adminPassword,
      });

      localStorage.setItem('adminToken', response.data.token);
      alert('✅ Admin logged in successfully');
      navigate('/admin/dashboard'); // <-- Add this
      if (onClose) onClose();
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleAdminLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-2 border rounded"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />
        {adminError && <p className="text-red-600">{adminError}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
};

export default AdminLoginForm;
