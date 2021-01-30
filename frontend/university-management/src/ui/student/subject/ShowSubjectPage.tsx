import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import * as course from '../../../core/courseApi';
import * as subject from '../../../core/subjectApi';
import Title from './../../Title';
import { ThemeContext } from './../../theme-context';
import TableHead from "@material-ui/core/TableHead";
import IconButton from "@material-ui/core/IconButton";
import ShowIcon from "@material-ui/icons/Visibility";

export default function ShowFacultyPage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;
    const params: any = useParams();



    const subjectData = {
        faculty: {
            'Wydział': ''
        },
        subject: {
            'Kierunek': ''
        }
    };


    const [dataSubject, setDataSubject] = useState(subjectData);
    const [dataCourses, setDataCourses] = useState<{ [key: number]: course.Course }>({});

    useEffect(() => {
        let mounted = true;
        subject.getSubject(params.subjectId).then((subject) => {
            if (mounted && subject) {
                setDataSubject({
                    faculty: {
                        'Wydział': subject.faculty.name
                    },
                    subject: {
                        'Kierunek': subject.name
                    }
                });
            }
        })
        course.getCoursesBySubjectId(params.subjectId).then((course) => {
            if (mounted) {
                const courseById = course.reduce((courseById, course) =>
                { return { ...courseById, [course.courseId]: course }; }, {});
                setDataCourses(courseById);
            }
        })
            .catch((error) => { });

        return () => {
            mounted = false;
        }
    }, [params]);

    const FacultyRows = (props: any) => (
        <Table className={classes.table} aria-label="simple table">
            <TableBody>
                {Object.keys(props.data).map((key) => (
                    <TableRow key={key}>
                        <TableCell variant="head" width="50%">{key}</TableCell>
                        <TableCell>{props.data[key]}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const SubjectRows = (props: any) => (
        <Table className={classes.table} aria-label="simple table">
            <TableBody>
                {Object.keys(props.data).map((key) => (
                    <TableRow key={key}>
                        <TableCell variant="head" width="50%">{key}</TableCell>
                        <TableCell>{props.data[key]}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const CoursesTable = (props:any) => (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Kierunek</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.values(dataCourses)
                    .sort((courseA, courseB) => courseA.name < courseB.name ? -1 : 1)
                    .map((course) => (
                    <TableRow key={course.courseId}>
                        <TableCell>{course.name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );


    return (
        <Container maxWidth="lg" className={classes.container}>
            {dataSubject.faculty && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Wydział</Title>
                        {dataSubject.faculty && <FacultyRows data={dataSubject.faculty} />}
                    </Paper>
                </Grid>
            </Grid>}

            {dataSubject.subject && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Kierunek</Title>
                        {dataSubject.subject && <FacultyRows data={dataSubject.subject} />}
                    </Paper>
                </Grid>
            </Grid>}



            {dataCourses && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Przedmioty</Title>
                        {dataCourses && <CoursesTable data={dataCourses} />}
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}