
export class ResendService {
  private apiKey: string;
  private fromEmail: string = "JACI <hola@jacilandia.mx>";

  constructor(apiKey: string) {
    this.apiKey = apiKey.trim();
  }

  async sendEmail(to: string, subject: string, html: string) {
    // 🧪 SILICON VALLEY STANDARD: Using fetch over heavy SDKs for Workers speed
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.fromEmail,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[RESEND ERROR]", error);
      throw new Error("Failed to send email");
    }

    return await response.json();
  }

  async sendPasswordReset(to: string, resetUrl: string) {
    const html = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0f172a;">Recuperar tu contraseña de JACI</h2>
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña para tu acceso a la Bóveda JACI. Haz clic en el siguiente botón para continuar:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px;">Restablecer Contraseña</a>
        </div>
        <p style="font-size: 12px; color: #666;">Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 10px; color: #999;">Jacilandia.mx - Innovación Educativa</p>
      </div>
    `;
    return this.sendEmail(to, "Restablecer tu contraseña - JACI", html);
  }
}
