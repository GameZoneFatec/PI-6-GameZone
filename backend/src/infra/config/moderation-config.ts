import 'dotenv/config';

/** Quantidade de denúncias abertas que faz o worker ocultar a análise. */
export function reportThreshold(): number {
    const value = Number(process.env.REPORT_THRESHOLD ?? 3);
    return Number.isInteger(value) && value > 0 ? value : 3;
}
