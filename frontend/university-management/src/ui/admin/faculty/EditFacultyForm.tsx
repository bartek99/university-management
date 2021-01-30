import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as facultyApi from '../../../core/facultyApi';

interface EditFacultyFormProps {
    classes: any;
    facultyId: number;
    setResult: (result: boolean | null) => void;
}

export default function EditFacultyForm(props: EditFacultyFormProps) {
    const { handleSubmit, errors, control, setError, reset } = useForm();

    useEffect(() => {
        let mounted = true;
        facultyApi.getFaculty(props.facultyId)
            .then((faculty) => {
                if (mounted && faculty) {
                    reset(faculty);
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);

    const onSubmit = (editedFaculty: facultyApi.EditedFaculty) => {
        props.setResult(null);
        facultyApi.updateFaculty(props.facultyId, editedFaculty)
            .then((updated) => {
                if (updated) {
                    reset(editedFaculty);
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