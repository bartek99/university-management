import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as user from '../../../../core/user';
import Title from '../../../Title';
import * as validation from '../../../validation';

interface EditEmployeeFormProps {
    classes: any;
    userId: number;
    setResult: (result: boolean | null) => void;
}

export default function EditEmployeeForm(props: EditEmployeeFormProps) {
    const { handleSubmit, errors, control, setError, getValues, reset } = useForm();

    useEffect(() => {
        let mounted = true;
        user.getEmployee(props.userId)
            .then((employee) => {
                if (mounted && employee) {
                    reset(user.editedEmployee(employee));
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);

    const onSubmit = (editedEmployee: user.EditedEmployee) => {
        props.setResult(null);
        user.userExists(editedEmployee.user.email, props.userId)
            .then((result) => {
                if (result === true) {
                    setError('user.email', { message: 'Użytkownik o tym adresie e-mail już istnieje' })
                } else {
                    user.updateEmployee(props.userId, editedEmployee)
                        .then((admin) => {
                            if (admin) {
                                reset(editedEmployee);
                                props.setResult(true);
                            } else {
                                props.setResult(false);
                            }
                        })
                        .catch((error) => props.setResult(false));
                }
            })
    }
    return (
        <Box width={1 / 4}>
            <form
                className={props.classes.form}
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >
                <Box style={{ marginBottom: 20 }}>
                    <Title>Dane użytkownika</Title>
                    <Controller
                        name="user.email"
                        as={
                            <TextField
                                fullWidth
                                id="user.email"
                                label="Adres e-mail"
                                error={errors.user?.email ? true : false}
                                helperText={errors.user?.email && errors.user?.email.message}
                            />
                        }
                        control={control}
                        defaultValue=""
                        rules={{
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Nieprawidłowy adres e-mail'
                            }
                        }}
                    />
                </Box>

                <Box style={{ marginBottom: 20 }} >
                    <Title>Dane osobowe</Title>
                    <Controller
                        name="firstName"
                        as={
                            <TextField
                                fullWidth
                                id="firstName"
                                label="Imię"
                                type="text"

                                error={errors.firstName ? true : false}
                                helperText={errors.firstName && errors.firstName.message}
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
                        name="lastName"
                        as={
                            <TextField
                                fullWidth
                                id="lastName"
                                label="Nazwisko"
                                type="text"
                                error={errors.lastName ? true : false}
                                helperText={errors.lastName && errors.lastName.message}
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
                        name="birthDate"
                        as={
                            <TextField
                                fullWidth
                                id="birthDate"
                                label="Data urodzenia"
                                type="date"
                                defaultValue={new Date().toISOString().slice(0, 10)}
                                error={errors.birthDate ? true : false}
                                helperText={errors.birthDate && errors.birthDate.message}
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
                        name="pesel"
                        as={
                            <TextField
                                fullWidth
                                id="pesel"
                                label="PESEL"
                                type="text"

                                error={errors.pesel ? true : false}
                                helperText={errors.pesel && errors.pesel.message}
                            />
                        }
                        control={control}
                        defaultValue=""
                        rules={{
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            },
                            validate: {
                                value: (value: string) => validation.validatePesel(value) || 'Nieprawidłowy numer PESEL'
                            }
                        }}
                    />
                    <Controller
                        name="phoneNumber"
                        as={
                            <TextField
                                fullWidth
                                id="phoneNumber"
                                label="Numer telefonu"
                                type="text"
                                error={errors.phoneNumber ? true : false}
                                helperText={errors.phoneNumber && errors.phoneNumber.message}
                            />
                        }
                        control={control}
                        defaultValue=""
                        rules={{
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            },
                            minLength: {
                                value: 9,
                                message: 'Numer telefonu musi składać się z 9 cyfr'
                            },
                            maxLength: {
                                value: 9,
                                message: 'Numer telefonu musi składać się z 9 cyfr'
                            },
                            pattern: {
                                value: /^\d+$/,
                                message: 'Numer telefonu może składać się tylko z cyfr'
                            }
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
                        name="address.flatNumber"
                        as={
                            <TextField
                                fullWidth
                                id="address.flatNumber"
                                label="Numer mieszkania"
                                type="text"
                                error={errors.address?.flatNumber ? true : false}
                                helperText={errors.address?.flatNumber && errors.address?.flatNumber.message}
                            />
                        }
                        control={control}
                        defaultValue=""
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