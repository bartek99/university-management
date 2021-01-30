import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as course from "../../../core/courseApi";
import * as grade from "../../../core/grade";
import * as student from './../../../core/studentApi';
import * as userApi from './../../../core/user';

interface EditGradeFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function EditGradeForm(props: EditGradeFormProps) {
    const params: any = useParams();
    const groupId = params.groupId;
    const gradeId = params.gradeId;
    const courseId = Number(params.courseId);

    const { register, handleSubmit, control, errors, reset } = useForm();

    const [courseData, setCourseData] = React.useState<course.Course | null>();
    const [students, setStudents] = React.useState<userApi.Student[]>([]);
    useEffect(() => {
        let mounted = true;
        student.getStudentsByGroupId(groupId)
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

    useEffect(() => {
        let mounted = true;
        course.getCourseByGroupId(groupId)
            .then((result) => {
                const courseData = result;
                if (mounted && courseData) {
                    setCourseData(courseData);
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);



    useEffect(() => {
        let mounted = true;
        grade.getGradeById(gradeId)
            .then((grade) => {
                if (mounted && grade) {
                    reset({
                        studentId: grade.student.studentId,
                        value: grade.value,
                        name: grade.name,
                        description: grade.description
                    });
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);


    const onSubmit = (editedGrade: grade.EditedGrade) => {
        props.setResult(null);
        grade.updateGrade(gradeId, editedGrade)
            .then((updated) => {
                if (updated) {
                    reset(editedGrade);
                    props.setResult(true);
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
                        <InputLabel id="courseIdLabel">Przedmiot</InputLabel>
                        <Controller
                            name="courseId"
                            control={control}
                            defaultValue={courseId}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'To pole jest wymagane'
                                }
                            }}
                            as={
                                <Select
                                    disabled
                                    labelId="courseIdLabel"
                                    id="courseId"
                                    error={errors.courseId ? true : false}
                                >
                                    <MenuItem key={courseData?.courseId} value={courseData?.courseId}>{courseData?.name}</MenuItem>
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.courseId ? true : false}>{errors.courseId && errors.courseId.message}</FormHelperText>
                    </FormControl>
                </div>
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
                                    {students.map(student =>
                                        <MenuItem key={student.studentId}
                                            value={student.studentId}>{student.firstName + ' ' + student.lastName}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.studentId ? true : false}>{errors.studentId
                            && errors.studentId.message}</FormHelperText>
                    </FormControl>
                </div>

                <div>
                    <FormControl fullWidth className={props.classes.formControl}>
                        <InputLabel id="value">Ocena</InputLabel>
                        <Controller
                            name="value"
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
                                    labelId="value"
                                    id="value"
                                    error={errors.value ? true : false}
                                >
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={2.5}>2.5</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={3.5}>3.5</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={4.5}>4.5</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.value ? true : false}>{errors.value
                            && errors.value.message}</FormHelperText>
                    </FormControl>
                </div>

                <div>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        }}
                        as={
                            <TextField
                                fullWidth
                                id="name"
                                label="Nazwa"
                                type="text"
                                error={errors.name ? true : false}
                                helperText={errors.name && errors.name.message}
                            />
                        }
                    />
                </div>

                <div>
                    <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        }}
                        as={
                            <TextField
                                fullWidth
                                id="description"
                                label="Opis"
                                type="text"
                                multiline
                                error={errors.description ? true : false}
                                helperText={errors.description && errors.description.message}
                            />}
                    />
                </div>


                <div style={{ marginTop: 10 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={props.classes.submit}
                    >
                        Zapisz
                    </Button>
                </div>
            </form>
        </Box>
    );
}