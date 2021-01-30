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
import * as groupApi from '../../../core/groupApi';
import ConfirmationDialog from './../../ConfirmationDialog';
import Title from './../../Title';

interface GroupsProps {
    classes: any;
}

export default function Groups(props: GroupsProps) {
    const [groups, setGroups] = useState<{ [key: number]: groupApi.Group }>({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [groupId, setGroupId] = useState<number | null>(null)
    const [groupDeleted, setGroupDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setGroupDeleted(null);
        if (groupId !== null) {
            groupApi.deleteGroup(groupId)
                .then((result) => {
                    if (result) {
                        delete groups[groupId];
                        setGroups({ ...groups });
                        setGroupDeleted(result);
                    } else {
                        setGroupDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;
        groupApi.getGroups()
            .then((groups) => {
                if (mounted) {
                    const groupsById = groups.reduce((groupsById, group) => { return { ...groupsById, [group.groupId]: group }; }, {});
                    setGroups(groupsById);
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
            <Title>Grupy</Title>
            <div style={{ marginBottom: 10 }}>
                {groupDeleted !== null && groupDeleted === true && <Alert severity="success">Przedmiot został usunięty.</Alert>}
                {groupDeleted !== null && groupDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-group">
                        Dodaj grupę
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Grupa</TableCell>
                        <TableCell>Przedmiot</TableCell>
                        <TableCell>Kierunek</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(groups).sort((groupA, groupB) => groupA.course.name < groupB.course.name ? -1 : 1).map((group) => (
                        <TableRow key={group.groupId}>
                            <TableCell>{group.name}</TableCell>
                            <TableCell>{group.course.name}</TableCell>
                            <TableCell>{group.course.subject.name}</TableCell>
                            <TableCell>
                                <IconButton aria-label="show" component={RouterLink} to={`/admin/show-group/${group.groupId}`}>
                                    <ShowIcon />
                                </IconButton>
                                <IconButton aria-label="edit" component={RouterLink} to={`/admin/edit-group/${group.groupId}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => {
                                    setGroupId(group.groupId);
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
