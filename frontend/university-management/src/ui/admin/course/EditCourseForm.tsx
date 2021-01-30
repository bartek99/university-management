import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as courseApi from './../../../core/courseApi';
import * as subjectApi from './../../../core/subjectApi';

interface EditCourseFormProps {
    classes: any;
    courseId: number;
    setResult: (result: boolean | null) => void;
}

export default function EditCourseForm(props: EditCourseFormProps) {
    const { handleSubmit, errors, control, reset } = useForm();

    const [subjects, setSubjects] = React.useState<subjectApi.Subject[]>([]);
    useEffect(() => {
        let mounted = true;
        subjectApi.getSubjects()
            .then((subjects) => {
                if (mounted) {
                    setSubjects(subjects);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        courseApi.getCourse(props.courseId)
            .then((course) => {
                if (mounted && course) {
                    reset({
                        subjectId: course.subject.subjectId,
                        name: course.name
                    });
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);

    const onSubmit = (editedCourse: courseApi.EditedCourse) => {
        props.setResult(null);
        courseApi.updateCourse(props.courseId, editedCourse)
            .then((updated) => {
                if (updated) {
                    reset(editedCourse);
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
                        <InputLabel id="subjectIdLabel">Kierunek</InputLabel>
                        <Controller
                            name="subjectId"
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
                                    labelId="subjectIdLabel"
                                    id="subjectId"
                                    error={errors.subjectId ? true : false}
                                >
                                    {subjects.map(subject => <MenuItem key={subject.subjectId} value={subject.subjectId}>{subject.name}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.subjectId ? true : false}>{errors.subjectId && errors.subjectId.message}</FormHelperText>
                    </FormControl>
                </div>
                <Controller
                    name="name"
                    as={
                        <TextField
                            fullWidth
                            id="name"
                            label="Nazwa"
                            error={errors.name ? true : false}
                            helperText={errors.name && errors.name.message}
                        />
                    }
                    control={control}
                    defaultValue=""
                    rules={{
                        required: {
                            value: true,
                            message: 'To pole jest wymagane'
                        }
                    }}
                />
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