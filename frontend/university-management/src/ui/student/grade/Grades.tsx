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
import * as auth from '../../../core/auth';
import * as course from '../../../core/courseApi';
import * as grade from '../../../core/grade';
import ConfirmationDialog from '../../ConfirmationDialog';
import Title from '../../Title';
import {Link} from "@material-ui/core";

interface GradeProps {
    classes: any;
}

export default function Grades(props: GradeProps) {
    const [grades, setGrades] = useState<{ [key: number]: grade.Grade }>({});
    const [courses, setCourses] = useState<{ [key: number]: course.Course }>({});

    useEffect(() => {
        let mounted = true;
        const token = auth.getToken();
        if (token) {
            course.getMyCourses()
                .then((courses) => {
                    if (mounted) {
                        const coursesById = courses.reduce((coursesById, course) =>
                        { return { ...coursesById, [course.courseId]: course }; }, {});
                        setCourses(coursesById);
                    }
                })
                .catch((error) => { });
        }

        return () => {
            mounted = false
        }
    }, []);


    useEffect(() => {
        let mounted = true;
        const token = auth.getToken();
        if (token) {
            grade.getMyGrades()
                .then((grades) => {
                    if (mounted) {
                        const gradesById = grades.reduce((gradesById, grade) =>
                        { return { ...gradesById, [grade.gradeId]: grade }; }, {});
                        setGrades(gradesById);
                    }
                })
                .catch((error) => { });
        }

        return () => {
            mounted = false
        }
    }, []);

    return (
        <React.Fragment>
            <Title>Oceny</Title>
            <Grid container item justify="flex-end">
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Nazwa przedmiotu</TableCell>
                        <TableCell>Ocena</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(courses).sort((courseA, courseB) => courseA.name < courseB.name ? -1 : 1)
                        .map((course) => (
                         <TableRow key={course.courseId}>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>
                                {Object.values(grades)
                                    .filter(grade => grade.course.courseId===course.courseId)
                                    .map((grade) =>
                                    <li key={grade.gradeId}>
                                        <Link color="primary" component={RouterLink} to={"/student/grades/" + grade.gradeId}>
                                            {grade.value + " - " + grade.name}
                                        </Link>
                                    </li>
                                 )}

                                    </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment >
    );
}
