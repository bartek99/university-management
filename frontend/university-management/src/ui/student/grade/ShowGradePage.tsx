import React, {useContext, useEffect, useState} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
// import ShowUserPage from '../../../ShowUserPage';
import * as grade from '../../../core/grade';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Title from "../../Title";
import {Button, Link, Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import {ThemeContext} from "../../theme-context";

export default function ShowGradePage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;
    const params: any = useParams();

    const gradeData = {

            course: '',
            grade: '',
            name: '',
            description: ''
    };
    const [data, setData] = useState(gradeData);

    useEffect(() => {
        let mounted = true;

        grade.getGradeById(params.gradeId).then((grade) => {
            if (mounted && grade) {
                setData({
                        course: grade.course.name,
                        grade: grade.value.toString(),
                        name: grade.name,
                        description: grade.description

                });
            }
        });
    }, [params]);

    return (
        <Container maxWidth="lg" className={classes.container}>
            {data && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Ocena</Title>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody>
                                <TableRow key="course">
                                    <TableCell variant="head" width="50%">Przedmiot</TableCell>
                                    <TableCell>{data.course}</TableCell>
                                </TableRow>
                                <TableRow key="grade">
                                    <TableCell variant="head" width="50%">Ocena</TableCell>
                                    <TableCell>{data.grade}</TableCell>
                                </TableRow>
                                <TableRow key="name">
                                    <TableCell variant="head" width="50%">Nazwa</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                </TableRow>
                                <TableRow key="description">
                                    <TableCell variant="head" width="50%">Opis</TableCell>
                                    <TableCell>{data.description}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}