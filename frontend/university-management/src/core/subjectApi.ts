import { requestGet, requestPost, requestPut, requestDelete } from './common';
import { Faculty, mapFaculty } from './facultyApi';

export interface Subject {
    subjectId: number;
    faculty: Faculty;
    name: string;
}

export interface NewSubject {
    facultyId: number;
    name: string;
}

export interface EditedSubject {
    facultyId: number;
    name: string;
}

export function editedSubject(subject: Subject): EditedSubject {
    return {
        facultyId: subject.faculty.facultyId,
        name: subject.name
    };
}

export function getSubjects(): Promise<Subject[]> {
    return requestGet('/subjects', (result) => result.map(mapSubject), (error) => []);
}
export function getSubjectsByFacultyId(facultyId: number): Promise<Subject[]> {
    return requestGet(`/subjects/byFaculty/${facultyId}`, (result) => result.map(mapSubject), (error) => []);
}

export function getSubject(subjectId: number): Promise<Subject | null> {
    return requestGet(`/subjects/${subjectId}`, (result) => mapSubject(result), (error) => null);
}

export function addSubject(subject: NewSubject): Promise<Subject | null> {
    console.log(subject);
    return requestPost('/subjects', subject, (result) => mapSubject(result), (error) => null);
}

export function updateSubject(subjectId: number, subject: EditedSubject): Promise<boolean> {
    return requestPut(`/subjects/${subjectId}`, subject, (result) => true, (error) => false);
}

export function deleteSubject(subjectId: number): Promise<boolean> {
    return requestDelete(`/subjects/${subjectId}`, (result) => true, (error) => false);
}

export function mapSubject(data: any): Subject {
    return ({
        subjectId: data.subjectId,
        faculty: mapFaculty(data.faculty),
        name: data.name
    });
}
