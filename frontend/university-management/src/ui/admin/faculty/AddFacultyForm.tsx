import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as facultyApi from './../../../core/facultyApi';

interface AddFacultyFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddFacultyForm(props: AddFacultyFormProps) {
    const { register, handleSubmit, getValues, errors, setError, reset } = useForm();
    const onSubmit = (newFaculty: facultyApi.NewFaculty) => {
        props.setResult(null);
        facultyApi.addFaculty(newFaculty)
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