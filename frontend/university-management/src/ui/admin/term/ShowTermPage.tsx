import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as termApi from './../../../core/termApi';
import { ThemeContext } from './../../theme-context';
import Title from './../../Title';

export default function ShowTermPage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;

    const params: any = useParams();

    const termData = {
        name: '',
        dateFrom: '',
        dateTo: ''
    };
    const [data, setData] = useState(termData);

    useEffect(() => {
        let mounted = true;
        termApi.getTerm(params.termId).then((term) => {
            if (mounted && term) {
                setData({
                    name: term.name,
                    dateFrom: term.dateFrom,
                    dateTo: term.dateTo
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
                        <Title>Semestr</Title>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody>
                                <TableRow key="name">
                                    <TableCell variant="head" width="50%">Semestr</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                </TableRow>
                                <TableRow key="dateFrom">
                                    <TableCell variant="head" width="50%">Od</TableCell>
                                    <TableCell>{data.dateFrom}</TableCell>
                                </TableRow>
                                <TableRow key="dateTo">
                                    <TableCell variant="head" width="50%">Do</TableCell>
                                    <TableCell>{data.dateTo}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}