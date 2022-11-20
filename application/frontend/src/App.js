import './App.css';

import React, { Component} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import NavbarHeader from './components/NavbarHeader';
import NavbarFooter from './components/NavbarFooter';

// Pages
import LandingPage from './pages/Landing/LandingPage';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/LoginPage';
import UndefinedPage from './pages/UndefinedPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import TimecardPage from './pages/Timecard/TimecardPage';
import ProfilePage from './pages/Profile/ProfilePage';

class App extends Component{
  render()
  {
    return (
      <div className="App">
        <React.Fragment>
          <Router>
            
            <Routes>
              <Route exact path="/" element={<LandingPage />} />*
              <Route path="/home" element={<HomePage />} />*
              <Route path="/login" element={<LoginPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/timecard" element={<TimecardPage />} />
              <Route element={<UndefinedPage />} />
            </Routes>
            <NavbarFooter />
          </Router>
        </React.Fragment>
      </div>
    )
  }
}

export default App;
