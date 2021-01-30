import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as user from '../../../../core/user';

interface EditAdminFormProps {
    classes: any;
    userId: number;
    setResult: (result: boolean | null) => void;
}

export default function EditAdminForm(props: EditAdminFormProps) {
    const { handleSubmit, errors, control, setError, reset } = useForm();

    useEffect(() => {
        let mounted = true;
        user.getAdmin(props.userId)
            .then((admin) => {
                if (mounted && admin) {
                    reset(user.editedAdmin(admin));
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);

    const onSubmit = (editedAdmin: user.EditedAdmin) => {
        props.setResult(null);
        user.userExists(editedAdmin.user.email, props.userId)
            .then((result) => {
                if (result === true) {
                    setError('user.email', { message: 'Użytkownik o tym adresie e-mail już istnieje' })
                } else {
                    user.updateAdmin(props.userId, editedAdmin)
                        .then((admin) => {
                            if (admin) {
                                reset(editedAdmin);
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