import {
    editedStudent,
    EditedStudent, mapAddress,  mapStudent, mapUser,
    NewStudent,
    Student
} from "./user";
import {Course, editedCourse, EditedCourse, mapCourse, NewCourse} from "./courseApi";
import {requestDelete, requestGet, requestPost, requestPut} from "./common";
import {EditedRoom} from "./room";

export interface Grade {
    gradeId: number;
    course: Course;
    student: Student;
    name: string;
    description: string;
    value: number;
}

export interface NewGrade {
    course: NewCourse;
    student: NewStudent;
    name: string;
    description: string;
    value: number;
}

export interface EditedGrade {
    course: EditedCourse;
    student: EditedStudent;
    name: string;
    description: string;
    value: number;}

export function editedGrade(grade: Grade): EditedGrade {
    return {
        course: editedCourse(grade.course),
        student: editedStudent(grade.student),
        name: grade.name,
        description: grade.description,
        value: grade.value
    };
}

export function addGrade(grade: NewGrade): Promise<Grade | null> {
    console.log(grade);
    return requestPost('/grades', grade, (result) =>
        mapGrade(mapCourse(result.course),mapStudent(mapUser(result.student.user),
            mapAddress(result.student.address),result.student),result),
        (error) => null);
}

export function getAllGradesByMeEmployee(): Promise<Grade[]> {
    return requestGet(
        '/me/employee/grades',
        (results) => results.map((result: any) => mapGrade(mapCourse(result.course),mapStudent(mapUser(result.student.user),mapAddress(result.student.address),result.student), result)),
        (error) => null
    );}



export function getGradeById(gradeId: number): Promise<Grade | null> {
    return requestGet(`/grades/${gradeId}`,
        (result) => mapGrade(mapCourse(result.course),mapStudent(mapUser(result.student.user),mapAddress(result.student.address),result.student), result),
        (error) => null);
}

export function getMyGrades(): Promise<Grade[]> {
    return requestGet(
        '/me/student/grades',
        (results) => results.map((result: any) => mapGrade(mapCourse(result.course),mapStudent(mapUser(result.student.user),mapAddress(result.student.address),result.student), result)),
        (error) => null
    );
}

export function updateGrade(gradeId: number, room: EditedGrade): Promise<boolean> {
    return requestPut(`/grades/${gradeId}`, room, (result) => true, (error) => false);
}

export function deleteGrade(gradeId: number): Promise<boolean> {
    return requestDelete(`/grades/${gradeId}`, (result) => true, (error) => false);
}

export function mapGrade(course:Course, student: Student,  data: any): Grade {
    return ({
        gradeId: data.gradeId,
        course: course,
        student: student,
        name: data.name,
        description: data.description,
        value: data.value
    });
}