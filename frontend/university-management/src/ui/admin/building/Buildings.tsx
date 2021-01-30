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
import { Link as RouterLink } from 'react-router-dom';
import * as auth from '../../../core/auth';
import * as building from '../../../core/building';
import ConfirmationDialog from '../../ConfirmationDialog';
import Title from '../../Title';


interface BuildingProps {
    classes: any;
}

export default function Buildings(props: BuildingProps) {
    const [buildings, setBuildings] = useState<{ [key: number]: building.Building}>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [buildingId, setBuildingId] = useState<number | null>(null)
    const [buildingDeleted, setBuildingDeleted] = useState<boolean | null>(null);

    const handleOk = () => {
        setDeleteDialogOpen(false);
        setBuildingDeleted(null);
        if (buildingId !== null) {
            building.deleteBuilding(buildingId)
                .then((result) => {
                    if (result) {
                        delete buildings[buildingId];
                        setBuildings({ ...buildings });
                        setBuildingDeleted(result);
                    } else {
                        setBuildingDeleted(false);
                    }
                })
        }
    };
    const handleCancel = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        let mounted = true;
        const token = auth.getToken();
        if (token) {
            building.getBuildings()
                .then((buildings) => {
                    if (mounted) {
                        const buildingsById = buildings.reduce((buildingsById, building) => {
                            return { ...buildingsById, [building.buildingId]: building }; }, {});
                        setBuildings(buildingsById);
                        console.log(buildingsById);
                    }
                })
                .catch((error) => { });
        }

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
            <Title>Budynki</Title>
            <div style={{ marginBottom: 10 }}>
                {buildingDeleted !== null && buildingDeleted === true && <Alert severity="success">Budynek został usunięty.</Alert>}
                {buildingDeleted !== null && buildingDeleted === false && <Alert severity="error">Wystąpił błąd. Spróbuj ponownie.</Alert>}
            </div>
            <Grid container item justify="flex-end">
                <Grid item>
                    <Button variant="outlined" color="default" size="small" style={{ marginRight: 5 }} component={RouterLink} to="/admin/add-building">
                        Dodaj budynek
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Nazwa</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(buildings)
                        .sort((buildingA, buildingB) => buildingA.name < buildingB.name ? -1 : 1)
                        .map((building) => (
                        <TableRow key={building.buildingId}>
                            <TableCell>{building.name}</TableCell>
                            <TableCell>
                                <IconButton aria-label="show" component={RouterLink} to={`/admin/show-building/${building.buildingId}`}
                                >
                                    <ShowIcon />
                                </IconButton>
                                <IconButton aria-label="edit" component={RouterLink} to={`/admin/edit-building/${building.buildingId}`}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => {
                                    setBuildingId(building.buildingId);
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
