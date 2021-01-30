import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ShowIcon from '@material-ui/icons/Visibility';
import Alert from '@material-ui/lab/Alert';
import React, {useContext, useEffect, useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as group from '../../../core/groupApi';
import ConfirmationDialog from './../../ConfirmationDialog';
import Title from './../../Title';
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import {ThemeContext} from "../../theme-context";



export default function MyGroupsPage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;
    const [groups, setGroups] = useState<{ [key: number]: group.Group }>({});

    useEffect(() => {
        let mounted = true;
        group.getMyEmployeeGroups()
            .then((groups) => {
                if (mounted) {
                    const groupsById = groups.reduce((groupsById, group) =>
                    { return { ...groupsById, [group.groupId]: group }; }, {});
                    setGroups(groupsById);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);


    const CoursesTable = (props:any) => (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Grupa</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.values(groups).map((group) => (
                    <TableRow key={group.groupId}>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>
                            <IconButton aria-label="show" component={RouterLink} to={`/employee/show-group/${group.groupId}`}>
                                <ShowIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    return (


        <Container maxWidth="lg" className={classes.container}>

            {groups && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Grupy</Title>
                        {groups && <CoursesTable data={groups} />}
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}
