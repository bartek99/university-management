import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as announcementApi from './../../../core/announcementApi';

interface AddAnnouncementFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddAnnouncementForm(props: AddAnnouncementFormProps) {
    const { register, handleSubmit, control, errors, reset } = useForm();

    const onSubmit = (newAnnouncement: announcementApi.NewAnnouncement) => {
        props.setResult(null);
        announcementApi.addAnnouncement(newAnnouncement)
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
        <Box width={1}>
            <form
                className={props.classes.form}
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <TextField
                        fullWidth
                        id="title"
                        name="title"
                        label="Tytuł"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.title ? true : false}
                        helperText={errors.title && errors.title.message}
                    />
                </div>
                <div>
                    <TextField
                        style={{ marginTop: 15 }}
                        fullWidth
                        id="description"
                        name="description"
                        label="Opis"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        multiline
                        rows={4}
                        error={errors.description ? true : false}
                        helperText={errors.description && errors.description.message}
                    />
                </div>
                <div>
                    <TextField
                        style={{ marginTop: 15 }}
                        fullWidth
                        id="content"
                        name="content"
                        label="Treść"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        multiline
                        rows={10}
                        error={errors.content ? true : false}
                        helperText={errors.content && errors.content.message}
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