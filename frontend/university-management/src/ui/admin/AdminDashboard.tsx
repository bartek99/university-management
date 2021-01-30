import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { AccountBalance, Announcement, Business, Comment, DateRange, Event, EventSeat, Grade, Group, MeetingRoom, School, Subject } from '@material-ui/icons';
import People from '@material-ui/icons/People';
import React from 'react';
import { Link, Route } from 'react-router-dom';
import Dashboard from '../Dashboard';
import AdminChangePasswordPage from './change-password/AdminChangePasswordPage';
import AddCoursePage from './course/AddCoursePage';
import CoursesPage from './course/CoursesPage';
import EditCoursePage from './course/EditCoursePage';
import ShowCoursePage from './course/ShowCoursePage';
import AddFacultyPage from './faculty/AddFacultyPage';
import EditFacultyPage from './faculty/EditFacultyPage';
import FacultiesPage from './faculty/FacultiesPage';
import ShowFacultyPage from './faculty/ShowFacultyPage';
import AddEmployeeToGroupPage from './group/AddEmployeeToGroupPage';
import AddGroupPage from './group/AddGroupPage';
import AddStudentToGroupPage from './group/AddStudentToGroupPage';
import EditGroupPage from './group/EditGroupPage';
import GroupsPage from './group/GroupsPage';
import ShowGroupPage from './group/ShowGroupPage';
import AdminHomePage from './home/AdminHomePage';
import AdminMePage from './me/AdminMePage';
import AddScheduleItemPage from './schedule/AddScheduleItemPage';
import EditScheduleItemPage from './schedule/EditScheduleItemPage';
import SchedulePage from './schedule/SchedulePage';
import AddSubjectPage from './subject/AddSubjectPage';
import EditSubjectPage from './subject/EditSubjectPage';
import ShowSubjectPage from './subject/ShowSubjectPage';
import SubjectsPage from './subject/SubjectsPage';
import AddTermPage from './term/AddTermPage';
import EditTermPage from './term/EditTermPage';
import ShowTermPage from './term/ShowTermPage';
import TermsPage from './term/TermsPage';
import AddAdminPage from './user/add/AddAdminPage';
import AddEmployeePage from './user/add/AddEmployeePage';
import AddStudentPage from './user/add/AddStudentPage';
import EditAdminPage from './user/edit/EditAdminPage';
import EditEmployeePage from './user/edit/EditEmployeePage';
import EditStudentPage from './user/edit/EditStudentPage';
import ShowAdminPage from './user/show/ShowAdminPage';
import ShowEmployeePage from './user/show/ShowEmployeePage';
import ShowStudentPage from './user/show/ShowStudentPage';
import AdminUsersPage from './user/UsersPage';
import ShowBuildingsPage from './building/BuildingsPage';
import AddBuildingPage from "./building/AddBuildingPage";
import ShowBuildingPage from "./building/ShowBuildingPage";
import EditBuildingPage from "./building/EditBuildingPage";
import ShowRoomsPage from "./room/RoomsPage";
import AddRoomPage from "./room/AddRoomPage";
import ShowRoomPage from "./room/ShowRoomPage";
import EditRoomPage from "./room/EditRoomPage";

export default function AdminDashboard() {
  const menuItems = <React.Fragment>
    <ListItem button component={Link} to="/admin/users">
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <ListItemText primary="Użytkownicy" />
    </ListItem>
    <ListItem button component={Link} to="/admin/faculties">
      <ListItemIcon>
        <AccountBalance />
      </ListItemIcon>
      <ListItemText primary="Wydziały" />
    </ListItem>
    <ListItem button component={Link} to="/admin/subjects">
      <ListItemIcon>
        <School />
      </ListItemIcon>
      <ListItemText primary="Kierunki" />
    </ListItem>
    <ListItem button component={Link} to="/admin/courses">
      <ListItemIcon>
        <Subject />
      </ListItemIcon>
      <ListItemText primary="Przedmioty" />
    </ListItem>
    <ListItem button component={Link} to="/admin/groups">
      <ListItemIcon>
        <Group />
      </ListItemIcon>
      <ListItemText primary="Grupy" />
    </ListItem>
    <ListItem button component={Link} to="/admin/buildings">
      <ListItemIcon>
        <Business />
      </ListItemIcon>
      <ListItemText primary="Budynki" />
    </ListItem>
    <ListItem button component={Link} to="/admin/rooms">
      <ListItemIcon>
        <MeetingRoom />
      </ListItemIcon>
      <ListItemText primary="Pokoje" />
    </ListItem>
    <ListItem button component={Link} to="/admin/terms">
      <ListItemIcon>
        <DateRange />
      </ListItemIcon>
      <ListItemText primary="Semestry" />
    </ListItem>
  </React.Fragment>;

  return (
    <Dashboard routePrefix="admin" title="Panel Administratora" menuItems={menuItems}>
      <Route exact path="/admin/me">
        <AdminMePage />
      </Route>
      <Route exact path="/admin/change-password">
        <AdminChangePasswordPage />
      </Route>
      <Route exact path="/admin">
        <AdminHomePage />
      </Route>
      <Route exact path="/admin/users">
        <AdminUsersPage />
      </Route>
      <Route exact path="/admin/add-admin">
        <AddAdminPage />
      </Route>
      <Route exact path="/admin/show-admin/:userId">
        <ShowAdminPage />
      </Route>
      <Route exact path="/admin/edit-admin/:userId">
        <EditAdminPage />
      </Route>
      <Route exact path="/admin/add-employee">
        <AddEmployeePage />
      </Route>
      <Route exact path="/admin/show-employee/:userId">
        <ShowEmployeePage />
      </Route>
      <Route exact path="/admin/edit-employee/:userId">
        <EditEmployeePage />
      </Route>
      <Route exact path="/admin/add-student">
        <AddStudentPage />
      </Route>
      <Route exact path="/admin/show-student/:userId">
        <ShowStudentPage />
      </Route>
      <Route exact path="/admin/edit-student/:userId">
        <EditStudentPage />
      </Route>
      <Route exact path="/admin/faculties">
        <FacultiesPage />
      </Route>
      <Route exact path="/admin/add-faculty">
        <AddFacultyPage />
      </Route>
      <Route exact path="/admin/show-faculty/:facultyId">
        <ShowFacultyPage />
      </Route>
      <Route exact path="/admin/edit-faculty/:facultyId">
        <EditFacultyPage />
      </Route>
      <Route exact path="/admin/subjects">
        <SubjectsPage />
      </Route>
      <Route exact path="/admin/add-subject">
        <AddSubjectPage />
      </Route>
      <Route exact path="/admin/show-subject/:subjectId">
        <ShowSubjectPage />
      </Route>
      <Route exact path="/admin/edit-subject/:subjectId">
        <EditSubjectPage />
      </Route>
      <Route exact path="/admin/courses">
        <CoursesPage />
      </Route>
      <Route exact path="/admin/add-course">
        <AddCoursePage />
      </Route>
      <Route exact path="/admin/show-course/:courseId">
        <ShowCoursePage />
      </Route>
      <Route exact path="/admin/edit-course/:courseId">
        <EditCoursePage />
      </Route>
      <Route exact path="/admin/groups">
        <GroupsPage />
      </Route>
      <Route exact path="/admin/add-group">
        <AddGroupPage />
      </Route>
      <Route exact path="/admin/show-group/:groupId">
        <ShowGroupPage />
      </Route>
      <Route exact path="/admin/show-group/:groupId/schedule">
        <SchedulePage />
      </Route>
      <Route exact path="/admin/show-group/:groupId/add-schedule-item">
        <AddScheduleItemPage />
      </Route>
      <Route exact path="/admin/show-group/:groupId/edit-schedule-item/:scheduleItemId">
        <EditScheduleItemPage />
      </Route>
      <Route exact path="/admin/edit-group/:groupId">
        <EditGroupPage />
      </Route>
      <Route exact path="/admin/add-employee-to-group/:groupId">
        <AddEmployeeToGroupPage />
      </Route>
      <Route exact path="/admin/add-student-to-group/:groupId">
        <AddStudentToGroupPage />
      </Route>
      <Route exact path="/admin/terms">
        <TermsPage />
      </Route>
      <Route exact path="/admin/add-term">
        <AddTermPage />
      </Route>
      <Route exact path="/admin/show-term/:termId">
        <ShowTermPage />
      </Route>
      <Route exact path="/admin/edit-term/:termId">
        <EditTermPage />
      </Route>
        <Route exact path="/admin/buildings">
            <ShowBuildingsPage />
        </Route>
        <Route exact path="/admin/add-building">
            <AddBuildingPage />
        </Route>
        <Route exact path="/admin/show-building/:buildingId">
            <ShowBuildingPage />
        </Route>
        <Route exact path="/admin/edit-building/:buildingId">
            <EditBuildingPage />
        </Route>
        <Route exact path="/admin/rooms">
            <ShowRoomsPage />
        </Route>
        <Route exact path="/admin/add-room">
            <AddRoomPage />
        </Route>
        <Route exact path="/admin/show-room/:roomId">
            <ShowRoomPage />
        </Route>
        <Route exact path="/admin/edit-room/:roomId">
            <EditRoomPage />
        </Route>
    </Dashboard>
  );
}
