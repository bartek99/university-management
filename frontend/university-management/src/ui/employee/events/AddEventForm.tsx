import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as eventApi from './../../../core/eventApi';
import * as groupApi from './../../../core/groupApi';
import * as room from './../../../core/room';

interface AddEventFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddFacultyForm(props: AddEventFormProps) {
    const { control, errors, handleSubmit, watch, reset } = useForm();
    const onSubmit = (newEvent: eventApi.NewEvent) => {
        props.setResult(null);
        eventApi.addEvent(newEvent)
            .then((result) => {
                if (result === null) {
                    props.setResult(false);
                } else {
                    props.setResult(true);
                    reset();
                }
            })
            .catch((error) => props.setResult(false));
    }

    const [groups, setGroups] = React.useState<groupApi.Group[]>([]);
    const [rooms, setRooms] = React.useState<room.Room[]>([]);

    const { date, timeFrom, timeTo } = watch();

    useEffect(() => {
        let mounted = true;
        Promise.all([
            groupApi.getMyEmployeeGroups(),
            room.getAvailableRooms(date, timeFrom, timeTo)
        ]).then((result) => {
            const [groups, rooms] = result;
            if (mounted) {
                setGroups(groups);
                setRooms(rooms);
            }
        });

        return () => {
            mounted = false
        }
    }, [date, timeFrom, timeTo]);

    return (
        <Box width={1 / 4}>
            <form
                className={props.classes.form}
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <FormControl fullWidth className={props.classes.formControl}>
                        <InputLabel id="groupIdLabel">Grupa</InputLabel>
                        <Controller
                            name="groupId"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: {
                                    value: true,
                                    message: 'To pole jest wymagane'
                                }
                            }}
                            as={
                                <Select
                                    labelId="groupIdLabel"
                                    id="groupId"
                                    error={errors.subjectId ? true : false}
                                >
                                    {groups.map(group => <MenuItem
                                        key={group.groupId}
                                        value={group.groupId}>{group.name}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.groupId ? true : false}>{errors.groupId && errors.groupId.message}</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth className={props.classes.formControl}>
                        <InputLabel id="roomIdLabel">Lokalizacja</InputLabel>
                        <Controller
                            name="roomId"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: {
                                    value: true,
                                    message: 'To pole jest wymagane'
                                }
                            }}
                            as={
                                <Select
                                    labelId="roomIdLabel"
                                    id="roomId"
                                    error={errors.roomId ? true : false}
                                >
                                    {rooms.map(room => <MenuItem
                                        key={room.roomId}
                                        value={room.roomId}>{room.building.name}/{room.number}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.roomId ? true : false}>{errors.roomId && errors.roomId.message}</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <Controller
                        name="name"
                        as={
                            <TextField
                                fullWidth
                                id="name"
                                label="Nazwa"
                                error={errors.name ? true : false}
                                helperText={errors.name && errors.name.message}
                            />
                        }
                        control={control}
                        defaultValue=""
                        rules={{
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        }}
                    />
                </div>
                <div>
                    <Controller
                        name="date"
                        as={
                            <TextField
                                fullWidth
                                id="date"
                                name="date"
                                label="Data"
                                type="date"
                                error={errors.date ? true : false}
                                helperText={errors.date && errors.date.message}
                            />}
                        control={control}
                        defaultValue={new Date().toISOString().slice(0, 10)}
                        rules={{
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        }}
                    />
                </div>
                <div>
                    <Controller
                        name="timeFrom"
                        as={
                            <TextField
                                fullWidth
                                id="timeFrom"
                                label="Czas od"
                                type="time"
                                error={errors.timeFrom ? true : false}
                                helperText={errors.timeFrom && errors.timeFrom.message}
                            />
                        }
                        control={control}
                        defaultValue="12:00"
                        rules={{
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        }}
                    />
                </div>
                <div>
                    <Controller
                        name="timeTo"
                        as={
                            <TextField
                                fullWidth
                                id="timeTo"
                                label="Czas do"
                                type="time"
                                error={errors.timeTo ? true : false}
                                helperText={errors.timeTo && errors.timeTo.message}
                            />
                        }
                        control={control}
                        defaultValue="12:00"
                        rules={{
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        }}
                    />
                </div>
                <div style={{ marginTop: 10 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={props.classes.submit}
                    >
                        Dodaj
                    </Button>
                </div>
            </form>
        </Box>
    );
}