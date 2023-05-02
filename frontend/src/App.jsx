import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux'; // Import the Provider component from react-redux
import store from './app/store'; // Import your Redux store
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import NavbarHeader from './components/NavbarHeader';
import NavbarFooter from './components/NavbarFooter';

// Pages
import LandingPage from './components/Landing/LandingPage';
import HomePage from './components/Home/HomePage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import UndefinedPage from './components/UndefinedPage';
import CalendarPage from './components/Calendar/CalendarPage';
import TimecardPage from './components/Timecard/TimecardPage';
import ProfilePage from './components/Profile/ProfilePage';
import OnboardingPage from './components/Onboarding/OnboardingPage';
import VerifyEmailPage from './components/Auth/VerifyEmailPage'; // Import the VerifyEmailPage component

function App() {
  const { user } = useSelector((state) => state.auth); // Assuming you have a `user` state in your Redux store for user data

  return (
    <Router>
      <NavbarHeader isLoggedIn={user !== null}/>
      <ToastContainer />
      <Routes>
        <Route exact path="/" element={user ? <Navigate to="/home" replace /> : <LandingPage />} />
        <Route exact path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/profile"
          element={user && user.verified ? <ProfilePage /> : <Navigate to="/verify-email" />} 
        />
        <Route
          path="/calendar"
          element={user && user.verified ? <CalendarPage /> : <Navigate to="/verify-email" />} 
        />
        <Route
          path="/timecard"
          element={user && user.verified ? <TimecardPage /> : <Navigate to="/verify-email" />}
        />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/*" element={<UndefinedPage />} />
      </Routes>
      <NavbarFooter />
    </Router>
  );
}

// Wrap your App component with the Provider component and pass in the Redux store
const AppWithRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWithRedux;
