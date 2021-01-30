import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as auth from './auth';

beforeEach(() => {
    localStorage.clear();
});

describe('Auth', () => {
    it('authenticates successfuly when credentials are valid', () => {
        var mock = new MockAdapter(axios);

        const status = 200;
        const data = null;
        const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.' +
            'eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGVzIjoiQWRtaW4iLCJleHAiOjE2MDg4MDQ5NzB9.' +
            'ar-spUh0S3yLEK976Yn5new2nybIFvfKWtLHlLhsQUGDeB0dalgKS8pra-c94Ypdhbnn5nZBpZEJbdu5vzh87g';
        const role = 'Admin';
        const headers = { authorization: token };
        mock.onPost('http://localhost:8090/login').reply(status, data, headers);

        return auth.login('name@example.com', 'password')
            .then((loginStatus) => {
                expect(loginStatus).toEqual(auth.LoginStatus.Success);
                expect(auth.isLoggedIn()).toBe(true);
                expect(auth.getToken()).toBe(token);
                expect(auth.hasRole(role)).toBe(true);
            });
    });

    it('doesnt authenticate when credentials are invalid', () => {
        var mock = new MockAdapter(axios);

        const status = 403;
        mock.onPost('http://localhost:8090/login').reply(status);

        return auth.login('name@example.com', 'invalid_password')
            .then((loginStatus) => {
                expect(loginStatus).toEqual(auth.LoginStatus.InvalidCredentials);
                expect(auth.isLoggedIn()).toBe(false);
                expect(auth.getToken()).toBe(null);
            });
    });

    it('logs out successfully', () => {
        var mock = new MockAdapter(axios);

        const status = 200;
        const data = null;
        const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.' +
            'eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGVzIjoiQWRtaW4iLCJleHAiOjE2MDg4MDQ5NzB9.' +
            'ar-spUh0S3yLEK976Yn5new2nybIFvfKWtLHlLhsQUGDeB0dalgKS8pra-c94Ypdhbnn5nZBpZEJbdu5vzh87g';
        const headers = { authorization: token };
        mock.onPost('http://localhost:8090/login').reply(status, data, headers);

        return auth.login('name@example.com', 'password')
            .then((loginStatus) => {
                expect(auth.isLoggedIn()).toBe(true);
                auth.logout();
                expect(auth.isLoggedIn()).toBe(false);
            });
    });
});