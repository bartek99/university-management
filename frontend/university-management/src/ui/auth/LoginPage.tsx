import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import LoginForm from './LoginForm';

const useStyles = makeStyles(({ palette, spacing }: Theme) => createStyles({
  paper: {
    marginTop: spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: spacing(1),
    backgroundColor: palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: spacing(1),
  },
  submit: {
    margin: spacing(3, 0, 2),
  },
}));

export default function LoginPage() {
  const classes = useStyles();

  const [success, setSuccess] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  if (success) {
    return <Redirect to="/" />
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Logowanie
        </Typography>
          {invalidCredentials && <Alert severity="error">Nieprawidłowy e-mail lub hasło.</Alert>}
          <LoginForm classes={classes} setSuccess={setSuccess} setInvalidCredentials={setInvalidCredentials} />
        </div>
      </Container>
    );
  }
}
