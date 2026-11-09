import MercadoPagoConfig, { Payment } from 'mercadopago';
import 'dotenv/config';

const mp = new MercadoPagoConfig({
    accessToken: process.env.MP_ACESS_TOKEN!,
});

export const payment = new Payment(mp);
