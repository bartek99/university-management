import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as user from '../../../../core/user';

interface AddAdminFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddAdminForm(props: AddAdminFormProps) {
    const { register, handleSubmit, getValues, errors, setError, reset } = useForm();
    const onSubmit = (newAdmin: user.NewAdmin) => {
        props.setResult(null);
        user.userExists(newAdmin.user.email)
            .then((result) => {
                if (result === true) {
                    setError('user.email', { message: 'Użytkownik o tym adresie e-mail już istnieje' })
                } else {
                    user.addAdmin(newAdmin)
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
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
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