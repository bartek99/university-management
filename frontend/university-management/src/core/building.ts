import {Address, editedAddress, EditedAddress, mapAddress, NewAddress} from "./user";
import {requestDelete, requestGet, requestPost, requestPut} from "./common";

export interface Building {
    buildingId: number;
    address: Address;
    name: string;
}

export interface NewBuilding {
    address: NewAddress;
    name: string;
}

export interface EditedBuilding {
    address: EditedAddress
    name: string;
}

export function editedBuilding(building: Building): EditedBuilding {
    return {
        address: editedAddress(building.address),
        name: building.name
    };
}


export function getBuildings(): Promise<Building[]> {
    return requestGet('/buildings', (results) => results.map(mapBuilding), (error) => []);
}

export function addBuilding(building: NewBuilding): Promise<Building | null> {
    console.log(building);
    return requestPost('/buildings', building, mapBuilding, (error) => null);
}

export function getBuilding(buildingId: number): Promise<Building | null> {
    return requestGet(`/buildings/${buildingId}`, mapBuilding, (error) => null);
}

export function updateBuilding(buildingId: number, building: EditedBuilding): Promise<boolean> {
    return requestPut(`/buildings/${buildingId}`, building, (result) => true, (error) => false);
}


export function deleteBuilding(buildingId: number): Promise<boolean> {
    return requestDelete(`/buildings/${buildingId}`, (result) => true, (error) => false);
}

export function mapBuilding(data: any): Building {
    return ({
        buildingId: data.buildingId,
        address: mapAddress(data.address),
        name: data.name
    });
}
