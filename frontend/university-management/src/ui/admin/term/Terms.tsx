import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ShowIcon from '@material-ui/icons/Visibility';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as termApi from './../../../core/termApi';
import ConfirmationDialog from './../../ConfirmationDialog';
import Title from './../../Title';

interface TermsProps {
    classes: any;
}

export default function Terms(props: TermsProps) {
    const [terms, setTerms] = useState<{ [key: number]: termApi.Term }>({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [termId, setTermId] = useState<number | null>(null)
    const [termDeleted, setTermDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setTermDeleted(null);
        if (termId !== null) {
            termApi.deleteTerm(termId)
                .then((result) => {
                    if (result) {
                        delete terms[termId];
                        setTerms({ ...terms });
                        setTermDeleted(result);
                    } else {
                        setTermDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;
        termApi.getTerms()
            .then((terms) => {
                if (mounted) {
                    const termsById = terms.reduce((termsById, term) => { return { ...termsById, [term.termId]: term }; }, {});
                    setTerms(termsById);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    return (
        <React.Fragment>
            <ConfirmationDialog
                message="Czy na pewno usunąć"
                open={deleteDialogOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />
            <Title>Semestry</Title>
            <div style={{ marginBottom: 10 }}>
                {termDeleted !== null && termDeleted === true && <Alert severity="success">Semestr został usunięty.</Alert>}
                {termDeleted !== null && termDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-term">
                        Dodaj semestr
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Semestr</TableCell>
                        <TableCell>Od</TableCell>
                        <TableCell>Do</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(terms).map((term) => (
                        <TableRow key={term.termId}>
                            <TableCell>{term.name}</TableCell>
                            <TableCell>{term.dateFrom}</TableCell>
                            <TableCell>{term.dateTo}</TableCell>
                            <TableCell>
                                <IconButton aria-label="show" component={RouterLink} to={`/admin/show-term/${term.termId}`}>
                                    <ShowIcon />
                                </IconButton>
                                <IconButton aria-label="edit" component={RouterLink} to={`/admin/edit-term/${term.termId}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => {
                                    setTermId(term.termId);
                                    setDeleteDialogOpen(true);
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment >
    );
}
