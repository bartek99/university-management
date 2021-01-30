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
import * as room from '../../../core/room';
import ConfirmationDialog from '../../ConfirmationDialog';
import Title from '../../Title';


interface RoomProps {
    classes: any;
}

export default function Rooms(props: RoomProps) {
    const [rooms, setRooms] = useState<{ [key: number]: room.Room}>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roomId, setRoomId] = useState<number | null>(null)
    const [roomDeleted, setRoomDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setRoomDeleted(null);
        if (roomId !== null) {
            room.deleteRoom(roomId)
                .then((result) => {
                    if (result) {
                        delete rooms[roomId];
                        setRooms({ ...rooms });
                        setRoomDeleted(result);
                    } else {
                        setRoomDeleted(false);
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
            room.getRooms()
                .then((rooms) => {
                    if (mounted) {
                        const roomsById = rooms.reduce((roomsById, room) => {
                            return { ...roomsById, [room.roomId]: room }; }, {});
                        setRooms(roomsById);
                        console.log(roomsById);
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
            <Title>Pokoje</Title>
            <div style={{ marginBottom: 10 }}>
                {roomDeleted !== null && roomDeleted === true && <Alert severity="success">Pokój został usunięty.</Alert>}
                {roomDeleted !== null && roomDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-room">
                        Dodaj pokój
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Numer pokoju</TableCell>
                        <TableCell>Budynek</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(rooms)
                        .sort((roomA, roomB) => roomA.building.name < roomB.building.name ? -1 : 1)
                        .map((room) => (
                            <TableRow key={room.roomId}>
                                <TableCell>{room.number}</TableCell>
                                <TableCell>{room.building.name}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="show" component={RouterLink} to={`/admin/show-room/${room.roomId}`}
                                    >
                                        <ShowIcon />
                                    </IconButton>
                                    <IconButton aria-label="edit" component={RouterLink} to={`/admin/edit-room/${room.roomId}`}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => {
                                        setRoomId(room.roomId);
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
