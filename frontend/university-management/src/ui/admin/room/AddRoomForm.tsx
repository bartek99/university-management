import {Box, FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as room from './../../../core/room';
import Title from '../../Title';
import * as validation from '../../validation';
import {Faculty} from "../../../core/facultyApi";
import {Building} from "../../../core/building";
import * as building from "../../../core/building";

interface AddRoomFormProps {
    classes: any;
    setResult: (result: boolean | null) => void;
}

export default function AddRoomForm(props: AddRoomFormProps) {
    const { register, handleSubmit, getValues, errors, setError, reset, control } = useForm();

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



    const onSubmit = (newRoom: room.NewRoom) => {
        props.setResult(null);
        room.addRoom(newRoom)
            .then((result) => {
                props.setResult(true);
                reset();
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
                            defaultValue=""
                            rules={{
                                required: {
                                    value: true,
                                    message: 'To pole jest wymagane'
                                }
                            }}
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
                        <FormHelperText error={errors.buildingId ? true : false}>{errors.buildingId
                        && errors.buildingId.message}</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="number"
                        name="number"
                        label="Numer"
                        type="text"
                        inputRef={register({
                            required: {
                                value: true,
                                message: 'To pole jest wymagane'
                            }
                        })}
                        error={errors.number ? true : false}
                        helperText={errors.number && errors.number.message}
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