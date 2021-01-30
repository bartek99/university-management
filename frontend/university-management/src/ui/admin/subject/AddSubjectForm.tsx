import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Faculty } from '../../../core/facultyApi';
import * as facultyApi from './../../../core/facultyApi';
import * as subjectApi from './../../../core/subjectApi';

interface AddSubjectFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddSubjectForm(props: AddSubjectFormProps) {
    const { register, handleSubmit, control, errors, reset } = useForm();

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

    const onSubmit = (newSubject: subjectApi.NewSubject) => {
        props.setResult(null);
        subjectApi.addSubject(newSubject)
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
                        <InputLabel id="facultyIdLabel">Wydział</InputLabel>
                        <Controller
                            name="facultyId"
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
                        helperText={errors.name && errors.name.message}
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