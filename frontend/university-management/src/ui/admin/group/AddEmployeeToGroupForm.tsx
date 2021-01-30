import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import * as userApi from './../../../core/user';
import * as employeeApi from './../../../core/employeeApi';
import * as groupApi from './../../../core/groupApi';

interface AddEmployeeToGroupFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddEmployeeToGroupForm(props: AddEmployeeToGroupFormProps) {
    const params: any = useParams();
    const groupId = params.groupId;

    const { handleSubmit, control, errors, reset } = useForm();

    const [employees, setEmployees] = React.useState<userApi.Employee[]>([]);
    useEffect(() => {
        let mounted = true;
        employeeApi.getEmployees()
            .then((employees) => {
                if (mounted) {
                    setEmployees(employees);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    const onSubmit = (data: { employeeId: number }) => {
        props.setResult(null);
        groupApi.addEmployee(groupId, data.employeeId)
            .then((result) => {
                if (result) {
                    props.setResult(true);
                    reset();
                } else {
                    props.setResult(false);
                }
            })
            .catch((error) => props.setResult(false));
    }

    return (
        <Box width={1 / 4}>
            <form
                className={props.classes.form}
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <FormControl fullWidth className={props.classes.formControl}>
                        <InputLabel id="employeeIdLabel">Pracownik</InputLabel>
                        <Controller
                            name="employeeId"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: {
                                    value: true,
                                    message: 'To pole jest wymagane'
                                }
                            }}
                            as={
                                <Select
                                    labelId="employeeIdLabel"
                                    id="employeeId"
                                    error={errors.employeeId ? true : false}
                                >
                                    {employees.map(employee => <MenuItem key={employee.employeeId} value={employee.employeeId}>{employee.fullName}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.employeeId ? true : false}>{errors.employeeId && errors.employeeId.message}</FormHelperText>
                    </FormControl>
                </div>
                <div style={{ marginTop: 10 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={props.classes.submit}
                    >
                        Dodaj
                    </Button>
                </div>
            </form>
        </Box>
    );
}