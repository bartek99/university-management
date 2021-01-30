import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as courseApi from '../../../core/courseApi';
import { ThemeContext } from './../../theme-context';
import Title from './../../Title';


export default function ShowCoursePage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;

    const params: any = useParams();

    const courseData = {
        subjectName: '',
        name: ''
    };
    const [data, setData] = useState(courseData);

    useEffect(() => {
        let mounted = true;
        courseApi.getCourse(params.courseId).then((course) => {
            if (mounted && course) {
                setData({
                    subjectName: course.subject.name,
                    name: course.name
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
                        <Title>Przedmiot</Title>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody>
                                <TableRow key="courseName">
                                    <TableCell variant="head" width="50%">Przedmiot</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                </TableRow>
                                <TableRow key="subjectName">
                                    <TableCell variant="head" width="50%">Kierunek</TableCell>
                                    <TableCell>{data.subjectName}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}