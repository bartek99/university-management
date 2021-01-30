import { Building, editedBuilding, EditedBuilding, mapBuilding, NewBuilding } from './building';
import { requestDelete, requestGet, requestPost, requestPut } from './common';

export interface Room {
    roomId: number;
    building: Building;
    number: string;
}

export interface NewRoom {
    building: NewBuilding;
    number: string;
}

export interface EditedRoom {
    building: EditedBuilding;
    number: string;
}

export function editedRoom(room: Room): EditedRoom {
    return {
        building: editedBuilding(room.building),
        number: room.number
    };
}


export function getRooms(): Promise<Room[]> {
    return requestGet('/rooms', (results) => results.map(mapRoom), (error) => []);
}

export function getAvailableRooms(date: string | undefined, timeFrom: string | undefined, timeTo: string | undefined): Promise<Room[]> {
    if (date === undefined || timeFrom === undefined || timeTo === undefined) {
        return Promise.resolve([]);
    } else {
        return requestGet(`/rooms/available?date=${date}&timeFrom=${timeFrom}&timeTo=${timeTo}`, (results) => results.map(mapRoom), (error) => []);
    }
}

export function addRoom(room: NewRoom): Promise<Room | null> {
    console.log(room);
    return requestPost('/rooms', room, mapRoom, (error) => null);
}

export function getRoom(roomId: number): Promise<Room | null> {
    return requestGet(`/rooms/${roomId}`, mapRoom, (error) => null);
}

export function updateRoom(roomId: number, room: EditedRoom): Promise<boolean> {
    return requestPut(`/rooms/${roomId}`, room, (result) => true, (error) => false);
}


export function deleteRoom(roomId: number): Promise<boolean> {
    return requestDelete(`/rooms/${roomId}`, (result) => true, (error) => false);
}

export function mapRoom(data: any): Room {
    return ({
        roomId: data.roomId,
        building: mapBuilding(data.building),
        number: data.number
    });
}
