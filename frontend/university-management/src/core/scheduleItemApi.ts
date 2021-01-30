import { requestGet, requestPut, requestPost, requestDelete } from './common';
import * as groupApi from './groupApi';
import * as termApi from './termApi';
import * as room from './room';

export interface ScheduleItem {
    scheduleItemId: number;
    term: termApi.Term;
    group: groupApi.Group;
    room: room.Room;
    week: string;
    day: string;
    timeFrom: string;
    timeTo: string;
}

export interface NewScheduleItem {
    termId: number;
    groupId: number;
    roomId: number;
    week: string;
    day: string;
    timeFrom: string;
    timeTo: string;
}

export interface EditedScheduleItem {
    termId: number;
    groupId: number;
    roomId: number;
    week: string;
    day: string;
    timeFrom: string;
    timeTo: string;
}

export function editedScheduleItem(scheduleItem: ScheduleItem): EditedScheduleItem {
    return {
        termId: scheduleItem.term.termId,
        groupId: scheduleItem.group.groupId,
        roomId: scheduleItem.room.roomId,
        week: scheduleItem.week,
        day: scheduleItem.day,
        timeFrom: scheduleItem.timeFrom,
        timeTo: scheduleItem.timeTo
    };
}

export function weeks(): string[] {
    return ["Parzysty i Nieparzysty", "Parzysty", "Nieparzysty"];
}

export function days(): string[] {
    return ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
}

export function getScheduleItemsByGroupId(groupId: number): Promise<ScheduleItem[]> {
    return requestGet(`/schedule-items?groupId=${groupId}`, (result) => result.map(mapScheduleItem), (error) => []);
}

export function getScheduleItemById(scheduleItemId: number): Promise<ScheduleItem | null> {
    return requestGet(`/schedule-items/${scheduleItemId}`, mapScheduleItem, (error) => null);
}

export function addScheduleItem(scheduleItem: NewScheduleItem): Promise<ScheduleItem | null> {
    return requestPost('/schedule-items', scheduleItem, mapScheduleItem, (error) => null);
}

export function updateScheduleItem(scheduleItemId: number, scheduleItem: EditedScheduleItem): Promise<boolean> {
    return requestPut(`/schedule-items/${scheduleItemId}`, scheduleItem, (result) => true, (error) => false);
}

export function deleteScheduleItem(scheduleItemId: number): Promise<boolean> {
    return requestDelete(`/schedule-items/${scheduleItemId}`, (result) => true, (error) => false);
}

export function mapScheduleItem(data: any): ScheduleItem {
    return ({
        scheduleItemId: data.scheduleItemId,
        term: termApi.mapTerm(data.term),
        group: groupApi.mapGroup(data.group),
        room: room.mapRoom(data.room),
        week: data.week,
        day: data.day,
        timeFrom: data.timeFrom,
        timeTo: data.timeTo
    });
}
