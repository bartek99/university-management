import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import * as userApi from './../../../core/user';
import * as studentApi from './../../../core/studentApi';
import * as groupApi from './../../../core/groupApi';

interface AddStudentToGroupFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddStudentToGroupForm(props: AddStudentToGroupFormProps) {
    const params: any = useParams();
    const groupId = params.groupId;

    const { handleSubmit, control, errors, reset } = useForm();

    const [students, setStudents] = React.useState<userApi.Student[]>([]);
    useEffect(() => {
        let mounted = true;
        studentApi.getStudents()
            .then((students) => {
                if (mounted) {
                    setStudents(students);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    const onSubmit = (data: { studentId: number }) => {
        props.setResult(null);
        groupApi.addStudent(groupId, data.studentId)
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
                        <InputLabel id="studentIdLabel">Student</InputLabel>
                        <Controller
                            name="studentId"
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
                                    labelId="studentIdLabel"
                                    id="studentId"
                                    error={errors.studentId ? true : false}
                                >
                                    {students.map(student => <MenuItem key={student.studentId} value={student.studentId}>{student.fullName}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.studentId ? true : false}>{errors.studentId && errors.studentId.message}</FormHelperText>
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