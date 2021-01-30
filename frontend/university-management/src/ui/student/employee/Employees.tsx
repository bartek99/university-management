import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import Title from './../../Title';
import * as user from '../../../core/user';


interface EmployeesProps {
    classes: any;
}

export default function Employees(props: EmployeesProps) {
    const [employees, setEmployees] = useState<{ [key: number]: user.Employee }>({});


    useEffect(() => {
        let mounted = true;
        user.getEmployees()
            .then((employees) => {
                if (mounted) {
                    const employeesById = employees.reduce((employeesById, employee) =>
                    { return { ...employeesById, [employee.employeeId]: employee }; }, {});
                    setEmployees(employeesById);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    return (
        <React.Fragment>
            <Title>Pracownicy</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Imię</TableCell>
                        <TableCell>Nazwisko</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Telefon</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(employees).map((employee) => (
                        <TableRow key={employee.employeeId}>
                            <TableCell>{employee.firstName}</TableCell>
                            <TableCell>{employee.lastName}</TableCell>
                            <TableCell>{employee.user.email}</TableCell>
                            <TableCell>{employee.phoneNumber}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment >
    );
}
