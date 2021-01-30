import Container from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';
import Paper from "@material-ui/core/Paper";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useContext, useEffect, useState } from 'react';
import * as group from '../../../core/groupApi';
import { ThemeContext } from "../../theme-context";
import Title from './../../Title';


function getDistinctSubjects(groups: group.Group[]): { [key: number]:  { subjectId: number, faculty: string, subject: string } } {
    const result: { [key: number]:  { subjectId: number, faculty: string, subject: string } } = {};
    groups.forEach(group => {
        result[group.course.subject.subjectId] = { subjectId: group.course.subject.subjectId, faculty: group.course.subject.faculty.name, subject: group.course.subject.name };
    });
    return result;
}

export default function MyStudiesPage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;
    const [groups, setGroups] = useState<{ [key: number]: group.Group }>({});

    useEffect(() => {
        let mounted = true;
        group.getMyGroups()
            .then((groups) => {
                if (mounted) {
                    const groupsById = groups.reduce((groupsById, group) => { return { ...groupsById, [group.groupId]: group }; }, {});
                    setGroups(groupsById);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    const SubjectsTable = (props: any) => (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Wydział</TableCell>
                    <TableCell>Kierunek</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.values(getDistinctSubjects(Object.values(groups))).map((subject) => (
                    <TableRow key={subject.subjectId}>
                        <TableCell>{subject.faculty}</TableCell>
                        <TableCell>{subject.subject}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    const CoursesTable = (props: any) => (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Przedmiot</TableCell>
                    <TableCell>Grupa</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.values(groups).map((group) => (
                    <TableRow key={group.groupId}>
                        <TableCell>{group.course.name}</TableCell>
                        <TableCell>{group.name}</TableCell>
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
                        <Title>Mój kierunek</Title>
                        {groups && <SubjectsTable data={groups} />}
                    </Paper>
                </Grid>
            </Grid>}

            {groups && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Moje przedmioty</Title>
                        {groups && <CoursesTable data={groups} />}
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}
