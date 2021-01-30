import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as courseApi from './../../../core/courseApi';
import * as groupApi from './../../../core/groupApi';

interface AddGroupFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddGroupForm(props: AddGroupFormProps) {
    const { register, handleSubmit, control, errors, reset } = useForm();
    
    const [courses, setCourses] = React.useState<courseApi.Course[]>([]);
    useEffect(() => {
        let mounted = true;
        courseApi.getCourses()
            .then((courses) => {
                if (mounted) {
                    setCourses(courses);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    const onSubmit = (newGroup: groupApi.NewGroup) => {
        props.setResult(null);
        groupApi.addGroup(newGroup)
            .then((result) => {
                if (result === null) {
                    props.setResult(false);
                } else {
                    props.setResult(true);
                    reset();
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
                            defaultValue=""
                            rules={{
                                required: {
                                    value: true,
                                    message: 'To pole jest wymagane'
                                }
                            }}
                            as={
                                <Select
                                    labelId="courseIdLabel"
                                    id="courseId"
                                    error={errors.subjectId ? true : false}
                                >
                                    {courses.map(course => <MenuItem key={course.courseId} value={course.courseId}>{course.subject.name} / {course.name}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.subjectId ? true : false}>{errors.subjectId && errors.subjectId.message}</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Nazwa"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.name ? true : false}
                        helperText={errors.name && errors.name}
                    />
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