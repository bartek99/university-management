import { requestGet, requestPost, requestPut, requestDelete } from './common';

export interface Term {
    termId: number;
    name: string;
    dateFrom: string;
    dateTo: string;
}

export interface NewTerm {
    name: string;
    dateFrom: string;
    dateTo: string;
}

export interface EditedTerm {
    name: string;
    dateFrom: string;
    dateTo: string;
}

export function editedTerm(term: Term): EditedTerm {
    return {
        name: term.name,
        dateFrom: term.dateFrom,
        dateTo: term.dateTo
    };
}

export function getTerms(): Promise<Term[]> {
    return requestGet('/terms', (result) => result.map(mapTerm), (error) => []);
}

export function getTerm(termId: number): Promise<Term | null> {
    return requestGet(`/terms/${termId}`, (result) => mapTerm(result), (error) => null);
}

export function addTerm(term: NewTerm): Promise<Term | null> {
    return requestPost('/terms', term, (result) => mapTerm(result), (error) => null);
}

export function updateTerm(termId: number, term: EditedTerm): Promise<boolean> {
    return requestPut(`/terms/${termId}`, term, (result) => true, (error) => false);
}

export function deleteTerm(termId: number): Promise<boolean> {
    return requestDelete(`/terms/${termId}`, (result) => true, (error) => false);
}

export function mapTerm(data: any): Term {
    return ({
        termId: data.termId,
        name: data.name,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo
    });
}
