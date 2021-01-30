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
import ConfirmationDialog from "../../ConfirmationDialog";
import Alert from "@material-ui/lab/Alert";

export default function ShowGradePage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;
    const params: any = useParams();
    const groupId = params.groupId;
    const gradeId = params.gradeId;


    const gradeData = {
            courseId: 0,
            student: '',
            course: '',
            grade: '',
            name: '',
            description: ''
    };
    const [data, setData] = useState(gradeData);
    const [gradeDataId, setGradeDataId] = useState<number | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [gradeDeleted, setGradeDeleted] = useState<boolean | null>(null);


    const handleOk = () => {
        setDeleteDialogOpen(false);
        setGradeDeleted(null);
        if (gradeDataId !== null) {
            grade.deleteGrade(gradeDataId)
                .then((result) => {
                    if (result) {
                        setData({courseId: 0,
                            student: '',
                            course: '',
                            grade: '',
                            name: '',
                            description: ''
                    }
                        )
                        setGradeDeleted(result);
                    } else {
                        setGradeDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;

        grade.getGradeById(params.gradeId).then((grade) => {
            if (mounted && grade) {
                setData({
                        courseId: grade.course.courseId,
                        student: grade.student.firstName + ' ' + grade.student.lastName,
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
                        <ConfirmationDialog
                            message="Czy na pewno usunąć"
                            open={deleteDialogOpen}
                            handleOk={handleOk}
                            handleCancel={handleCancel}
                        />
                        <Title>Ocena</Title>
                        <div style={{ marginBottom: 10 }}>
                            {gradeDeleted !== null && gradeDeleted === true && <Alert severity="success">Ocena została usunięta.</Alert>}
                            {gradeDeleted !== null && gradeDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
                        </div>
                        <Grid container item justify="flex-end">
                            <Grid item>
                                <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }}

                                        component={RouterLink} to={`/employee/edit-grade/${gradeId}/groupId/${groupId}/courseId/${data.courseId}`}
                                    // onClick={() => {
                                        //     setGradeDataId(gradeId);
                                        //     setDeleteDialogOpen(true);
                                        // }}

                                    // component={RouterLink} to={"/employee/show-group/" + groupId + "/" + data.courseId +  "/grades"}

                                    // component={RouterLink} to={"/employee/show-grade/gradeId/" + gradeId + "/groupId/" + groupId}
                                >
                                    Edytuj ocenę
                                </Button>
                                <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }}
                                        onClick={() => {
                                            setGradeDataId(gradeId);
                                            setDeleteDialogOpen(true);
                                        }}

                                        // component={RouterLink} to={"/employee/show-group/" + groupId + "/" + data.courseId +  "/grades"}

                                    // component={RouterLink} to={"/employee/show-grade/gradeId/" + gradeId + "/groupId/" + groupId}
                                    >
                                    Usuń ocenę
                                </Button>
                            </Grid>
                        </Grid>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody>
                                <TableRow key="student">
                                    <TableCell variant="head" width="50%">Student</TableCell>
                                    <TableCell>{data.student}</TableCell>
                                </TableRow>
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