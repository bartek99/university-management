import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as room from '../../../core/room';
import * as building from '../../../core/building';
import {Building} from "../../../core/building";

interface EditRoomFormProps {
    classes: any;
    roomId: number;
    setResult: (result: boolean | null) => void;
}

export default function EditRoomForm(props: EditRoomFormProps) {
    const { handleSubmit, errors, control, reset } = useForm();

    const [buildings, setBuildings] = React.useState<Building[]>([]);
    useEffect(() => {
        let mounted = true;
        building.getBuildings()
            .then((buildings) => {
                if (mounted) {
                    setBuildings(buildings);
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        room.getRoom(props.roomId)
            .then((room) => {
                if (mounted && room) {
                    reset({
                        buildingId: room.building.buildingId,
                        number: room.number
                    });
                }
            })
        return () => {
            mounted = false;
        }
    }, [reset, props]);

    const onSubmit = (editedRoom: room.EditedRoom) => {
        props.setResult(null);
        room.updateRoom(props.roomId, editedRoom)
            .then((updated) => {
                if (updated) {
                    reset(editedRoom);
                    props.setResult(true);
                } else {
                    props.setResult(false);
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
                        <InputLabel id="buildingIdLabel">Budynek</InputLabel>
                        <Controller
                            name="buildingId"
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'To pole jest wymagane'
                                }
                            }}
                            defaultValue=""
                            as={
                                <Select
                                    labelId="buildingIdLabel"
                                    id="buildingId"
                                    error={errors.buildingId ? true : false}
                                >
                                    {buildings.map(building =>
                                        <MenuItem key={building.buildingId}
                                                  value={building.buildingId}>{building.name}</MenuItem>)}
                                </Select>
                            }
                        />
                        <FormHelperText error={errors.buildingId ? true : false}>
                            {errors.buildingId && errors.buildingId.message}</FormHelperText>
                    </FormControl>
                </div>
                <Controller
                    name="number"
                    as={
                        <TextField
                            fullWidth
                            id="number"
                            label="Numer"
                            error={errors.number ? true : false}
                            helperText={errors.number && errors.number.message}
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
                <div style={{ marginTop: 10 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={props.classes.submit}
                    >
                        Zapisz
                    </Button>
                </div>
            </form>
        </Box>
    );
}