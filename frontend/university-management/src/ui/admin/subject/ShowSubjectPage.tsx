import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as subjectApi from './../../../core/subjectApi';
import Title from './../../Title';
import { ThemeContext } from './../../theme-context';

export default function ShowSubjectPage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;

    const params: any = useParams();

    const subjectData = {
        facultyName: '',
        name: ''
    };
    const [data, setData] = useState(subjectData);

    useEffect(() => {
        let mounted = true;
        subjectApi.getSubject(params.subjectId).then((subject) => {
            if (mounted && subject) {
                setData({
                    facultyName: subject.faculty.name,
                    name: subject.name
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
                        <Title>Kierunek</Title>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody>
                                <TableRow key="name">
                                    <TableCell variant="head" width="50%">Kierunek</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                </TableRow>
                                <TableRow key="facultyName">
                                    <TableCell variant="head" width="50%">Wydział</TableCell>
                                    <TableCell>{data.facultyName}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}