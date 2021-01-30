import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import AdminDashboard from './ui/admin/AdminDashboard';
import LoginPage from './ui/auth/LoginPage';
import LogoutPage from './ui/auth/LogoutPage';
import Authorized from './ui/Authorized';
import EmployeeDashboard from './ui/employee/EmployeeDashboard';
import HomePage from './ui/HomePage';
import StudentDashboard from './ui/student/StudentDashboard';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/logout">
        <LogoutPage />
      </Route>
      <Route path="/admin">
        <Authorized role="Admin">
          <AdminDashboard />
        </Authorized>
      </Route>
      <Route path="/employee">
        <Authorized role="Employee">
          <EmployeeDashboard />
        </Authorized>
      </Route>
      <Route path="/student">
        <Authorized role="Student">
          <StudentDashboard />
        </Authorized>
      </Route>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
