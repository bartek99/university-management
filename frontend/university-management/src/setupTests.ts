// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

function storageMock() {
    let storage: { [key: string]: string; } = {};

    return {
        setItem(key: string, value: string) {
            storage[key] = value || '';
        },

        getItem(key: string) {
            return key in storage ? storage[key] : null;
        },

        removeItem(key: string) {
            delete storage[key];
        },

        get length() {
            return Object.keys(storage).length;
        },

        key(i: number) {
            const keys = Object.keys(storage);
            return keys[i] || null;
        },

        clear() {
            storage = {};
        }
    };
}

global.localStorage = storageMock();