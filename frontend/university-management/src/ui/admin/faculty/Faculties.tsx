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
import * as facultyApi from '../../../core/facultyApi';
import ConfirmationDialog from './../../ConfirmationDialog';
import Title from './../../Title';

interface FacultiesProps {
    classes: any;
}

export default function Faculties(props: FacultiesProps) {
    const [faculties, setFaculties] = useState<{ [key: number]: facultyApi.Faculty }>({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [facultyId, setFacultyId] = useState<number | null>(null)
    const [facultyDeleted, setFacultyDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setFacultyDeleted(null);
        if (facultyId !== null) {
            facultyApi.deleteFaculty(facultyId)
                .then((result) => {
                    if (result) {
                        delete faculties[facultyId];
                        setFaculties({ ...faculties });
                        setFacultyDeleted(result);
                    } else {
                        setFacultyDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;
        facultyApi.getFaculties()
            .then((faculties) => {
                if (mounted) {
                    const facultiesById = faculties.reduce((facultiesById, faculty) => { return { ...facultiesById, [faculty.facultyId]: faculty }; }, {});
                    setFaculties(facultiesById);
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
            <Title>Wydziały</Title>
            <div style={{ marginBottom: 10 }}>
                {facultyDeleted !== null && facultyDeleted === true && <Alert severity="success">Wydział został usunięty.</Alert>}
                {facultyDeleted !== null && facultyDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-faculty">
                        Dodaj wydział
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Wydział</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(faculties).map((faculty) => (
                        <TableRow key={faculty.facultyId}>
                            <TableCell>{faculty.name}</TableCell>
                            <TableCell>
                                <IconButton aria-label="show" component={RouterLink} to={`/admin/show-faculty/${faculty.facultyId}`}>
                                    <ShowIcon />
                                </IconButton>
                                <IconButton aria-label="edit" component={RouterLink} to={`/admin/edit-faculty/${faculty.facultyId}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => {
                                    setFacultyId(faculty.facultyId);
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
