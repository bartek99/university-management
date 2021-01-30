import { requestGet, requestPost, requestPut, requestDelete } from './common';
import { Course, mapCourse } from './courseApi';
import {mapAddress, mapStudent, mapUser, Student} from "./user";

export interface Group {
    groupId: number;
    course: Course;
    name: string;
}

export interface NewGroup {
    courseId: number;
    name: string;
}

export interface EditedGroup {
    courseId: number;
    name: string;
}

export function editedGroup(group: Group): EditedGroup {
    return {
        courseId: group.course.courseId,
        name: group.name
    };
}

export function getGroups(): Promise<Group[]> {
    return requestGet('/groups', (result) => result.map(mapGroup), (error) => []);
}

export function getMyGroups(): Promise<Group[]> {
    return requestGet(
        '/me/student/groups',
        (result) => result.map(mapGroup),
        (error) => null
    );
}

export function getMyEmployeeGroups(): Promise<Group[]> {
    return requestGet(
        '/me/employee/groups',
        (result) => result.map(mapGroup),
        (error) => null
    );
}

export function getGroup(groupId: number): Promise<Group | null> {
    return requestGet(`/groups/${groupId}`, (result) => mapGroup(result), (error) => null);
}

export function addGroup(group: NewGroup): Promise<Group | null> {
    return requestPost('/groups', group, (result) => mapGroup(result), (error) => null);
}

export function updateGroup(groupId: number, group: EditedGroup): Promise<boolean> {
    return requestPut(`/groups/${groupId}`, group, (result) => true, (error) => false);
}

export function deleteGroup(groupId: number): Promise<boolean> {
    return requestDelete(`/groups/${groupId}`, (result) => true, (error) => false);
}

export function addEmployee(groupId: number, employeeId: number): Promise<boolean> {
    return requestPost(`/groups/${groupId}/employees`, { employeeId }, (result) => true, (error) => false);
}

export function addStudent(groupId: number, studentId: number): Promise<boolean> {
    return requestPost(`/groups/${groupId}/students`, { studentId }, (result) => true, (error) => false);
}

export function mapGroup(data: any): Group {
    return ({
        groupId: data.groupId,
        course: mapCourse(data.course),
        name: data.name
    });
}
