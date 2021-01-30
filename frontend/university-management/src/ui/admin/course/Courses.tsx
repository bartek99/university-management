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
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as courseApi from '../../../core/courseApi';
import ConfirmationDialog from './../../ConfirmationDialog';
import Title from './../../Title';

interface CoursesProps {
    classes: any;
}

export default function Courses(props: CoursesProps) {
    const [courses, setCourses] = useState<{ [key: number]: courseApi.Course }>({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseId, setCourseId] = useState<number | null>(null)
    const [courseDeleted, setCourseDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setCourseDeleted(null);
        if (courseId !== null) {
            courseApi.deleteCourse(courseId)
                .then((result) => {
                    if (result) {
                        delete courses[courseId];
                        setCourses({ ...courses });
                        setCourseDeleted(result);
                    } else {
                        setCourseDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;
        courseApi.getCourses()
            .then((courses) => {
                if (mounted) {
                    const coursesById = courses.reduce((coursesById, course) => { return { ...coursesById, [course.courseId]: course }; }, {});
                    setCourses(coursesById);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    return (
        <React.Fragment>
            <ConfirmationDialog
                message="Czy na pewno usunąć"
                open={deleteDialogOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />
            <Title>Przedmioty</Title>
            <div style={{ marginBottom: 10 }}>
                {courseDeleted !== null && courseDeleted === true && <Alert severity="success">Przedmiot został usunięty.</Alert>}
                {courseDeleted !== null && courseDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-course">
                        Dodaj przedmiot
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Przedmiot</TableCell>
                        <TableCell>Kierunek</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(courses).sort((courseA, courseB) => courseA.subject.name < courseB.subject.name ? -1 : 1).map((course) => (
                        <TableRow key={course.courseId}>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>{course.subject.name}</TableCell>
                            <TableCell>
                                <IconButton aria-label="show" component={RouterLink} to={`/admin/show-course/${course.courseId}`}>
                                    <ShowIcon />
                                </IconButton>
                                <IconButton aria-label="edit" component={RouterLink} to={`/admin/edit-course/${course.courseId}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => {
                                    setCourseId(course.courseId);
                                    setDeleteDialogOpen(true);
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment >
    );
}
