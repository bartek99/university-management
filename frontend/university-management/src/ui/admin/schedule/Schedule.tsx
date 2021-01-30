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
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import * as scheduleItemApi from '../../../core/scheduleItemApi';
import ConfirmationDialog from './../../ConfirmationDialog';
import Title from './../../Title';

const weightByDay: { [key: string] : number} = {
    'Poniedziałek': 0,
    'Wtorek': 1,
    'Środa': 2,
    'Czwartek': 3,
    'Piątek': 4,
    'Sobota': 5,
    'Niedziela': 6
}

interface ScheduleProps {
    classes: any;
}

export default function Schedule(props: ScheduleProps) {
    const params: any = useParams();
    const groupId = params.groupId;

    const [scheduleItems, setScheduleItems] = useState<{ [key: number]: scheduleItemApi.ScheduleItem }>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [scheduleItemId, setScheduleItemId] = useState<number | null>(null)
    const [scheduleItemDeleted, setScheduleItemDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setScheduleItemDeleted(null);

        if (scheduleItemId !== null) {
            scheduleItemApi.deleteScheduleItem(scheduleItemId)
                .then((result) => {
                    if (result) {
                        delete scheduleItems[scheduleItemId];
                        setScheduleItems({ ...scheduleItems });
                        setScheduleItemDeleted(result);
                    } else {
                        setScheduleItemDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;
        scheduleItemApi.getScheduleItemsByGroupId(groupId)
            .then((scheduleItems) => {
                if (mounted) {
                    const scheduleItemsById = scheduleItems.reduce((scheduleItemsById, scheduleItem) => {
                        return { ...scheduleItemsById, [scheduleItem.scheduleItemId]: scheduleItem };
                    }, {});
                    setScheduleItems(scheduleItemsById);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, [groupId]);

    return (
        <React.Fragment>
            <ConfirmationDialog
                message="Czy na pewno usunąć"
                open={deleteDialogOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />
            <Title>Plan zajęć</Title>
            <div style={{ marginBottom: 10 }}>
                {scheduleItemDeleted !== null && scheduleItemDeleted === true && <Alert severity="success">Zajęcia zostały usunięte.</Alert>}
                {scheduleItemDeleted !== null && scheduleItemDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to={"/admin/show-group/" + groupId + "/add-schedule-item"}>
                        Dodaj zajęcia
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Semestr</TableCell>
                        <TableCell>Tydzień</TableCell>
                        <TableCell>Lokalizacja</TableCell>
                        <TableCell>Dzień</TableCell>
                        <TableCell>Czas od</TableCell>
                        <TableCell>Czas do</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object
                        .values(scheduleItems)
                        .sort((scheduleItemA, scheduleItemB) => scheduleItemA.term.name < scheduleItemB.term.name ? -1 : 1)
                        .sort((scheduleItemA, scheduleItemB) => weightByDay[scheduleItemA.day] < weightByDay[scheduleItemB.day] ? -1 : 1)
                        .map((scheduleItem) => (
                            <TableRow key={scheduleItem.scheduleItemId}>
                                <TableCell>{scheduleItem.term.name}</TableCell>
                                <TableCell>{scheduleItem.week}</TableCell>
                                <TableCell>{`${scheduleItem.room.building.name}/${scheduleItem.room.number}`}</TableCell>
                                <TableCell>{scheduleItem.day}</TableCell>
                                <TableCell>{scheduleItem.timeFrom}</TableCell>
                                <TableCell>{scheduleItem.timeTo}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="edit" component={RouterLink} to={`/admin/show-group/${groupId}/edit-schedule-item/${scheduleItem.scheduleItemId}`}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => {
                                        setScheduleItemId(scheduleItem.scheduleItemId);
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

