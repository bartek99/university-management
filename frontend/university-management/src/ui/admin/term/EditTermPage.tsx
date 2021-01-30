import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeContext } from './../../theme-context';
import Title from './../../Title';
import EditTermForm from './EditTermForm';

export default function EditCoursePage() {
    const context = useContext(ThemeContext);
    const params: any = useParams();
    const termId: number = params.termId;

    const [result, setResult] = useState<boolean | null>(null);

    return (
        <Container maxWidth="lg" className={context.classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={context.classes.paper}>
                        <Title>Edycja semestru</Title>
                        <div style={{ marginBottom: 10 }}>
                            {result !== null && result === true && <Alert severity="success">Semestr został zedytowany pomyślnie.</Alert>}
                            {result !== null && result === false && <Alert severity="error">Nieprawidłowe dane.</Alert>}
                        </div>
                        <EditTermForm classes={context.classes} termId={termId} setResult={setResult} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}