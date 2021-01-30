import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as courseApi from './../../../core/courseApi';
import * as groupApi from './../../../core/groupApi';

interface EditGroupFormProps {
    classes: any;
    groupId: number;
    setResult: (result: boolean | null) => void;
}

export default function EditGroupForm(props: EditGroupFormProps) {
    const { handleSubmit, errors, control, reset } = useForm();

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

    useEffect(() => {
        let mounted = true;
        groupApi.getGroup(props.groupId)
            .then((group) => {
                if (mounted && group) {
                    reset({
                        courseId: group.course.courseId,
                        name: group.name
                    });
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);

    const onSubmit = (editedGroup: groupApi.EditedGroup) => {
        props.setResult(null);
        groupApi.updateGroup(props.groupId, editedGroup)
            .then((updated) => {
                if (updated) {
                    reset(editedGroup);
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