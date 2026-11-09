import 'dotenv/config';

export function premiumActivatedTemplate(name: string): string {
    const user = name.split(' ')[0];
    return `
    <div style="background-color:#f4f4f4;padding:24px 0;font-family:Arial, sans-serif;">
      <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">
        
        <!-- Header -->
        <div style="background:#111827;padding:16px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;">SafePlay</h1>
          <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">
            Sua assinatura Premium foi ativada
          </p>
        </div>

        <!-- Content -->
        <div style="padding:24px;">
          <p style="margin:0 0 12px;font-size:16px;color:#111827;">
            Olá, <strong>${user}</strong> 👋
          </p>

          <p style="margin:0 0 12px;font-size:14px;color:#374151;">
            Seja bem-vindo ao <strong>SafePlay Premium</strong>! 🎉
          </p>

          <p style="margin:0 0 16px;font-size:14px;color:#374151;">
            A partir de agora você tem acesso a todos os recursos exclusivos da plataforma:
          </p>

          <ul style="margin:0 0 20px 18px;padding:0;font-size:14px;color:#374151;">
            <li>Acesso completo às funcionalidades;</li>
            <li>Suporte prioritário para a sua conta;</li>
          </ul>

          <a href="${process.env.URL_FRONT_HOME}"
             style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;
                    text-decoration:none;border-radius:6px;font-size:14px;">
            Acessar minha conta Premium
          </a>
        </div>

        <!-- Footer -->
        <div style="padding:12px 24px;border-top:1px solid #e5e7eb;background:#f9fafb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            © ${new Date().getFullYear()} SafePlay. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  `;
}
