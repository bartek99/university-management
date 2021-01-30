import { Button, Divider, List, ListItem, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import * as announcementApi from './../../../core/announcementApi';
import * as commentApi from './../../../core/commentApi';
import { ThemeContext } from './../../theme-context';


export default function ShowAnnouncementPage() {
    const context = useContext(ThemeContext);
    const classes = context.classes;

    const params: any = useParams();
    const announcementId = params.announcementId;

    const history = useHistory();

    const [announcement, setAnnouncement] = useState<announcementApi.Announcement | null>(null);
    useEffect(() => {
        let mounted = true;
        announcementApi.getAnnouncement(announcementId)
            .then((announcement) => {
                if (mounted && announcement) {
                    setAnnouncement(announcement);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, [announcementId]);

    const [comments, setComments] = useState<{ [key: number]: commentApi.Comment }>({});
    useEffect(() => {
        let mounted = true;
        commentApi.getComments(announcementId)
            .then((comments) => {
                if (mounted) {
                    const commentsById = comments.reduce((commentsById, comment) => { return { ...commentsById, [comment.commentId]: comment }; }, {});
                    setComments(commentsById);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, [announcementId]);

    const { register, handleSubmit, errors, reset } = useForm();
    const onSubmit = (comment: commentApi.NewComment) => {
        commentApi.addComment(announcementId, comment)
            .then((comment) => {
                if (comment) {
                    comments[comment.commentId] = comment;
                    setComments({ ...comments });
                }
                reset();
            })
            .catch(console.log);
    }

    return (
        <Container maxWidth="lg" className={context.classes.container}>
            <Grid container spacing={3}>
                {announcement &&
                    <Grid item xs={12}>
                        <Paper className={context.classes.paper}>
                            <Typography variant="h6">
                                {announcement.isOwner && <IconButton edge="end" aria-label="delete" style={{ padding: 0, paddingBottom: 5, paddingRight: 15 }} onClick={() => {
                                    announcementApi
                                        .deleteAnnouncement(announcementId)
                                        .then((deleted) => {
                                            history.push('/employee/announcements')
                                        });
                                }}>
                                    <DeleteIcon />
                                </IconButton>}
                                {announcement.title}
                            </Typography>
                            <Typography variant="subtitle1">
                                {announcement.createdAt}
                            </Typography>
                            <Divider style={{ marginBottom: 15 }} />

                            {announcement.content.split('\n').map((paragraph, idx) => <Typography paragraph={true} variant="body1" key={idx}>{paragraph}</Typography>)}

                            <List style={{ width: '100%' }}>
                                {Object.values(comments).map((comment) => <>
                                    <ListItem key={comment.commentId}>
                                        <ListItemText
                                            primary={<Typography className={classes.fonts}>{comment.author}</Typography>}
                                            secondary={
                                                <>
                                                    {comment.createdAt}
                                                    <br />
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        {comment.content}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        {comment.isOwner && <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete" onClick={() => {
                                                commentApi
                                                    .deleteComment(announcementId, comment.commentId)
                                                    .then((deleted) => {
                                                        delete comments[comment.commentId];
                                                        setComments({ ...comments });
                                                    });
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>}
                                    </ListItem>
                                    <Divider />
                                </>)}
                            </List>

                            <form
                                className={classes.form}
                                noValidate
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <TextField
                                    fullWidth
                                    id="content"
                                    name="content"
                                    label="Komentarz"
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    inputRef={register({
                                        required: {
                                            value: true,
                                            message: 'To pole jest wymagane'
                                        }
                                    })}
                                    error={errors.content ? true : false}
                                    helperText={errors.content && errors.content.message}
                                />
                                <Grid container item justify="flex-end">
                                    <Grid item>
                                        <Button type="submit" variant="outlined" color="default" size="small" style={{ marginTop: 5 }}>
                                            Dodaj komentarz
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>}
            </Grid>
        </Container >
    );
}