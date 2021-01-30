import { requestGet, requestPost, requestPut, requestDelete } from './common';

export interface Faculty {
    facultyId: number;
    name: string;
}

export interface NewFaculty {
    name: string;
}

export interface EditedFaculty {
    name: string;
}

export function editedFaculty(faculty: Faculty): EditedFaculty {
    return {
        name: faculty.name
    };
}

export function getFaculties(): Promise<Faculty[]> {
    return requestGet('/faculties', (result) => result.map(mapFaculty), (error) => []);
}

export function getFaculty(facultyId: number): Promise<Faculty | null> {
    return requestGet(`/faculties/${facultyId}`, (result) => mapFaculty(result), (error) => null);
}

export function addFaculty(faculty: NewFaculty): Promise<Faculty | null> {
    return requestPost('/faculties', faculty, (result) => mapFaculty(result), (error) => null);
}

export function updateFaculty(facultyId: number, faculty: EditedFaculty): Promise<boolean> {
    return requestPut(`/faculties/${facultyId}`, faculty, (result) => true, (error) => false);
}

export function deleteFaculty(facultyId: number): Promise<boolean> {
    return requestDelete(`/faculties/${facultyId}`, (result) => true, (error) => false);
}

export function mapFaculty(data: any): Faculty {
    return ({
        facultyId: data.facultyId,
        name: data.name
    });
}
