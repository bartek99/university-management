import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as termApi from './../../../core/termApi';

interface AddTermFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddTermForm(props: AddTermFormProps) {
    const { register, handleSubmit, errors, reset } = useForm();
    const onSubmit = (newTerm: termApi.NewTerm) => {
        props.setResult(null);
        termApi.addTerm(newTerm)
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
                <div>
                    <TextField
                        fullWidth
                        id="dateFrom"
                        name="dateFrom"
                        label="Od"
                        type="date"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.dateFrom ? true : false}
                        helperText={errors.dateFrom && errors.dateFrom.message}
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="dateTo"
                        name="dateTo"
                        label="Do"
                        type="date"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.dateTo ? true : false}
                        helperText={errors.dateTo && errors.dateTo.message}
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