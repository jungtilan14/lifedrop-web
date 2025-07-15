import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import BloodRequest from './components/BloodRequest';
import DonorSearch from './components/DonorSearch';
import Dashboard from './components/Dashboard';
import Notifications from './components/Notifications';
import Awareness from './components/Awareness';
import Map from './components/Map';
import AdminPanel from './components/AdminPanel';
import DonationHistory from './components/DonationHistory';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/blood-request" element={<BloodRequest />} />
            <Route path="/donor-search" element={<DonorSearch />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/map" element={<Map />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/donation-history" element={<DonationHistory />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;