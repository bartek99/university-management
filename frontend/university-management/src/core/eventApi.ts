import { requestDelete, requestGet, requestPost, requestPut } from './common';
import { Group, mapGroup } from './groupApi';
import { mapRoom, Room } from './room';
import { Employee, mapAddress, mapEmployee, mapUser } from './user';

export interface Event {
    eventId: number;
    employee: Employee;
    group: Group;
    room: Room;
    name: string;
    date: string;
    timeFrom: string;
    timeTo: string;
}

export interface NewEvent {
    employeeId: number;
    groupId: number;
    roomId: number;
    name: string;
    date: string;
    timeFrom: string;
    timeTo: string;
}

export interface EditedEvent {
    employeeId: number;
    groupId: number;
    roomId: number;
    name: string;
    date: string;
    timeFrom: string;
    timeTo: string;
}

export function editedEvent(event: Event): EditedEvent {
    return {
        employeeId: event.employee.employeeId,
        groupId: event.group.groupId,
        roomId: event.room.roomId,
        ...event
    };
}

export function getStudentEvents(): Promise<Event[]> {
    return requestGet('/me/student/events', (result) => result.map(mapEvent), (error) => []);
}

export function getEmployeeEvents(): Promise<Event[]> {
    return requestGet('/me/employee/events', (result) => result.map(mapEvent), (error) => []);
}

export function getEvent(eventId: number): Promise<Event | null> {
    return requestGet(`/events/${eventId}`, (result) => mapEvent(result), (error) => null);
}

export function addEvent(event: NewEvent): Promise<Event | null> {
    return requestPost('/me/employee/events', event, (result) => mapEvent(result), (error) => null);
}

export function updateEvent(eventId: number, event: EditedEvent): Promise<boolean> {
    return requestPut(`/me/employee/events/${eventId}`, event, (result) => true, (error) => false);
}

export function deleteEvent(eventId: number): Promise<boolean> {
    return requestDelete(`/events/${eventId}`, (result) => true, (error) => false);
}

export function mapEvent(data: any): Event {
    return ({
        employee: mapEmployee(mapUser(data.employee.user), mapAddress(data.employee.address), data),
        group: mapGroup(data.group),
        room: mapRoom(data.room),
        ...data
    });
}
