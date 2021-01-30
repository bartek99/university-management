import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as auth from './../core/auth';
import * as user from './../core/user';

interface ChangePasswordFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
}

export default function ChangePasswordForm(props: ChangePasswordFormProps) {
    const { register, handleSubmit, getValues, setError, errors, reset } = useForm();
    const onSubmit = (data: ChangePasswordFormData) => {
        props.setResult(null);
        const token = auth.getToken();
        if (token) {
            user.validatePassword(data.currentPassword)
                .then((result) => {
                    if (result === false) {
                        setError('currentPassword', { message: 'Nieprawidłowe hasło.' })
                    } else {
                        const { currentPassword, newPassword, newPasswordConfirmation } = data;
                        user.changePassword(token, currentPassword, newPassword, newPasswordConfirmation).then((result) => {
                            props.setResult(result);
                        });
                        reset();
                    }
                })

        }
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
                        id="currentPassword"
                        name="currentPassword"
                        label="Aktualne hasło"
                        type="password"
                        inputRef={register({ required: true })}
                        error={errors.currentPassword ? true : false}
                        helperText={errors.currentPassword && errors.currentPassword.message}
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="newPassword"
                        name="newPassword"
                        label="Nowe hasło"
                        type="password"
                        inputRef={register({ required: true })}
                        error={errors.newPassword ? true : false}
                        helperText={errors.newPassword && errors.newPassword.message}
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="newPasswordConfirmation"
                        name="newPasswordConfirmation"
                        label="Powtórz nowe hasło"
                        type="password"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            },
                            validate: (value) =>
                                value === getValues('newPassword') || 'Hasła muszą się zgadzać.'
                        })}
                        error={errors.newPasswordConfirmation ? true : false}
                        helperText={errors.newPasswordConfirmation && errors.newPasswordConfirmation.message}
                    />
                </div>
                <div style={{ marginTop: 10 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={props.classes.submit}
                    >
                        Zmień hasło
                        </Button>
                </div>
            </form>
        </Box>
    );
}
