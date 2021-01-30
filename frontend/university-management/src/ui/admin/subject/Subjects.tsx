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
import * as subjectApi from '../../../core/subjectApi';
import ConfirmationDialog from './../../ConfirmationDialog';
import Title from './../../Title';

interface SubjectsProps {
    classes: any;
}

export default function Subjects(props: SubjectsProps) {
    const [subjects, setSubjects] = useState<{ [key: number]: subjectApi.Subject }>({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [subjectId, setSubjectId] = useState<number | null>(null)
    const [subjectDeleted, setSubjectDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setSubjectDeleted(null);
        if (subjectId !== null) {
            subjectApi.deleteSubject(subjectId)
                .then((result) => {
                    if (result) {
                        delete subjects[subjectId];
                        setSubjects({ ...subjects });
                        setSubjectDeleted(result);
                    } else {
                        setSubjectDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;
        subjectApi.getSubjects()
            .then((subjects) => {
                if (mounted) {
                    const subjectsById = subjects.reduce((subjectsById, subject) => { return { ...subjectsById, [subject.subjectId]: subject }; }, {});
                    setSubjects(subjectsById);
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
            <Title>Kierunki</Title>
            <div style={{ marginBottom: 10 }}>
                {subjectDeleted !== null && subjectDeleted === true && <Alert severity="success">Kierunek został usunięty.</Alert>}
                {subjectDeleted !== null && subjectDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-subject">
                        Dodaj kierunek
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Kierunek</TableCell>
                        <TableCell>Wydział</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(subjects).sort((subjectA, subjectB) => subjectA.faculty.name < subjectB.faculty.name ? -1 : 1).map((subject) => (
                        <TableRow key={subject.subjectId}>
                            <TableCell>{subject.name}</TableCell>
                            <TableCell>{subject.faculty.name}</TableCell>
                            <TableCell>
                                <IconButton aria-label="show" component={RouterLink} to={`/admin/show-subject/${subject.subjectId}`}>
                                    <ShowIcon />
                                </IconButton>
                                <IconButton aria-label="edit" component={RouterLink} to={`/admin/edit-subject/${subject.subjectId}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => {
                                    setSubjectId(subject.subjectId);
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
