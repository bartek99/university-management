import axios from 'axios';
import { config, requestGet, requestPost, requestPut, requestDelete, handleResponse } from './common';
import {Building, mapBuilding} from "./building";

export interface User {
    userId: number;
    userType: string;
    email: string;
}

export interface NewUser {
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface EditedUser {
    email: string;
}

export function editedUser(user: User): EditedUser {
    return {
        email: user.email
    };
}

export interface Address {
    addressId: number;
    street: string;
    houseNumber: string;
    flatNumber: string;
    postcode: string;
    city: string;
    country: string;
}

export interface NewAddress {
    street: string;
    houseNumber: string;
    flatNumber?: string;
    postcode: string;
    city: string;
    country: string;
}

export interface EditedAddress {
    street: string;
    houseNumber: string;
    flatNumber?: string;
    postcode: string;
    city: string;
    country: string;
}

export function editedAddress(address: Address): EditedAddress {
    return { ...address };
}

export interface Admin {
    adminId: number;
    user: User;
}

export interface NewAdmin {
    user: NewUser;
}

export interface EditedAdmin {
    user: EditedUser;
}

export function editedAdmin(admin: Admin): EditedAdmin {
    return {
        user: editedUser(admin.user)
    }
}

export interface Employee {
    employeeId: number;
    user: User;
    address: Address;
    firstName: string
    lastName: string;
    fullName: string;
    birthDate: string;
    pesel: string;
    phoneNumber: string;
}

export interface NewEmployee {
    user: NewUser;
    address: NewAddress;
    firstName: string
    lastName: string;
    birthDate: string;
    pesel: string;
    phoneNumber: string;
}

export interface EditedEmployee {
    user: EditedUser;
    address: EditedAddress;
    firstName: string;
    lastName: string;
    birthDate: string;
    pesel: string;
    phoneNumber: string;
}

export function editedEmployee(employee: Employee): EditedEmployee {
    return {
        user: editedUser(employee.user),
        address: editedAddress(employee.address),
        firstName: employee.firstName,
        lastName: employee.lastName,
        birthDate: employee.birthDate,
        pesel: employee.pesel,
        phoneNumber: employee.phoneNumber
    }
}

export interface Student {
    studentId: number;
    user: User;
    address: Address;
    firstName: string
    lastName: string;
    fullName: string;
    birthDate: string;
    pesel: string;
    phoneNumber: string;
    albumNumber: string;
}

export interface NewStudent {
    user: NewUser;
    address: NewAddress;
    firstName: string
    lastName: string;
    birthDate: string;
    pesel: string;
    phoneNumber: string;
    albumNumber: string;
}

export interface EditedStudent {
    user: EditedUser;
    address: EditedAddress;
    firstName: string;
    lastName: string;
    birthDate: string;
    pesel: string;
    phoneNumber: string;
    albumNumber: string;
}

export function editedStudent(student: Student): EditedStudent {
    return {
        user: editedUser(student.user),
        address: editedAddress(student.address),
        firstName: student.firstName,
        lastName: student.lastName,
        birthDate: student.birthDate,
        pesel: student.pesel,
        phoneNumber: student.phoneNumber,
        albumNumber: student.albumNumber
    }
}

export function getMeAdmin(): Promise<Admin | null> {
    return requestGet(
        '/me/admin',
        (result) => mapAdmin(mapUser(result.user), result),
        (error) => null
    );
}

export function getMeEmployee(): Promise<Employee | null> {
    return requestGet(
        '/me/employee',
        (result) => mapEmployee(mapUser(result.user), mapAddress(result.address), result),
        (error) => null
    );
}

export function getMeStudent(): Promise<Student | null> {
    return requestGet(
        '/me/student',
        (result) => mapStudent(mapUser(result.user), mapAddress(result.address), result),
        (error) => null
    );
}

export function getUsers(): Promise<User[]> {
    return requestGet('/users', (result) => result.map(mapUser), (error) => []);
}

export function getStudents(): Promise<Student[]> {
    return requestGet('/students', (results) => results.map((result: any) => mapStudent(
        mapUser(result.user),
        mapAddress(result.address),
        result
    )), (error) => []);
}

export function getEmployees(): Promise<Employee[]> {
    return requestGet('/employees', (results) => results.map((result: any) =>
        mapEmployee(mapUser(result.user),mapAddress(result.address),result)), (error) => []);
}

export function getAdmin(userId: number): Promise<Admin | null> {
    return requestGet(`/admins/${userId}`, (result) => mapAdmin(mapUser(result.user), result), (error) => null);
}

export function getEmployee(userId: number): Promise<Employee | null> {
    return requestGet(`/employees/${userId}`, (result) => mapEmployee(mapUser(result.user), mapAddress(result.address), result), (error) => null);
}

export function getStudent(userId: number): Promise<Student | null> {
    return requestGet(`/students/${userId}`, (result) => mapStudent(mapUser(result.user), mapAddress(result.address), result), (error) => null);
}

export function addAdmin(admin: NewAdmin): Promise<Admin | null> {
    return requestPost('/admins', admin, (result) => mapAdmin(mapUser(result.user), result), (error) => null);
}

export function addEmployee(employee: NewEmployee): Promise<Employee | null> {
    return requestPost(
        '/employees',
        employee,
        (result) => mapEmployee(mapUser(result.user), mapAddress(result.address), result),
        (error) => null);
}

export function addStudent(student: NewStudent): Promise<Student | null> {
    console.log(student);
    return requestPost(
        '/students',
        student,
        (result) => mapStudent(mapUser(result.user), mapAddress(result.address), result),
        (error) => null);
}

export function updateAdmin(adminId: number, admin: EditedAdmin): Promise<boolean> {
    return requestPut(`/admins/${adminId}`, admin, (result) => true, (error) => false);
}

export function updateEmployee(employeeId: number, employee: EditedEmployee): Promise<boolean> {
    return requestPut(`/employees/${employeeId}`, employee, (result) => true, (error) => false);
}

export function updateStudent(studentId: number, student: EditedStudent): Promise<boolean> {
    return requestPut(`/students/${studentId}`, student, (result) => true, (error) => false);
}

export function deleteUser(userId: number): Promise<boolean> {
    return requestDelete(`/users/${userId}`, (result) => true, (error) => false);
}



export function validatePassword(password: string): Promise<boolean> {
    return requestPost(`/me/password-validation`, { password }, (result) => result, (error) => false);
}

export function changePassword(token: string, currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<boolean> {
    const data = { currentPassword, newPassword, newPasswordConfirmation };
    return new Promise<boolean>((resolve, reject) => axios
        .post('http://localhost:8090/me/password-change', data, config(token))
        .then((response) => handleResponse(response, (result) => resolve(true), (error) => resolve(false)))
        .catch((error) => reject('Unable to change a password. Error: ' + error)));
}

export function userExists(email: string, notUserId?: number): Promise<boolean> {
    let queryString = `email=${email}`
    if (notUserId !== undefined) {
        queryString += `&notUserId=${notUserId}`;
    }
    return requestGet(
        `/users/search?${queryString}`,
        (result) => result.length > 0,
        (error) => false);
}

export function mapAddress(data: any): Address {
    return ({
        addressId: data.addressId,
        street: data.street,
        houseNumber: data.houseNumber,
        flatNumber: data.flatNumber,
        postcode: data.postcode,
        city: data.city,
        country: data.country,
    });
}

export function mapUser(data: any): User {
    return ({
        userId: data.userId,
        userType: data.userType,
        email: data.email
    });
}

export function mapAdmin(user: User, data: any): Admin {
    return ({
        adminId: data.adminId,
        user: user
    });
}

export function mapEmployee(user: User, address: Address, data: any): Employee {
    return ({
        employeeId: data.employeeId,
        user: user,
        address: address,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        birthDate: data.birthDate,
        pesel: data.pesel,
        phoneNumber: data.phoneNumber
    });
}

export function mapStudent(user: User, address: Address, data: any): Student {
    return ({
        studentId: data.studentId,
        user: user,
        address: address,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        birthDate: data.birthDate,
        pesel: data.pesel,
        phoneNumber: data.phoneNumber,
        albumNumber: data.albumNumber,
    });
}