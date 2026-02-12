/**
 * MercadoPago Service Layer (Silicon Valley Tier)
 * Using Skills: @payment-integration, @api-security-best-practices
 */

export class MP_Service {
  private accessToken: string;
  private webhookSecret: string;

  constructor(accessToken: string, webhookSecret: string) {
    this.accessToken = accessToken;
    this.webhookSecret = webhookSecret;
  }

  /**
   * Verifies the x-signature header from MercadoPago Webhooks
   * @api-security-best-practices: Enforces HMAC-SHA256 integrity check
   */
  async verifySignature(
    xSignature: string,
    xRequestId: string,
    dataId: string
  ): Promise<boolean> {
    try {
      // 1. Extract ts and v1 from header (e.g., ts=123,v1=hash)
      const parts = xSignature.split(',');
      const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
      const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1];

      if (!ts || !v1) return false;

      // 2. Construct the signature base string (@payment-integration spec)
      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

      // 3. Perform HMAC-SHA256 verification using Web Crypto API
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(this.webhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(manifest)
      );

      const hashHex = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      return hashHex === v1;
    } catch (e) {
      console.error("[MP_Service] Signature verification failed:", e);
      return false;
    }
  }

  /**
   * Creates a Preapproval (Subscription) for a user
   */
  async createSubscription(userId: string, email: string, appUrl: string) {
    const response = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID()
      },
      body: JSON.stringify({
        back_url: `${appUrl}/dashboard`,
        reason: "JACI Squad Monthly Membership",
        external_reference: userId,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 99,
          currency_id: "MXN"
        },
        payer_email: email,
        status: "pending"
      })
    });

    return await response.json();
  }

  /**
   * Creates a One-off Preference for a past drop
   */
  async createOneOffPreference(userId: string, dropId: string, title: string, appUrl: string) {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID()
      },
      body: JSON.stringify({
        items: [{
          id: dropId,
          title: `JACI Drop: ${title}`,
          quantity: 1,
          unit_price: 99,
          currency_id: "MXN"
        }],
        external_reference: userId,
        back_urls: {
          success: `${appUrl}/dashboard?status=success`,
          pending: `${appUrl}/dashboard?status=pending`,
          failure: `${appUrl}/dashboard?status=failure`
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/webhooks/mercadopago`
      })
    });

    return await response.json();
  }

  /**
   * Fetches the latest payment details from MP API
   * @payment-integration: Server-side validation is mandatory
   */
  async getPayment(paymentId: string) {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { "Authorization": `Bearer ${this.accessToken}` }
    });
    return await response.json();
  }
}
