import * as auth from './auth';
import axios from 'axios';

export function requestGet<R>(path: string, mapResult: (result: any) => R, mapError: (error: string) => R): Promise<R> {
    return new Promise<R>((resolve, reject) => {
        const token = auth.getToken();
        if (!token) {
            reject('No token.');
        } else {
            axios
                .get('http://localhost:8090' + path, config(token))
                .then((response) => handleResponse(
                    response,
                    (result) => resolve(mapResult(result)),
                    (error) => resolve(mapError(error))))
                .catch(reject);
        }
    });
}

export function requestPost<T, R>(path: string, data: T, mapResult: (result: any) => R, mapError: (error: string) => R): Promise<R> {
    return new Promise<R>((resolve, reject) => {
        const token = auth.getToken();
        if (!token) {
            reject('No token.');
        } else {
            axios
                .post('http://localhost:8090' + path, data, config(token))
                .then((response) => handleResponse(
                    response,
                    (result) => resolve(mapResult(result)),
                    (error) => resolve(mapError(error))))
                .catch(reject);
        }
    });
}

export function requestPut<T, R>(path: string, data: T, mapResult: (result: any) => R, mapError: (error: string) => R): Promise<R> {
    return new Promise<R>((resolve, reject) => {
        const token = auth.getToken();
        if (!token) {
            reject('No token.');
        } else {
            axios
                .put('http://localhost:8090' + path, data, config(token))
                .then((response) => handleResponse(
                    response,
                    (result) => resolve(mapResult(result)),
                    (error) => resolve(mapError(error))))
                .catch(reject);
        }
    });
}

export function requestDelete<R>(path: string, mapResult: (result: any) => R, mapError: (error: string) => R): Promise<R> {
    return new Promise<R>((resolve, reject) => {
        const token = auth.getToken();
        if (!token) {
            reject('No token.');
        } else {
            axios
                .delete('http://localhost:8090' + path, config(token))
                .then((response) => handleResponse(
                    response,
                    (result) => resolve(mapResult(result)),
                    (error: string) => resolve(mapError(error))))
                .catch(reject);
        }
    });
}

export function config(token: string) {
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': token
        }
    };
}

export function handleResponse(response: any, onResult: (result: any) => void, onError: (error: string) => void) {
    if (response.data.result !== undefined) {
        onResult(response.data.result);
    } else {
        onError(response.data.error);
    }
}