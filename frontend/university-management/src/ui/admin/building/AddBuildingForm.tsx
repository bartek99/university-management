import {Box, Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as building from './../../../core/building';
import Title from '../../Title';
import * as validation from '../../validation';

interface AddBuildingFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddBuildingForm(props: AddBuildingFormProps) {
    const { register, handleSubmit, getValues, errors, setError, reset } = useForm();
    const onSubmit = (newBuilding: building.NewBuilding) => {
        props.setResult(null);
        building.addBuilding(newBuilding)
        .then((result) => {
            props.setResult(true);
            reset();
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
                <Box style={{ marginBottom: 20 }}>
                    <Title>Dodawanie budynku</Title>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Nazwa budynku"
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

                </Box>

                <Box>
                    <Title>Adres</Title>
                    <TextField
                        fullWidth
                        id="address.street"
                        name="address.street"
                        label="Ulica"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.address?.street ? true : false}
                        helperText={errors.address?.street && errors.address?.street.message}
                    />

                    <TextField
                        fullWidth
                        id="address.houseNumber"
                        name="address.houseNumber"
                        label="Numer domu"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.address?.houseNumber ? true : false}
                        helperText={errors.address?.houseNumber && errors.address?.houseNumber.message}
                    />
                    <TextField
                        fullWidth
                        id="address.postcode"
                        name="address.postcode"
                        label="Kod pocztowy"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.address?.postcode ? true : false}
                        helperText={errors.address?.postcode && errors.address?.postcode.message}
                    />
                    <TextField
                        fullWidth
                        id="address.city"
                        name="address.city"
                        label="Miasto"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.address?.city ? true : false}
                        helperText={errors.address?.city && errors.address?.city.message}
                    />
                    <TextField
                        fullWidth
                        id="address.country"
                        name="address.country"
                        label="Państwo"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.address?.country ? true : false}
                        helperText={errors.address?.country && errors.address?.country.message}
                    />
                </Box>

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