import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as groupApi from './../../../core/groupApi';
import * as scheduleItemApi from './../../../core/scheduleItemApi';
import * as termApi from './../../../core/termApi';
import * as room from './../../../core/room';

interface AddScheduleItemFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddScheduleItemForm(props: AddScheduleItemFormProps) {
    const params: any = useParams();
    const groupId = params.groupId;

    const { handleSubmit, control, errors, reset } = useForm();

    const [group, setGroup] = React.useState<groupApi.Group | null>(null);
    const [terms, setTerms] = React.useState<termApi.Term[]>([]);
    const [rooms, setRooms] = React.useState<room.Room[]>([]);
    const weeks = scheduleItemApi.weeks();
    const days = scheduleItemApi.days();

    useEffect(() => {
        let mounted = true;
        Promise.all([
            groupApi.getGroup(groupId),
            termApi.getTerms(),
            room.getRooms()
        ]).then((result: any) => {
            const [group, terms, rooms] = result;
            if (mounted && group && terms && rooms) {
                setGroup(group);
                setTerms(terms);
                setRooms(rooms);
            }
        });

        return () => {
            mounted = false
        }
    }, [groupId]);

    const onSubmit = (scheduleItem: scheduleItemApi.NewScheduleItem) => {
        props.setResult(null);
        scheduleItemApi.addScheduleItem(scheduleItem)
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
                            defaultValue={groupId}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'To pole jest wymagane'
                                }
                            }}
                            as={
                                <Select
                                    disabled
                                    labelId="groupIdLabel"
                                    id="groupId"
                                    error={errors.groupId ? true : false}
                                >
                                    <MenuItem key={group?.groupId} value={group?.groupId}>{group?.name}</MenuItem>
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.termId ? true : false}>{errors.termId && errors.termId.message}</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth className={props.classes.formControl}>
                        <InputLabel id="termIdLabel">Semestr</InputLabel>
                        <Controller
                            name="termId"
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
                                    labelId="termIdLabel"
                                    id="termId"
                                    error={errors.termId ? true : false}
                                >
                                    {terms.map(term => <MenuItem key={term.termId} value={term.termId}>{term.name}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.termId ? true : false}>{errors.termId && errors.termId.message}</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth className={props.classes.formControl}>
                        <InputLabel id="roomIdLabel">Lokalizacja</InputLabel>
                        <Controller
                            name="roomId"
                            control={control}
                            defaultValue=""
                            as={
                                <Select
                                    labelId="roomIdLabel"
                                    id="roomId"
                                    error={errors.termId ? true : false}
                                >
                                    {rooms.map(room => <MenuItem key={room.roomId} value={room.roomId}>{`${room.building.name}/${room.number}`}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.termId ? true : false}>{errors.termId && errors.termId.message}</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth className={props.classes.formControl}>
                        <InputLabel id="weekLabel">Tydzień</InputLabel>
                        <Controller
                            name="week"
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
                                    labelId="weekLabel"
                                    id="week"
                                    error={errors.week ? true : false}
                                >
                                    {weeks.map(week => <MenuItem key={week} value={week}>{week}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.week ? true : false}>{errors.week && errors.week.message}</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth className={props.classes.formControl}>
                        <InputLabel id="dayLabel">Dzień</InputLabel>
                        <Controller
                            name="day"
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
                                    labelId="dayLabel"
                                    id="day"
                                    error={errors.day ? true : false}
                                >
                                    {days.map(day => <MenuItem key={day} value={day}>{day}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.day ? true : false}>{errors.day && errors.day.message}</FormHelperText>
                    </FormControl>
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
        </Box >
    );
}