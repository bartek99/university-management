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
import * as auth from '../../../core/auth';
import * as user from '../../../core/user';
import ConfirmationDialog from '../../ConfirmationDialog';
import Title from '../../Title';

function translateUserType(userType: string) {
    switch (userType) {
        case 'Admin':
            return 'Administrator';
        case 'Employee':
            return 'Pracownik';
        case ' Student':
            return 'Student';
        default:
            return userType;
    }
}

interface UserProps {
    classes: any;
}

export default function Users(props: UserProps) {
    const [users, setUsers] = useState<{ [key: number]: user.User }>({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userId, setUserId] = useState<number | null>(null)
    const [userDeleted, setUserDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setUserDeleted(null);
        if (userId !== null) {
            user.deleteUser(userId)
                .then((result) => {
                    if (result) {
                        delete users[userId];
                        setUsers({ ...users });
                        setUserDeleted(result);
                    } else {
                        setUserDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;
        const token = auth.getToken();
        if (token) {
            user.getUsers()
                .then((users) => {
                    if (mounted) {
                        const usersById = users.reduce((usersById, user) => { return { ...usersById, [user.userId]: user }; }, {});
                        setUsers(usersById);
                    }
                })
                .catch((error) => { });
        }

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
            <Title>Użytkownicy</Title>
            <div style={{ marginBottom: 10 }}>
                {userDeleted !== null && userDeleted === true && <Alert severity="success">Użytkownik został usunięty.</Alert>}
                {userDeleted !== null && userDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-admin">
                        Dodaj administratora
                    </Button>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-employee">
                        Dodaj pracownika
                    </Button>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-student">
                        Dodaj studenta
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Typ</TableCell>
                        <TableCell>E-mail</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(users).sort((userA, userB) => userA.userType < userB.userType ? -1 : 1).map((user) => (
                        <TableRow key={user.userId}>
                            <TableCell>{translateUserType(user.userType)}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <IconButton aria-label="show" component={RouterLink} to={`/admin/show-${user.userType.toLowerCase()}/${user.userId}`}>
                                    <ShowIcon />
                                </IconButton>
                                <IconButton aria-label="edit" component={RouterLink} to={`/admin/edit-${user.userType.toLowerCase()}/${user.userId}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => {
                                    setUserId(user.userId);
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
