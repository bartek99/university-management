import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeContext } from '../../../theme-context';
import Title from '../../../Title';
import EditAdminForm from './EditAdminForm';

export default function EditAdminPage() {
    const context = useContext(ThemeContext);
    const params: any = useParams();
    const userId: number = params.userId;

    const [result, setResult] = useState<boolean | null>(null);

    return (
        <Container maxWidth="lg" className={context.classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={context.classes.paper}>
                        <Title>Edycja administratora</Title>
                        <div style={{ marginBottom: 10 }}>
                            {result !== null && result === true && <Alert severity="success">Administrator został zedytowany pomyślnie.</Alert>}
                            {result !== null && result === false && <Alert severity="error">Nieprawidłowe dane.</Alert>}
                        </div>
                        <EditAdminForm classes={context.classes} userId={userId} setResult={setResult} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}