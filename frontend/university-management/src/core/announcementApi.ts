import { requestDelete, requestGet, requestPost } from './common';

export interface Announcement {
    announcementId: number;
    author: string;
    title: string;
    description: string;
    content: string;
    createdAt: string;
    isOwner: boolean;
}

export interface NewAnnouncement {
    title: string;
    content: string;
}

export function getAnnouncements(): Promise<Announcement[]> {
    return requestGet('/announcements', (result) => result.map(mapAnnouncement), (error) => []);
}

export function getAnnouncementsForStudent(): Promise<Announcement[]> {
    return requestGet('/announcements/student', (result) => result.map(mapAnnouncement), (error) => []);
}

export function getAnnouncement(announcementId: number): Promise<Announcement | null> {
    return requestGet(`/announcements/${announcementId}`, (result) => mapAnnouncement(result), (error) => null);
}

export function getAnnouncementForStudent(announcementId: number): Promise<Announcement | null> {
    return requestGet(`/announcements/${announcementId}/student`, (result) => mapAnnouncement(result), (error) => null);
}

export function addAnnouncement(announcement: NewAnnouncement): Promise<Announcement | null> {
    return requestPost('/announcements', announcement, (result) => mapAnnouncement(result), (error) => null);
}

export function deleteAnnouncement(announcementId: number): Promise<boolean> {
    return requestDelete(`/announcements/${announcementId}`, (result) => true, (error) => false);
}

export function mapAnnouncement(data: any): Announcement {
    return ({
        announcementId: data.announcementId,
        author: data.author,
        title: data.title,
        description: data.description,
        content: data.content,
        createdAt: data.createdAt,
        isOwner: data.isOwner
    });
}
