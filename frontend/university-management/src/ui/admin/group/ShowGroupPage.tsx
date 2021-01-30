import { Button, Link, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import * as employeeApi from './../../../core/employeeApi';
import * as groupApi from './../../../core/groupApi';
import * as studentApi from './../../../core/studentApi';
import * as userApi from './../../../core/user';
import { ThemeContext } from './../../theme-context';
import Title from './../../Title';

export default function ShowGroupPage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;
    const params: any = useParams();

    const groupData = {
        groupId: '',
        name: '',
        courseName: '',
        employees: [] as userApi.Employee[],
        students: [] as userApi.Student[]
    };
    const [data, setData] = useState(groupData);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            groupApi.getGroup(params.groupId),
            employeeApi.getEmployeesByGroupId(params.groupId),
            studentApi.getStudentsByGroupId(params.groupId)
        ]).then((results: any) => {
            const [group, employees, students] = results;
            if (mounted && group && employees && students) {
                setData({
                    groupId: `${group.groupId}`,
                    name: group.name,
                    courseName: group.course.name,
                    students: students,
                    employees: employees
                })
            }
        });

        return () => {
            mounted = false;
        }
    }, [params]);

    return (
        <Container maxWidth="lg" className={classes.container}>
            {data && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Grupa</Title>
                        <Grid container item justify="flex-end">
                            <Grid item>
                                <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to={"/admin/add-employee-to-group/" + data.groupId}>
                                    Dodaj pracownika
                                </Button>
                                <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to={"/admin/add-student-to-group/" + data.groupId}>
                                    Dodaj studenta
                                </Button>
                                <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to={"/admin/show-group/" + data.groupId + "/schedule"}>
                                    Plan zajęć
                                </Button>
                            </Grid>
                        </Grid>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody>
                                <TableRow key="name">
                                    <TableCell variant="head" width="50%">Grupa</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                </TableRow>
                                <TableRow key="subject">
                                    <TableCell variant="head" width="50%">Przedmiot</TableCell>
                                    <TableCell>{data.courseName}</TableCell>
                                </TableRow>
                                <TableRow key="employees">
                                    <TableCell variant="head" width="50%">Pracownicy</TableCell>
                                    <TableCell>
                                        <ul style={{ paddingLeft: 13 }}>
                                            {data.employees.map((employee) =>
                                                <li key={employee.employeeId}>
                                                    <Link color="primary" component={RouterLink} to={"/admin/show-employee/" + employee.user.userId}>
                                                        {employee.fullName}
                                                    </Link>
                                                </li>)}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                                <TableRow key="students">
                                    <TableCell variant="head" width="50%">Studenci</TableCell>
                                    <TableCell>
                                        <ul style={{ paddingLeft: 13 }}>
                                            {data.students.map((student) =>
                                                <li key={student.studentId}>
                                                    <Link color="primary" component={RouterLink} to={"/admin/show-student/" + student.user.userId}>
                                                        {student.fullName}
                                                    </Link>
                                                </li>)
                                            }
                                        </ul>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
} 