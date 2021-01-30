import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as facultyApi from '../../../core/facultyApi';
import Title from './../../Title';
import { ThemeContext } from './../../theme-context';

export default function ShowFacultyPage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;

    const params: any = useParams();

    const facultyData = {
        name: ''
    };
    const [data, setData] = useState(facultyData);

    useEffect(() => {
        let mounted = true;
        facultyApi.getFaculty(params.facultyId).then((faculty) => {
            if (mounted && faculty) {
                setData({
                    name: faculty.name
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
                        <Title>Wydział</Title>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody>
                                <TableRow key="name">
                                    <TableCell variant="head" width="50%">Wydział</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}