import { Button, Link, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
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
        courseId: '',
        courseName: '',
        students: [] as userApi.Student[]
    };
    const [data, setData] = useState(groupData);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            groupApi.getGroup(params.groupId),
            studentApi.getStudentsByGroupId(params.groupId)
        ]).then((results: any) => {
            const [group, students] = results;
            if (mounted && group && students) {
                setData({
                    groupId: `${group.groupId}`,
                    name: group.name,
                    courseId: group.course.courseId,
                    courseName: group.course.name,
                    students: students
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
                                <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to={"/employee/show-group/" + data.groupId + "/" + data.courseId + "/addGrade"}>
                                    Dodaj ocenę
                                </Button>
                                <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to={"/employee/show-group/" + data.groupId + "/" + data.courseId + "/grades"}>
                                    Oceny
                                </Button>
                            </Grid>
                        </Grid>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody>
                                <TableRow key="name">
                                    <TableCell variant="head" width="50%">Grupa</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                </TableRow>
                                <TableRow key="course">
                                    <TableCell variant="head" width="50%">Przedmiot</TableCell>
                                    <TableCell>{data.courseName}</TableCell>
                                </TableRow>
                                <TableRow key="students">
                                    <TableCell variant="head" width="50%">Studenci</TableCell>
                                    <TableCell>
                                        <ul style={{ paddingLeft: 13 }}>
                                            {data.students.map((student) =>
                                                <li key={student.studentId}>
                                                    <Link color="primary" component={RouterLink} to={"/employee/show-student/" + student.user.userId}>
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