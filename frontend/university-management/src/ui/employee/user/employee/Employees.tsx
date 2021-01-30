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
import * as employee from '../../../../core/employeeApi';
import ConfirmationDialog from '../../../ConfirmationDialog';
import Title from '../../../Title';

interface EmployeeProps {
    classes: any;
}

export default function Employees(props: EmployeeProps) {
    const [employees, setEmployees] = useState<{ [key: number]: user.Employee }>({});

    useEffect(() => {
        let mounted = true;
        const token = auth.getToken();
        if (token) {
            employee.getEmployees()
                .then((employees) => {
                    if (mounted) {
                        const employeesById = employees.reduce((employeesById, employee) =>
                        { return { ...employeesById, [employee.employeeId]: employee }; }, {});
                        setEmployees(employeesById);
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
            <Title>Pracownicy</Title>
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
                    {Object.values(employees).sort((employeeA, employeeB) =>
                        employeeA.lastName < employeeB.lastName ? -1 : 1).map((employee) => (
                        <TableRow key={employee.employeeId}>
                            <TableCell>{employee.firstName}</TableCell>
                            <TableCell>{employee.lastName}</TableCell>
                            <TableCell>{employee.user.email}</TableCell>
                            <TableCell>
                                <IconButton aria-label="show" component={RouterLink} to={`/employee/show-employee/${employee.user.userId}`}>
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
