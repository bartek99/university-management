import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Faculty } from '../../../core/facultyApi';
import * as subjectApi from '../../../core/subjectApi';
import * as facultyApi from '../../../core/facultyApi';

interface EditSubjectFormProps {
    classes: any;
    subjectId: number;
    setResult: (result: boolean | null) => void;
}

export default function EditCourseForm(props: EditSubjectFormProps) {
    const { handleSubmit, errors, control, reset } = useForm();

    const [faculties, setFaculties] = React.useState<Faculty[]>([]);
    useEffect(() => {
        let mounted = true;
        facultyApi.getFaculties()
            .then((faculties) => {
                if (mounted) {
                    setFaculties(faculties);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        subjectApi.getSubject(props.subjectId)
            .then((subject) => {
                if (mounted && subject) {
                    reset({
                        facultyId: subject.faculty.facultyId,
                        name: subject.name
                    });
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);

    const onSubmit = (editedSubject: subjectApi.EditedSubject) => {
        props.setResult(null);
        subjectApi.updateSubject(props.subjectId, editedSubject)
            .then((updated) => {
                if (updated) {
                    reset(editedSubject);
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
                        <InputLabel id="facultyIdLabel">Wydział</InputLabel>
                        <Controller
                            name="facultyId"
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'To pole jest wymagane'
                                }
                            }}
                            defaultValue=""
                            as={
                                <Select
                                    labelId="facultyIdLabel"
                                    id="facultyId"
                                    error={errors.facultyId ? true : false}
                                >
                                    {faculties.map(faculty => <MenuItem key={faculty.facultyId} value={faculty.facultyId}>{faculty.name}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.facultyId ? true : false}>{errors.facultyId && errors.facultyId.message}</FormHelperText>
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