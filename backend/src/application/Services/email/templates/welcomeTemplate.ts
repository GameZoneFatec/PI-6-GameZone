import 'dotenv/config';

export function welcomeTemplate(name: string): string {
    return `
    <div style="background-color:#f4f4f4;padding:32px 0;font-family:Arial, sans-serif;">
      <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:8px;
                  overflow:hidden;border:1px solid #e5e5e5;">

        <!-- HEADER -->
        <div style="background:#111827;padding:24px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;">SafePlay</h1>
        </div>

        <!-- CONTENT -->
        <div style="padding:28px;">

          <p style="margin:0 0 12px;font-size:16px;color:#111827;">
            Olá, <strong>${name}</strong> 👋
          </p>

          <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.5;">
            Sua conta no <strong>SafePlay</strong> foi criada com sucesso! 🎉
          </p>

          <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.5;">
            Agora você já pode acessar a plataforma, explorar os recursos e aproveitar todos os benefícios.
          </p>

          <!-- BUTTON -->
          <a href="${process.env.URL_FRONT_HOME}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#2563eb;
              color:#ffffff;
              text-decoration:none;
              border-radius:6px;
              font-size:14px;
              font-weight:bold;
            ">
            Acessar minha conta
          </a>

          <p style="margin:24px 0 0;font-size:12px;color:#6b7280;line-height:1.5;">
            Se você não criou esta conta, pode ignorar este e-mail.
          </p>

        </div>

        <!-- FOOTER -->
        <div style="padding:14px 24px;border-top:1px solid #e5e7eb;background:#f9fafb;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            © ${new Date().getFullYear()} SafePlay. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </div>
  `;
}
