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
import { Link as RouterLink, useParams } from 'react-router-dom';
import * as eventApi from '../../../core/eventApi';
import ConfirmationDialog from './../../ConfirmationDialog';
import Title from './../../Title';

interface EventsProps {
    classes: any;
}

export default function Events(props: EventsProps) {    
    const params = useParams<{ groupId: string }>();
    const groupId = params.groupId;

    const [events, setEvents] = useState<{ [key: number]: eventApi.Event }>({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventId, setEventId] = useState<number | null>(null)
    const [eventDeleted, setEventDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setEventDeleted(null);
        if (eventId !== null) {
            eventApi.deleteEvent(eventId)
                .then((result) => {
                    if (result) {
                        delete events[eventId];
                        setEvents({ ...events });
                        setEventDeleted(result);
                    } else {
                        setEventDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;
        eventApi.getEmployeeEvents()
            .then((events) => {
                if (mounted) {
                    const eventsById = events.reduce((eventsById, event) => { return { ...eventsById, [event.eventId]: event }; }, {});
                    setEvents(eventsById);
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
            <Title>Wydarzenia</Title>
            <div style={{ marginBottom: 10 }}>
                {eventDeleted !== null && eventDeleted === true && <Alert severity="success">Wydarzenie zostało usunięte.</Alert>}
                {eventDeleted !== null && eventDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to={`/employee/add-event`}>
                        Dodaj wydarzenie
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Nazwa</TableCell>
                        <TableCell>Lokalizacja</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Czas od</TableCell>
                        <TableCell>Czas do</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(events).map((event) => (
                        <TableRow key={event.eventId}>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{`${event.room.building.name}/${event.room.number}`}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.timeFrom}</TableCell>
                            <TableCell>{event.timeTo}</TableCell>
                            <TableCell>
                                <IconButton aria-label="edit" component={RouterLink} to={`/employee/events/${event.eventId}/edit`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => {
                                    setEventId(event.eventId);
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

