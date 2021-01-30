import { requestGet } from './common';
import { Employee, mapAddress, mapEmployee, mapUser } from './user';

export function getEmployees(): Promise<Employee[]> {
    return requestGet(
        '/employees',
        (results) => results.map((result: any) => mapEmployee(
            mapUser(result.user),
            mapAddress(result.address),
            result
        )),
        (error) => []);
}

export function getEmployeesByGroupId(groupId: number): Promise<Employee[]> {
    return requestGet(
        `/employees?groupId=${groupId}`,
        (results) => results.map((result: any) => mapEmployee(
            mapUser(result.user),
            mapAddress(result.address),
            result
        )),
        (error) => []);
}
