import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Home from './pages/Home.jsx'; // Home moved under pages
import AdminDashboard from './pages/AdminDashboard.jsx'; // Dashboard also under pages
import AdminLoginForm from './components/AdminLoginForm.jsx'; // Still a component
import SingleNewsPage from './pages/SingleNewsPage.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLoginForm />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route path="/news/:id" element={<SingleNewsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
