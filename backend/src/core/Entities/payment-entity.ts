export type createPayment = {
    user_id: string;
    mp_payment_id?: string;
    description: string;
    price: number;
    payer_email: string;
    status: string;
    qr_code: string;
    qr_code_base64: string;
    qr_valid: Date;
    finished?: boolean;
};

export type updatePayment = {
    user_id?: string;
    mp_payment_id?: string;
    description?: string;
    price?: number;
    payer_email?: string;
    status?: string;
    qr_code?: string;
    qr_code_base64?: string;
    qr_valid?: Date;
    finished?: boolean;
};
