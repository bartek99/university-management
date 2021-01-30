import { requestGet } from './common';
import { Student, mapAddress, mapUser, mapStudent } from './user';

export function getStudents(): Promise<Student[]> {
    return requestGet(
        '/students',
        (results) => results.map((result: any) => mapStudent(
            mapUser(result.user),
            mapAddress(result.address),
            result
        )),
        (error) => []);
}

export function getStudentsByGroupId(groupId: number): Promise<Student[]> {
    return requestGet(
        `/students?groupId=${groupId}`,
        (results) => results.map((result: any) => mapStudent(
            mapUser(result.user),
            mapAddress(result.address),
            result
        )),
        (error) => []);
}
