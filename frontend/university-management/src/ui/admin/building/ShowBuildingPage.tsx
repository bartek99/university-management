import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as building from '../../../core/building';
import Title from './../../Title';
import { ThemeContext } from './../../theme-context';



export default function ShowBuildingPage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;

    const params: any = useParams();

    const buildingData = {
        building: {
            'Nazwa': ''
        },address: {
            'Ulica': '',
            'Numer domu': '',
            'Kod pocztowy': '',
            'Miasto': '',
            'Kraj': ''
        }
    };
    const [data, setData] = useState(buildingData);

    useEffect(() => {
        let mounted = true;
        building.getBuilding(params.buildingId).then((building) => {
            if (mounted && building) {
                setData({
                    building: {
                        'Nazwa': building.name,
                    },
                    address: {
                        'Ulica': building.address.street,
                        'Numer domu': building.address.houseNumber,
                        'Kod pocztowy': building.address.postcode,
                        'Miasto': building.address.city,
                        'Kraj': building.address.country
                    }
                });
            }
        })
        .catch((error) => { });

        return () => {
            mounted = false;
        }
    }, [params]);

    const BuildingRows = (props: any) => (
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
            {data.building && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Dane budynku</Title>
                        {data.building && <BuildingRows data={data.building} />}
                    </Paper>
                </Grid>
            </Grid>}


            {data.address && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Adres</Title>
                        {data.address && <AddressRows data={data.address} />}
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}