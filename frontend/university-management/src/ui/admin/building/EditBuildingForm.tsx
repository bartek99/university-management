import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as building from '../../../core/building';
import Title from "../../Title";
import * as validation from "../../validation";

interface EditBuildingFormProps {
    classes: any;
    buildingId: number;
    setResult: (result: boolean | null) => void;
}

export default function EditBuildingForm(props: EditBuildingFormProps) {
    const { handleSubmit, errors, control, setError, reset } = useForm();

    useEffect(() => {
        let mounted = true;
        building.getBuilding(props.buildingId)
            .then((building) => {
                if (mounted && building) {
                    reset(building);
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);

    const onSubmit = (editedBuilding: building.EditedBuilding) => {
        props.setResult(null);
        building.updateBuilding(props.buildingId,editedBuilding)
            .then((updated) => {
                if (updated) {
                    reset(editedBuilding);
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
                <Box style={{ marginBottom: 20 }}>
                    <Title>Dane budynku</Title>
                    <Controller
                        name="name"
                        as={
                            <TextField
                                fullWidth
                                id="name"
                                label="Nazwa budynku"
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
                            },
                        }}
                    />
                </Box>

                <Box>
                    <Title>Adres</Title>
                    <Controller
                        name="address.street"
                        as={
                            <TextField
                                fullWidth
                                id="address.street"
                                label="Ulica"
                                type="text"
                                error={errors.address?.street ? true : false}
                                helperText={errors.address?.street && errors.address?.street.message}
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
                        name="address.houseNumber"
                        as={
                            <TextField
                                fullWidth
                                id="address.houseNumber"
                                label="Numer domu"
                                type="text"

                                error={errors.address?.houseNumber ? true : false}
                                helperText={errors.address?.houseNumber && errors.address?.houseNumber.message}
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
                        name="address.postcode"
                        as={
                            <TextField
                                fullWidth
                                id="address.postcode"
                                label="Kod pocztowy"
                                type="text"
                                error={errors.address?.postcode ? true : false}
                                helperText={errors.address?.postcode && errors.address?.postcode.message}
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
                        name="address.city"
                        as={
                            <TextField
                                fullWidth
                                id="address.city"
                                label="Miasto"
                                type="text"
                                error={errors.address?.city ? true : false}
                                helperText={errors.address?.city && errors.address?.city.message}
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
                        name="address.country"
                        as={
                            <TextField
                                fullWidth
                                id="address.country"
                                label="Państwo"
                                type="text"
                                error={errors.address?.country ? true : false}
                                helperText={errors.address?.country && errors.address?.country.message}
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
                </Box>

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