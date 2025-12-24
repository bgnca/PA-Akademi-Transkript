
import { PlanType } from '../types';

// Bu servis, sizin oluşturacağınız Backend (Node.js/Python/PHP) sunucusuna istek atar.
// Frontend tarafında API Key veya Secret Key SAKLANMAZ.

interface PaymentInitiateResponse {
  status: 'success' | 'failure';
  htmlContent?: string; // Iyzico/PayTR'den dönen iframe/form HTML'i
  paymentPageUrl?: string; // Stripe gibi sistemler için yönlendirme linki
  errorMessage?: string;
}

// Backend API URL'iniz (Canlıya geçtiğinizde burası gerçek sunucu adresiniz olacak)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const initiatePayment = async (plan: PlanType, price: string, userEmail: string): Promise<PaymentInitiateResponse> => {
  console.log("Ödeme başlatılıyor...", { plan, price, userEmail });

  // --- GERÇEK ENTEGRASYON İÇİN BU KISMI KULLANIN ---
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // Eğer giriş yapmış kullanıcı ise token ekleyin
      },
      body: JSON.stringify({
        planType: plan,
        price: price,
        email: userEmail
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { status: 'failure', errorMessage: 'Sunucu ile bağlantı kurulamadı.' };
  }
  */

  // --- ŞİMDİLİK MOCK (SİMÜLASYON) CEVABI DÖNÜYORUZ ---
  // Sanki backend bize Iyzico/PayTR'den gelen bir iframe HTML'i dönmüş gibi davranıyoruz.
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        htmlContent: `
          <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f8fafc; color:#334155; font-family:sans-serif;">
            <div style="padding:20px; border:1px solid #e2e8f0; background:white; border-radius:10px; text-align:center;">
              <h3 style="margin-bottom:10px; color:#4f46e5;">Sanal POS Simülasyonu</h3>
              <p>Burası Iyzico / PayTR Ödeme Ekranı Olacak</p>
              <p><strong>Paket:</strong> ${plan}</p>
              <p><strong>Tutar:</strong> ${price}</p>
              <br/>
              <button onclick="window.parent.postMessage('payment-success', '*')" style="background:#16a34a; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; font-weight:bold;">
                Başarılı Ödeme Simüle Et
              </button>
              <button onclick="window.parent.postMessage('payment-failed', '*')" style="background:#dc2626; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; margin-left:10px;">
                Başarısız
              </button>
            </div>
            <p style="font-size:12px; margin-top:20px; color:#94a3b8;">Bu alan Backend'den gelen HTML/Iframe içeriğidir.</p>
          </div>
        `
      });
    }, 1500);
  });
};
