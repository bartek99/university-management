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
import {Link as RouterLink, useParams} from 'react-router-dom';
import * as auth from '../../../core/auth';
import * as courseApi from '../../../core/courseApi';
import * as grade from '../../../core/grade';
import * as student from '../../../core/studentApi';
import ConfirmationDialog from '../../ConfirmationDialog';
import Title from '../../Title';
import {Link} from "@material-ui/core";
import * as userApi from "../../../core/user";
 import Container from "@material-ui/core/Container";
 import Paper from "@material-ui/core/Paper";
 import {ThemeContext} from "../../theme-context";
 import * as room from "../../../core/room";

interface GradeProps {
    classes: any;
}

export default function Grades(props: GradeProps) {
    const params: any = useParams();
    const groupId = params.groupId;
    const [grades, setGrades] = useState<{ [key: number]: grade.Grade }>({});
    const [students, setStudents] = useState<{ [key: number]: userApi.Student }>({});

    const courseData = {

        courseId: 0,
        courseName: '',
    };
    const [course, setCourse] = useState(courseData);



    useEffect(() => {
        let mounted = true;
        const token = auth.getToken();
        if (token) {
            courseApi.getCourseByGroupId(groupId)
                .then((course) => {
                    if (mounted && course) {
                        setCourse({
                            courseId: course.courseId,
                            courseName: course.name
                        });
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
        student.getStudentsByGroupId(groupId)
                .then((students) => {
                    if (mounted) {
                        const studentsById = students.reduce((studentsById, student) =>
                        { return { ...studentsById, [student.studentId]: student }; }, {});
                        setStudents(studentsById);
                    }
                })
                .catch((error) => { });


        return () => {
            mounted = false
        }
    }, []);


    useEffect(() => {
        let mounted = true;
        const token = auth.getToken();
        if (token) {
            grade.getAllGradesByMeEmployee()
                .then((grades) => {
                    if (mounted) {
                        const gradesById = grades.reduce((gradesById, grade) => {
                            return {...gradesById, [grade.gradeId]: grade};
                        }, {});
                        setGrades(gradesById);
                    }
                })
                .catch((error) => {
                });
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
                        <TableCell>Student</TableCell>
                        <TableCell>Przedmiot</TableCell>
                        <TableCell>Ocena</TableCell>
                        {/*<TableCell>Nazwa</TableCell>*/}
                        {/*<TableCell>Opis</TableCell>*/}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(students).sort((studentA, studentB) =>
                        studentA.lastName < studentB.lastName ? -1 : 1)
                        .map((student) => (
                            <TableRow key={student.studentId}>
                            <TableCell>{student.firstName + ' ' + student.lastName}</TableCell>
                            <TableCell>{course.courseName}</TableCell>

                                     <TableCell>
                                         {Object.values(grades)
                                             .filter(grade => grade.course.courseId===course.courseId)
                                             .map((grade) =>(
                                        <li key={grade.gradeId}>
                                            <Link color="primary" component={RouterLink} to={"/employee/show-grade/gradeId/" + grade.gradeId + "/groupId/" + groupId}>
                                                {grade.value + " - " + grade.name}
                                            </Link>
                                        </li>
                                                 ))}
                                     </TableCell>
                                    {/*<TableCell>*/}
                                    {/*    {Object.values(grades)*/}
                                    {/*        .filter(grade => grade.course.courseId===course.courseId)*/}
                                    {/*        .map((grade) =>(*/}
                                    {/*    <li key={grade.gradeId}>*/}
                                    {/*    {grade.name}*/}
                                    {/*    </li>*/}
                                    {/*            ))}*/}
                                    {/*</TableCell>*/}
                                    {/* <TableCell>*/}
                                    {/*     {Object.values(grades)*/}
                                    {/*         .filter(grade => grade.course.courseId===course.courseId)*/}
                                    {/*         .map((grade) =>(*/}
                                    {/*             <li key={grade.gradeId}>*/}
                                    {/*                 {grade.description}*/}
                                    {/*             </li>*/}
                                    {/*         ))}*/}
                                    {/* </TableCell>*/}
                        </TableRow>
                            ))}
                </TableBody>
            </Table>
        </React.Fragment >
    );

}
