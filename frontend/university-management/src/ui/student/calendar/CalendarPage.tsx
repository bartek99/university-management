import { ViewState } from '@devexpress/dx-react-scheduler';
import { Appointments, AppointmentTooltip, DateNavigator, Scheduler, Toolbar, WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import { Container, Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Console } from 'console';
import React, { useContext, useEffect, useState } from 'react';
import * as meApi from '../../../core/meApi';
import * as scheduleItemApi from '../../../core/scheduleItemApi';
import { ThemeContext } from '../../theme-context';
import * as eventApi from './../../../core/eventApi';

const useStyles = makeStyles(theme => ({
    todayCell: {
        backgroundColor: fade(theme.palette.primary.main, 0.1),
        '&:hover': {
            backgroundColor: fade(theme.palette.primary.main, 0.14),
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.primary.main, 0.16),
        },
    },
    weekendCell: {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        '&:hover': {
            backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
    },
    today: {
        backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
    weekend: {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
    },
}));

function mapDay(day: string) {
    switch (day) {
        case 'Poniedziałek':
            return 'MO';
        case 'Wtorek':
            return 'TU';
        case 'Środa':
            return 'WE';
        case 'Czwartek':
            return 'TH';
        case 'Piątek':
            return 'FR';
        case 'Sobota':
            return 'SA';
        case 'Niedziela':
            return 'SU';

    }
}

function createScheduleDataFromEvent(event: eventApi.Event): ScheduleData {
    const [year, month, day] = event.date.split('-');
    const [hourFrom, minuteFrom] = event.timeFrom.split(':');
    const [hourTo, minuteTo] = event.timeTo.split(':');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hourFrom), parseInt(minuteFrom));
    const endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hourTo), parseInt(minuteTo));
     return {
        title: `${event.name} / ${event.room.building.name} / ${event.room.number}`,
        rRule: undefined,
        startDate,
        endDate
    }
}

function createScheduleData(scheduledItem: scheduleItemApi.ScheduleItem): ScheduleData {
    const format = (n: string) => (`0${n}`).slice(-2);
    const [yearTo, monthTo, dayTo] = scheduledItem.term.dateTo.split('-');
    const until = `${yearTo}${format(monthTo)}${format(dayTo)}`;
    const [yearFrom, monthFrom, dayFrom] = scheduledItem.term.dateFrom.split('-');
    const [hourFrom, minuteFrom] = scheduledItem.timeFrom.split(':');
    const [hourTo, minuteTo] = scheduledItem.timeTo.split(':');

    const dayShift = scheduledItem.week === 'Parzysty' ? 7 : 0;
    const startDate = new Date(parseInt(yearFrom), parseInt(monthFrom) - 1, parseInt(dayFrom) + dayShift, parseInt(hourFrom), parseInt(minuteFrom));
    const endDate = new Date(parseInt(yearFrom), parseInt(monthFrom) - 1, parseInt(dayFrom) + dayShift, parseInt(hourTo), parseInt(minuteTo));
    const interval = scheduledItem.week !== 'Parzysty i Nieparzysty' ? 2 : 1;

    return {
        title: `${scheduledItem.group.course.name} / ${scheduledItem.room.building.name} / ${scheduledItem.room.number}`,
        rRule: `FREQ=WEEKLY;UNTIL=${until};WKST=MO;BYDAY=${mapDay(scheduledItem.day)};INTERVAL=${interval}`,
        startDate: startDate,
        endDate: endDate
    }
}

interface ScheduleData {
    title: string,
    rRule: string | undefined,
    startDate: Date,
    endDate: Date,
}

const TimeTableCell = (props: any) => {
    const classes = useStyles();
    const { startDate } = props;
    const date = new Date(startDate);

    if (date.getDate() === new Date().getDate()) {
        return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
    } if (date.getDay() === 0 || date.getDay() === 6) {
        return <WeekView.TimeTableCell {...props} className={classes.weekendCell} />;
    } return <WeekView.TimeTableCell {...props} />;
};

const DayScaleCell = (props: any) => {
    const classes = useStyles();
    const { startDate, today } = props;

    if (today) {
        return <WeekView.DayScaleCell {...props} className={classes.today} />;
    } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        return <WeekView.DayScaleCell {...props} className={classes.weekend} />;
    } return <WeekView.DayScaleCell {...props} />;
};

export default function CalendarPage() {
    const context = useContext(ThemeContext);

    const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
    console.log(scheduleData);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            meApi.getMeScheduleItems(),
            eventApi.getStudentEvents()
        ]).then((result) => {
            const [scheduleItems, events] = result;
            if (mounted && scheduleItems && events) {
                const data1 = scheduleItems.map(createScheduleData);
                const data2 = events.map(createScheduleDataFromEvent);
                const data3 = data1.concat(data2);
                setScheduleData(data3);
            }
        });

        return () => {
            mounted = false
        }
    }, []);

    return (
        <Container maxWidth="lg" className={context.classes.container}>
            <Grid container spacing={3}>
                <Paper style={{ overflow: 'auto' }}>
                    <Scheduler
                        data={scheduleData}
                        locale="pl-PL"
                        firstDayOfWeek={1}
                    >
                        <ViewState
                            defaultCurrentDate={new Date()}
                        />
                        <Toolbar />
                        <DateNavigator />
                        <WeekView
                            startDayHour={0}
                            endDayHour={24}
                            timeTableCellComponent={TimeTableCell}
                            dayScaleCellComponent={DayScaleCell}
                        />
                        <Appointments />
                        <AppointmentTooltip />
                    </Scheduler>
                </Paper>
            </Grid>
        </Container>
    );
}