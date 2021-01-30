import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext } from 'react';
import { ThemeContext } from './theme-context';
import Title from './Title';

interface ShowUserPageProps {
    data: any;
}

export default function ShowUserPage(props: ShowUserPageProps) {
    const context = useContext(ThemeContext);
    const classes = context.classes;

    const UserRows = (props: any) => (
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

    const PersonalDataRows = (props: any) => (
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

    const AddressRows = (props: any) => (
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

    return (
        <Container maxWidth="lg" className={classes.container}>
            {props.data.user && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Dane użytkownika</Title>
                        {props.data.user && <UserRows data={props.data.user} />}
                    </Paper>
                </Grid>
            </Grid>}

            {props.data.personalData && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Dane osobowe</Title>
                        {props.data.personalData && <PersonalDataRows data={props.data.personalData} />}
                    </Paper>
                </Grid>
            </Grid>}

            {props.data.address && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Adres</Title>
                        {props.data.address && <AddressRows data={props.data.address} />}
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}