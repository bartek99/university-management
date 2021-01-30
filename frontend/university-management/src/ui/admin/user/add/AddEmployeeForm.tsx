import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as user from '../../../../core/user';
import Title from '../../../Title';
import * as validation from '../../../validation';

interface AddEmployeeFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddEmployeeForm(props: AddEmployeeFormProps) {
    const { register, handleSubmit, getValues, errors, setError, reset } = useForm();
    const onSubmit = (newEmployee: user.NewEmployee) => {
        props.setResult(null);
        user.userExists(newEmployee.user.email)
            .then((result) => {
                if (result === true) {
                    setError('user.email', { message: 'Użytkownik o tym adresie e-mail już istnieje' })
                } else {
                    user.addEmployee(newEmployee)
                        .then((result) => {
                            props.setResult(true);
                            reset();
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
                    <TextField
                        fullWidth
                        id="user.email"
                        name="user.email"
                        label="Adres e-mail"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Nieprawidłowy adres e-mail'
                            }
                        })}
                        error={errors.user?.email ? true : false}
                        helperText={errors.user?.email && errors.user?.email.message}
                    />
                    <TextField
                        fullWidth
                        id="user.password"
                        name="user.password"
                        label="Hasło"
                        type="password"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.user?.password ? true : false}
                        helperText={errors.user?.password && errors.user?.password.message}
                    />
                    <TextField
                        fullWidth
                        id="user.passwordConfirmation"
                        name="user.passwordConfirmation"
                        label="Powtórz hasło"
                        type="password"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            },
                            validate: (value) =>
                                value === getValues('user.password') || 'Hasła muszą się zgadzać.'
                        })}
                        error={errors.user?.passwordConfirmation ? true : false}
                        helperText={errors.user?.passwordConfirmation && errors.user?.passwordConfirmation.message}
                    />
                </Box>

                <Box style={{ marginBottom: 20 }} >
                    <Title>Dane osobowe</Title>
                    <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        label="Imię"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.firstName ? true : false}
                        helperText={errors.firstName && errors.firstName.message}
                    />
                    <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        label="Nazwisko"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.lastName ? true : false}
                        helperText={errors.lastName && errors.lastName.message}
                    />
                    <TextField
                        fullWidth
                        id="birthDate"
                        name="birthDate"
                        label="Data urodzenia"
                        type="date"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.birthDate ? true : false}
                        helperText={errors.birthDate && errors.birthDate.message}
                    />
                    <TextField
                        fullWidth
                        id="pesel"
                        name="pesel"
                        label="PESEL"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            },
                            validate: {
                                value: (value: string) => validation.validatePesel(value) || 'Nieprawidłowy numer PESEL'
                            }
                        })}
                        error={errors.pesel ? true : false}
                        helperText={errors.pesel && errors.pesel.message}
                    />
                    <TextField
                        fullWidth
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Numer telefonu"
                        type="text"
                        inputRef={register({
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
                        })}
                        error={errors.phoneNumber ? true : false}
                        helperText={errors.phoneNumber && errors.phoneNumber.message}
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
                        id="address.flatNumber"
                        name="address.flatNumber"
                        label="Numer mieszkania"
                        type="text"
                        error={errors.address?.flatNumber ? true : false}
                        helperText={errors.address?.flatNumber && errors.address?.flatNumber.message}
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