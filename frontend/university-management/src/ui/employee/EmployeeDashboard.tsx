import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Event, Group } from "@material-ui/icons";
import Announcement from '@material-ui/icons/Announcement';
import React from 'react';
import { Link, Link as RouterLink, Route } from 'react-router-dom';
import Dashboard from '../Dashboard';
import AddAnnouncementPage from './announcement/AddAnnouncementPage';
import AnnouncementsPage from './announcement/AnnouncementsPage';
import ShowAnnouncementPage from './announcement/ShowAnnouncementPage';
import EmployeeChangePasswordPage from './change-password/EmployeeChangePasswordPage';
import AddEventPage from './events/AddEventPage';
import EditEventPage from './events/EditEventPage';
import EventsPage from './events/EventsPage';
import AddGradeToGroupPage from "./group/AddGradeToGroupPage";
import ShowGroupPage from "./group/ShowGroupPage";
import EmployeeHomePage from './home/EmployeeHomePage';
import EmployeeMePage from './me/EmployeeMePage';
import GroupsPage from "./me/GroupsPage";
import EmployeesPage from "./user/employee/EmployeesPage";
import ShowEmployeePage from "./user/employee/ShowEmployeePage";
import GradesPage from "./grade/GradesPage";
import ShowGradePage from "./grade/ShowGradePage";
import EditGradePage from "./grade/EditGradePage";
import ShowStudentPage from "./user/student/ShowStudentPage";
import StudentsPage from "./user/student/StudentsPage";

export default function EmployeeDashboard() {
    const menuItems = <React.Fragment>
        <ListItem button component={Link} to="/employee/students">
            <ListItemIcon>
                <Group />
            </ListItemIcon>
            <ListItemText primary="Studenci" />
        </ListItem>
        <ListItem button component={Link} to="/employee/employees">
            <ListItemIcon>
                <Group />
            </ListItemIcon>
            <ListItemText primary="Pracownicy" />
        </ListItem>
        <ListItem button component={Link} to="/employee/groups">
            <ListItemIcon>
                <Group />
            </ListItemIcon>
            <ListItemText primary="Grupy" />
        </ListItem>
        <ListItem button component={RouterLink} to="/employee/announcements">
            <ListItemIcon>
                <Announcement />
            </ListItemIcon>
            <ListItemText primary="Ogłoszenia" />
        </ListItem>
        <List component="div" disablePadding>
            <ListItem button component={RouterLink} to="/employee/add-announcement">
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary="Dodaj ogłoszenie" />
            </ListItem>
        </List>
        <ListItem button component={Link} to="/employee/events">
            <ListItemIcon>
                <Event />
            </ListItemIcon>
            <ListItemText primary="Wydarzenia" />
        </ListItem>
    </React.Fragment>

    return (
        <Dashboard routePrefix="employee" title="Panel Pracownika" menuItems={menuItems}>
            <Route exact path="/employee/me">
                <EmployeeMePage />
            </Route>
            <Route exact path="/employee/change-password">
                <EmployeeChangePasswordPage />
            </Route>
            <Route exact path="/employee">
                <EmployeeHomePage />
            </Route>
            <Route exact path="/employee/announcements">
                <AnnouncementsPage />
            </Route>
            <Route exact path="/employee/show-announcement/:announcementId">
                <ShowAnnouncementPage />
            </Route>
            <Route exact path="/employee/add-announcement">
                <AddAnnouncementPage />
            </Route>
            <Route exact path="/employee/events">
                <EventsPage />
            </Route>
            <Route exact path="/employee/add-event">
                <AddEventPage />
            </Route>
            <Route exact path="/employee/events/:eventId/edit">
                <EditEventPage />
            </Route>
            <Route exact path="/employee/groups">
                <GroupsPage />
            </Route>
            <Route exact path="/employee/show-group/:groupId">
                <ShowGroupPage />
            </Route>
            <Route exact path="/employee/show-group/:groupId/:courseId/addGrade">
                <AddGradeToGroupPage />
            </Route>
            <Route exact path="/employee/show-student/:userId">
                <ShowStudentPage />
            </Route>
            <Route exact path="/employee/students">
                <StudentsPage />
            </Route>
            <Route exact path="/employee/employees">
                <EmployeesPage />
            </Route>
            <Route exact path="/employee/show-employee/:userId">
                <ShowEmployeePage />
            </Route>
            <Route exact path="/employee/show-group/:groupId/:courseId/grades">
                <GradesPage />
            </Route>
            <Route exact path="/employee/show-grade/gradeId/:gradeId/groupId/:groupId">
                <ShowGradePage />
            </Route>
            <Route exact path="/employee/edit-grade/:gradeId/groupId/:groupId/courseId/:courseId">
                <EditGradePage />
            </Route>
        </Dashboard>
    );
}
