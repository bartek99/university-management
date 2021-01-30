import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import * as faculty from '../../../core/facultyApi';
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

    const facultyData = {
        faculty: {
            'Wydział': ''
        }
    };


    const [dataFaculty, setDataFaculty] = useState(facultyData);
    const [dataSubjects, setDataSubjects] = useState<{ [key: number]: subject.Subject }>({});

    useEffect(() => {
        let mounted = true;
        faculty.getFaculty(params.facultyId).then((faculty) => {
            if (mounted && faculty) {
                setDataFaculty({
                    faculty: {
                        'Wydział': faculty.name
                    }
                });
            }
        })
        subject.getSubjectsByFacultyId(params.facultyId).then((subject) => {
            if (mounted) {
                const subjectById = subject.reduce((subjectById, subject) =>
                { return { ...subjectById, [subject.subjectId]: subject }; }, {});
                setDataSubjects(subjectById);
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

    const SubjectsTable = (props:any) => (
        <Table size="small">
        <TableHead>
            <TableRow>
                <TableCell>Kierunek</TableCell>
                <TableCell></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {Object.values(dataSubjects)
                .sort((subjectA, subjectB) => subjectA.name < subjectB.name ? -1 : 1)
                .map((subject) => (
                <TableRow key={subject.subjectId}>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>
                        <IconButton aria-label="show" component={RouterLink} to={`/student/show-subject/${subject.subjectId}`}>
                            <ShowIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
            );


    return (
        <Container maxWidth="lg" className={classes.container}>
            {dataFaculty.faculty && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Wydział</Title>
                        {dataFaculty.faculty && <FacultyRows data={dataFaculty.faculty} />}
                    </Paper>
                </Grid>
            </Grid>}



            {dataSubjects && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Title>Kierunki</Title>
                        {dataSubjects && <SubjectsTable data={dataSubjects} />}
                    </Paper>
                </Grid>
            </Grid>}
        </Container >
    );
}