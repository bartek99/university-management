import { requestGet, requestPost, requestPut, requestDelete } from './common';
import { Subject, mapSubject } from './subjectApi';
import {Group, mapGroup} from "./groupApi";

export interface Course {
    courseId: number;
    subject: Subject;
    name: string;
}

export interface NewCourse {
    subjectId: number;
    name: string;
}

export interface EditedCourse {
    subjectId: number;
    name: string;
}

export function editedCourse(course: Course): EditedCourse {
    return {
        subjectId: course.subject.subjectId,
        name: course.name
    };
}

export function getCourses(): Promise<Course[]> {
    return requestGet('/courses', (result) => result.map(mapCourse), (error) => []);
}

export function getCoursesBySubjectId(subjectId: number): Promise<Course[]> {
    return requestGet(`/courses/bySubject/${subjectId}`, (result) => result.map(mapCourse), (error) => []);
}

export function getCourseByGroupId(groupId: number): Promise<Course | null> {
    return requestGet(`/courses/byGroup/${groupId}`, (result) => mapCourse(result), (error) => null);
}

export function getCourse(courseId: number): Promise<Course | null> {
    return requestGet(`/courses/${courseId}`, (result) => mapCourse(result), (error) => null);
}

export function getMyCourses(): Promise<Course[]> {
    return requestGet(
        '/me/student/courses',
        (result) => result.map(mapCourse),
        (error) => null
    );
}

export function addCourse(course: NewCourse): Promise<Course | null> {
    return requestPost('/courses', course, (result) => mapCourse(result), (error) => null);
}

export function updateCourse(courseId: number, course: EditedCourse): Promise<boolean> {
    return requestPut(`/courses/${courseId}`, course, (result) => true, (error) => false);
}

export function deleteCourse(courseId: number): Promise<boolean> {
    return requestDelete(`/courses/${courseId}`, (result) => true, (error) => false);
}

export function mapCourse(data: any): Course {
    return ({
        courseId: data.courseId,
        subject: mapSubject(data.subject),
        name: data.name
    });
}
