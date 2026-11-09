export function verifyEmailTemplate(name: string, verifyUrl: string): string {
    const user = name.split(' ')[0];
    return `
    <div style="background-color:#f4f4f4;padding:24px 0;font-family:Arial, sans-serif;">
      <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">
        <div style="background:#111827;padding:16px 24px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;">SafePlay</h1>
        </div>
        <div style="padding:24px;">
              <p style="margin:0 0 12px;font-size:16px;color:#111827;">
                Olá, <strong>${user}</strong> 👋
              </p>
              <p style="margin:0 0 16px;font-size:14px;color:#374151;">
                Para finalizar seu cadastro no <strong>SafePlay</strong>, confirme seu e-mail clicando no botão abaixo.
              </p>
              <a href="${verifyUrl}"
                 style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;
                        text-decoration:none;border-radius:6px;font-size:14px;">
                Confirmar meu e-mail
              </a>
              <p style="margin:24px 0 0;font-size:12px;color:#6b7280;">
                Se você não criou esta conta, pode ignorar este e-mail.
              </p>
        </div>
        <div style="padding:12px 24px;border-top:1px solid:#e5e7eb;background:#f9fafb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} SafePlay. Todos os direitos reservados.
              </p>
        </div>
      </div>
    </div>
  `;
}
