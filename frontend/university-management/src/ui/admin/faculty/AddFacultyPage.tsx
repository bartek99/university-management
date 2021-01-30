import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import React, { useContext, useState } from 'react';
import Title from '../../Title';
import { ThemeContext } from '../../theme-context';
import AddFacultyForm from './AddFacultyForm';

export default function AddFacultyPage() {
    const context = useContext(ThemeContext);

    const [result, setResult] = useState<boolean | null>(null);

    return (
        <Container maxWidth="lg" className={context.classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={context.classes.paper}>
                        <Title>Dodawanie wydziału</Title>
                        <div style={{ marginBottom: 10 }}>
                            {result !== null && result === true && <Alert severity="success">Wydział został dodany.</Alert>}
                            {result !== null && result === false && <Alert severity="error">Nieprawidłowe dane.</Alert>}
                        </div>
                        <AddFacultyForm classes={context.classes} setResult={setResult} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}