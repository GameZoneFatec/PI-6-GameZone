import { ReviewStatus } from '@prisma/client';

export const createBodyMandatory = ['userId', 'gameId', 'title', 'body', 'status'];
export const updateBody = ['userId', 'gameId', 'title', 'body', 'status', 'rating', 'isPublic'];

export type ReviewCreateDTO = {
    userId: string;
    gameId: number;
    title: string;
    body: string | null;
    rating: number | null;
    status: ReviewStatus;
    isPublic?: boolean;
    published_at?: Date | null;
};

export type ReviewUpdateDTO = {
    id: string;
    title?: string;
    body?: string;
    rating?: number;
    status?: ReviewStatus;
    isPublic?: boolean;
    published_at?: Date | null;
};

export type reviewListFeed = {
    gameId: number;
    userId: string;
    page: number;
    limit: number;
};

export type reviewListUserParams = {
    userId: string;
    page: number;
    limit: number;
    title?: string | null;
    status?: ReviewStatus;
};

export type reviewResponse = {
    reviewId: string;
    gameId: number;
    title: string;
    body: string | null;
    rating: number | null;
    status: ReviewStatus;
    isPublic: boolean;
    published_at: Date | null;
    author: {
        id: string;
        username: string;
        profile_image_url: string | null;
    };
    likedByUser: boolean;
    likesCount: number;
};

export type reviewByIdResponse = {
    userId: string;
    gameId: number;
    title: string;
    body: string | null;
    status: ReviewStatus;
    rating: number | null;
    id: string;
    isPublic: boolean;
    published_at: Date | null;
    created_at: Date;
    updated_at: Date;
};
