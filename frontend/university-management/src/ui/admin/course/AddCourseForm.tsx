import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as courseApi from './../../../core/courseApi';
import * as subjectApi from './../../../core/subjectApi';

interface AddCourseFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddCourseForm(props: AddCourseFormProps) {
    const { register, handleSubmit, control, errors, reset } = useForm();

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

    const onSubmit = (newCourse: courseApi.NewCourse) => {
        props.setResult(null);
        courseApi.addCourse(newCourse)
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
                                    {subjects.map(subject=> <MenuItem key={subject.subjectId} value={subject.subjectId}>{subject.name}</MenuItem>)}
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