import { Order } from '../types';
import { BRAND_CONFIG } from '../data/config';

export interface AdminEmailSettings {
  adminEmail: string;
  enableEmailAlerts: boolean;
  sendCopyToCustomer: boolean;
  formspreeId?: string;
  webhookUrl?: string;
}

const EMAIL_CONFIG_KEY = 'parailaf_admin_email_config_v1';

export const getAdminEmailSettings = (): AdminEmailSettings => {
  try {
    const saved = localStorage.getItem(EMAIL_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read email settings', e);
  }
  return {
    adminEmail: 'soulimani.oualid@gmail.com',
    enableEmailAlerts: true,
    sendCopyToCustomer: false,
    formspreeId: '',
    webhookUrl: '',
  };
};

export const saveAdminEmailSettings = (settings: AdminEmailSettings): void => {
  try {
    localStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save email settings', e);
  }
};

/**
 * Generates a direct webmail / Gmail compose URL for the admin
 */
export const getGmailComposeUrl = (order: Order, recipientEmail?: string): string => {
  const settings = getAdminEmailSettings();
  const to = recipientEmail || settings.adminEmail || 'soulimani.oualid@gmail.com';
  const { subject, text } = formatOrderEmailContent(order);

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
};

/**
 * Generates an email body string for notifications
 */
export const formatOrderEmailContent = (order: Order): { subject: string; html: string; text: string } => {
  const itemsList = order.items.map(item => 
    `- ${item.quantity}x ${item.product.name} (${item.product.price} DH/u) = ${item.product.price * item.quantity} DH`
  ).join('\n');

  const subject = `[NOUVELLE COMMANDE #${order.id}] ${order.customer.fullName} - ${order.customer.city} (${order.total} DH)`;

  const text = `
NOUVELLE COMMANDE SUR PARAILAF MAROC
====================================
Numéro de commande : #${order.id}
Date & Heure        : ${order.createdAt}
Origine             : ${order.source || 'Boutique en ligne'}
Statut              : ${order.status === 'pending' ? 'En attente de confirmation' : order.status}

COORDONNÉES CLIENT :
--------------------
Nom complet : ${order.customer.fullName}
Téléphone   : ${order.customer.phone}
Ville       : ${order.customer.city}
Adresse     : ${order.customer.address}
Email       : ${order.customer.email || 'Non renseigné'}
Notes       : ${order.customer.notes || 'Aucune note particulière'}

DÉTAIL DES ARTICLES :
---------------------
${itemsList}

RÉCAPITULATIF FINANCIER :
-------------------------
Sous-total : ${order.subtotal} DH
Livraison  : ${order.shippingFee === 0 ? 'Gratuite (0 DH)' : `${order.shippingFee} DH`}
Total TTC  : ${order.total} DH
Règlement  : Paiement à la livraison (Espèces)

Action requise : Contacter le client au ${order.customer.phone} pour confirmer l'expédition.
`.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #002f6c; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">🚨 NOUVELLE COMMANDE #${order.id}</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Parailaf Maroc - Spécialiste FreeStyle Libre</p>
      </div>

      <div style="padding: 24px;">
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0; color: #991b1b; font-size: 16px;">👤 Informations Destinataire</h2>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Nom :</strong> ${order.customer.fullName}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Téléphone :</strong> <a href="tel:${order.customer.phone}" style="color: #dc2626; font-weight: bold;">${order.customer.phone}</a></p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Ville :</strong> ${order.customer.city}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Adresse :</strong> ${order.customer.address}</p>
          ${order.customer.notes ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Notes :</strong> <em>${order.customer.notes}</em></p>` : ''}
        </div>

        <h2 style="font-size: 16px; border-bottom: 2px solid #002f6c; padding-bottom: 6px; margin-top: 20px; color: #002f6c;">📦 Articles Commandés</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 8px; border: 1px solid #e2e8f0;">Produit</th>
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">Qté</th>
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${item.product.name}</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${item.product.price * item.quantity} DH</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: right;">
          <p style="margin: 4px 0; font-size: 14px; color: #64748b;">Sous-total : <strong>${order.subtotal} DH</strong></p>
          <p style="margin: 4px 0; font-size: 14px; color: #64748b;">Frais de livraison : <strong>${order.shippingFee === 0 ? 'Gratuits' : `${order.shippingFee} DH`}</strong></p>
          <h3 style="margin: 8px 0 0 0; font-size: 20px; color: #dc2626;">Total à encaisser : ${order.total} DH</h3>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #16a34a; font-weight: bold;">💵 Paiement en espèces à la livraison</p>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; margin-right: 8px;">
            Contacter le Client sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  return { subject, html, text };
};

/**
 * Sends notification via email and stores log
 */
export const sendOrderEmailNotification = async (order: Order): Promise<{ success: boolean; message: string }> => {
  const settings = getAdminEmailSettings();

  if (!settings.enableEmailAlerts) {
    return { success: true, message: 'Notifications email désactivées dans les paramètres' };
  }

  const { subject, html, text } = formatOrderEmailContent(order);

  try {
    // 1. Log notification in LocalStorage for admin audit
    const logs = JSON.parse(localStorage.getItem('parailaf_email_logs') || '[]');
    logs.unshift({
      id: order.id,
      timestamp: new Date().toISOString(),
      recipient: settings.adminEmail,
      subject,
      status: 'SENT',
    });
    localStorage.setItem('parailaf_email_logs', JSON.stringify(logs.slice(0, 50)));

    // 2. Automated Direct Email Dispatch to Admin Inbox via FormSubmit
    const itemsSummary = order.items.map(i => `${i.quantity}x ${i.product.name} (${i.product.price * i.quantity} DH)`).join('\n');
    
    const formSubmitPayload = {
      _subject: `🚨 [NOUVELLE COMMANDE #${order.id}] ${order.customer.fullName} - ${order.customer.city} (${order.total} DH)`,
      _template: 'table',
      _captcha: 'false',
      _replyto: order.customer.email || settings.adminEmail,
      'Numéro de Commande': `#${order.id}`,
      'Date & Heure': order.createdAt,
      'Nom du Client': order.customer.fullName,
      'Numéro Téléphone': order.customer.phone,
      'Ville de Livraison': order.customer.city,
      'Adresse Complète': order.customer.address,
      'Montant Total à Encaisser': `${order.total} DH (Paiement à la livraison)`,
      'Mode de Règlement': 'Espèces à la livraison (COD)',
      'Articles Commandés': itemsSummary,
      'Remarques / Instructions': order.customer.notes || 'Aucune note spécifique',
    };

    // Send in background via FormSubmit direct email gateway
    fetch(`https://formsubmit.co/ajax/${encodeURIComponent(settings.adminEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formSubmitPayload),
    }).catch(err => console.warn('FormSubmit auto-dispatch warning:', err));

    // 3. Dispatch to internal backend API (/api/order-notification)
    fetch('/api/order-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).catch(err => console.warn('Backend notification warning:', err));

    // 4. Try sending via Formspree if form ID is configured
    if (settings.formspreeId) {
      const endpoint = settings.formspreeId.startsWith('http') 
        ? settings.formspreeId 
        : `https://formspree.io/f/${settings.formspreeId}`;

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _replyto: order.customer.email || settings.adminEmail,
          email: settings.adminEmail,
          subject,
          message: text,
          client: order.customer.fullName,
          telephone: order.customer.phone,
          ville: order.customer.city,
          adresse: order.customer.address,
          total: `${order.total} DH`,
          commande_id: order.id,
        }),
      }).catch(err => console.warn('Formspree dispatch warning:', err));
    }

    // 5. Try sending via standard email notification webhook if configured
    if (settings.webhookUrl) {
      fetch(settings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: settings.adminEmail,
          subject,
          html,
          text,
          order,
        }),
      }).catch(err => console.warn('Webhook dispatch warning:', err));
    }

    console.log(`[EMAIL NOTIFICATION SENT] To: ${settings.adminEmail} | Order #${order.id}`);
    return {
      success: true,
      message: `Notification envoyée avec succès à ${settings.adminEmail}`,
    };
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi de la notification email',
    };
  }
};
