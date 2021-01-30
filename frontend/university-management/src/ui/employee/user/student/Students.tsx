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
import * as auth from '../../../../core/auth';
import * as user from '../../../../core/user';
import * as student from '../../../../core/studentApi';
import ConfirmationDialog from '../../../ConfirmationDialog';
import Title from '../../../Title';

interface StudentProps {
    classes: any;
}

export default function Students(props: StudentProps) {
    const [students, setStudents] = useState<{ [key: number]: user.Student }>({});

    useEffect(() => {
        let mounted = true;
        const token = auth.getToken();
        if (token) {
            student.getStudents()
                .then((students) => {
                    if (mounted) {
                        const studentsById = students.reduce((studentsById, student) =>
                        { return { ...studentsById, [student.studentId]: student }; }, {});
                        setStudents(studentsById);
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
            <Title>Studenci</Title>
            <Grid container item justify="flex-end">
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Imię</TableCell>
                        <TableCell>Nazwisko</TableCell>
                        <TableCell>E-mail</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(students).sort((studentA, studentB) => studentA.user.userType < studentB.user.userType ? -1 : 1).map((student) => (
                        <TableRow key={student.studentId}>
                            <TableCell>{student.firstName}</TableCell>
                            <TableCell>{student.lastName}</TableCell>
                            <TableCell>{student.user.email}</TableCell>
                            <TableCell>
                                <IconButton aria-label="show" component={RouterLink} to={`/employee/show-student/${student.user.userId}`}>
                                    <ShowIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment >
    );
}
