import axios from 'axios';
import jwt_decode from 'jwt-decode';

export enum LoginStatus {
    Success,
    InvalidCredentials
}

export function isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null && localStorage.getItem('role') !== null;
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function hasRole(role: string) {
    const storedRole = localStorage.getItem('role');
    return storedRole && storedRole === role;
}

export function login(email: string, password: string): Promise<LoginStatus> {
    return new Promise<LoginStatus>((resolve, reject) => {
        localStorage.removeItem('token');
        axios
            .post(
                'http://localhost:8090/login',
                { email: email, password: password },
                { validateStatus: (status) => status === 200 || status === 403 })
            .then((response) => {
                if (response.status === 200) {
                    const token = response.headers['authorization'];
                    if (token) {
                        const decodedToken: any = jwt_decode(token);
                        localStorage.setItem('token', token);
                        localStorage.setItem('role', decodedToken.roles);
                        resolve(LoginStatus.Success);
                    } else {
                        resolve(LoginStatus.InvalidCredentials);
                    }
                } else {
                    resolve(LoginStatus.InvalidCredentials);
                }
            })
            .catch((error) => {
                reject('Unable to login. Error: ' + error);
            });
    });
}

export function logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
}