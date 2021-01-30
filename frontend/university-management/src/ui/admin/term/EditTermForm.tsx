import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as termApi from './../../../core/termApi';

interface EditTermFormProps {
    classes: any;
    termId: number;
    setResult: (result: boolean | null) => void;
}

export default function EditTermForm(props: EditTermFormProps) {
    const { handleSubmit, errors, control, reset } = useForm();

    useEffect(() => {
        let mounted = true;
        termApi.getTerm(props.termId)
            .then((term) => {
                if (mounted && term) {
                    reset(({
                        name: term.name,
                        dateFrom: term.dateFrom,
                        dateTo: term.dateTo
                    }));
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);

    const onSubmit = (editedTerm: termApi.EditedTerm) => {
        props.setResult(null);
        termApi.updateTerm(props.termId, editedTerm)
            .then((updated) => {
                if (updated) {
                    reset(editedTerm);
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
                <Controller
                    name="dateFrom"
                    as={
                        <TextField
                            fullWidth
                            id="dateFrom"
                            label="Od"
                            type="date"
                            defaultValue={new Date().toISOString().slice(0, 10)}
                            error={errors.dateFrom ? true : false}
                            helperText={errors.dateFrom && errors.dateFrom.message}
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
                <Controller
                    name="dateTo"
                    as={
                        <TextField
                            fullWidth
                            id="dateTo"
                            label="Do"
                            type="date"
                            defaultValue={new Date().toISOString().slice(0, 10)}
                            error={errors.dateTo ? true : false}
                            helperText={errors.dateTo && errors.dateTo.message}
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