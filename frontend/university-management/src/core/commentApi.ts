import { requestGet, requestPost, requestDelete } from './common';

export interface Comment {
    commentId: number;
    author: string;
    content: string;
    createdAt: string;
    isOwner: boolean;
}

export interface NewComment {
    content: string;
}

export function getComments(announcementId: number): Promise<Comment[]> {
    return requestGet(`/announcements/${announcementId}/comments`, (result) => result.map(mapComment), (error) => []);
}

export function addComment(announcementId: number, comment: NewComment): Promise<Comment | null> {
    return requestPost(`/announcements/${announcementId}/comments`, comment, (result) => mapComment(result), (error) => null);
}

export function deleteComment(announcementId: number, commentId: number): Promise<boolean> {
    return requestDelete(`/announcements/${announcementId}/comments/${commentId}`, (result) => true, (error) => false);
}

export function mapComment(data: any): Comment {
    return ({
        commentId: data.commentId,
        author: data.author,
        content: data.content,
        createdAt: data.createdAt,
        isOwner: data.isOwner
    });
}
