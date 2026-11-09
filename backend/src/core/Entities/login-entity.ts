export type LoginEntity = {
    email: string;
    password: string;
};

export type LoginResponse = {
    userId: string;
    name: string;
    email: string;
    username: string;
    premium: boolean;
    plan_expires_at: Date | null;
    token: string;
};
