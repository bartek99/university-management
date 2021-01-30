import { Button, Divider, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../../theme-context';
import * as announcementApi from './../../../core/announcementApi';

export default function AnnouncementsPage() {
    const context = useContext(ThemeContext);

    const [announcements, setAnnouncements] = useState<announcementApi.Announcement[]>([]);
    useEffect(() => {
        let mounted = true;
        announcementApi.getAnnouncements()
            .then((announcements) => {
                if (mounted) {
                    setAnnouncements(announcements);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    return (
        <Container maxWidth="lg" className={context.classes.container}>
            <Grid container spacing={3}>
                {announcements.map(announcement => 
                <Grid item xs={12} key={announcement.announcementId}>
                    <Paper className={context.classes.paper}>
                        <Typography variant="h6">
                            {announcement.title}
                        </Typography>
                        <Typography variant="subtitle1">
                            {announcement.createdAt}
                        </Typography>

                        <Divider style={{ marginBottom: 10 }} />

                        {announcement.description}

                        <Grid container item justify="flex-end">
                            <Grid item>
                                <Button variant="text" component={RouterLink} to={`/employee/show-announcement/${announcement.announcementId}`}>
                                    Czytaj więcej
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>)}
            </Grid>
        </Container >
    );
}