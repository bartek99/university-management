import Button from '@material-ui/core/Button';
import MuiTextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as auth from './../../core/auth';

interface TextFieldProps {
    id: string;
    label: string;
    type?: string;
    inputRef: any;
}

function TextField(props: TextFieldProps) {
    return <MuiTextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id={props.id}
        label={props.label}
        name={props.id}
        type={props.type}
        inputRef={props.inputRef}
    />
}

interface LoginFormProps {
    classes: any;
    setSuccess: (success: boolean) => void;
    setInvalidCredentials: (invalidCredentials: boolean) => void;
}

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginForm(props: LoginFormProps) {
    useEffect(() => {
        if (auth.isLoggedIn()) {
            props.setSuccess(true);
            props.setInvalidCredentials(false);
        }
    });

    const { register, handleSubmit, reset } = useForm();
    const onSubmit = (data: LoginFormData) => {
        auth
            .login(data.email, data.password)
            .then((loginStatus) => {
                reset({ ...data, password: '' });
                if (loginStatus === auth.LoginStatus.Success) {
                    props.setSuccess(true);
                    props.setInvalidCredentials(false);
                } else if (loginStatus === auth.LoginStatus.InvalidCredentials) {
                    props.setSuccess(false);
                    props.setInvalidCredentials(true);
                }
            })
            .catch((error) => {
                // TODO: Handle error
            });
    }

    return (
        <form
            className={props.classes.form}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
        >
            <TextField id="email" label="Adres e-mail" inputRef={register} />
            <TextField id="password" label="Hasło" type="password" inputRef={register} />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={props.classes.submit}
            >
                Zaloguj się
          </Button>
        </form>
    );
}
