import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Announcement from '@material-ui/icons/Announcement';
import Schedule from '@material-ui/icons/Schedule';
import React from 'react';
import { Link as RouterLink, Route } from 'react-router-dom';
import Dashboard from '../Dashboard';
import AnnouncementsPage from './announcement/AnnouncementsPage';
import ShowAnnouncementPage from './announcement/ShowAnnouncementPage';
import CalendarPage from './calendar/CalendarPage';
import StudentChangePasswordPage from './change-password/StudentChangePasswordPage';
import StudentHomePage from './home/StudentHomePage';
import StudentMePage from './me/StudentMePage';
import ShowEmployeePage from './employee/EmployeesPage';
import {AccountBalance, Grade, People, Person, School} from "@material-ui/icons";
import ShowFacultiesPage from "./faculty/FacultiesPage";
import ShowFacultyPage from "./faculty/ShowFacultyPage";
import ShowSubjectPage from "./subject/ShowSubjectPage";
import MyStudiesPage from "./me/MyStudiesPage";
import GradesPage from "./grade/GradesPage";
import ShowGradePage from "./grade/ShowGradePage";

export default function StudentDashboard() {
  const menuItems = <React.Fragment>
      <ListItem button component={RouterLink} to="/student/mygroups">
          <ListItemIcon>
              <School />
          </ListItemIcon>
          <ListItemText primary="Moje studia" />
      </ListItem>
      <ListItem button component={RouterLink} to="/student/employees">
          <ListItemIcon>
              <People />
          </ListItemIcon>
          <ListItemText primary="Pracownicy" />
      </ListItem>
      <ListItem button component={RouterLink} to="/student/faculties">
          <ListItemIcon>
              <AccountBalance />
          </ListItemIcon>
          <ListItemText primary="Wydziały" />
      </ListItem>
    <ListItem button component={RouterLink} to="/student/calendar">
      <ListItemIcon>
        <Schedule />
      </ListItemIcon>
      <ListItemText primary="Kalendarz" />
    </ListItem>
    <ListItem button component={RouterLink} to="/student/announcements">
      <ListItemIcon>
        <Announcement />
      </ListItemIcon>
      <ListItemText primary="Ogłoszenia" />
    </ListItem>
      <ListItem button component={RouterLink} to="/student/grades">
          <ListItemIcon>
              <Grade />
          </ListItemIcon>
          <ListItemText primary="Oceny" />
      </ListItem>
  </React.Fragment>

  return (
    <Dashboard routePrefix="student" title="Panel Studenta" menuItems={menuItems}>
      <Route exact path="/student">
        <StudentHomePage />
      </Route>
      <Route exact path="/student/me">
        <StudentMePage />
      </Route>
       <Route exact path="/student/mygroups">
           <MyStudiesPage />
       </Route>
      <Route exact path="/student/calendar">
        <CalendarPage />
      </Route>
      <Route exact path="/student/announcements">
        <AnnouncementsPage />
      </Route>
      <Route exact path="/student/show-announcement/:announcementId">
        <ShowAnnouncementPage />
      </Route>
      <Route exact path="/student/change-password">
        <StudentChangePasswordPage />
      </Route>
        <Route exact path="/student/employees">
            <ShowEmployeePage />
        </Route>
        <Route exact path="/student/faculties">
            <ShowFacultiesPage/>
        </Route>
        <Route exact path="/student/show-faculty/:facultyId">
            <ShowFacultyPage />
        </Route>
        <Route exact path="/student/show-subject/:subjectId">
            <ShowSubjectPage />
        </Route>
        <Route exact path="/student/grades">
            <GradesPage />
        </Route>
        <Route exact path="/student/grades/:gradeId">
            <ShowGradePage />
        </Route>
    </Dashboard>
  );
}