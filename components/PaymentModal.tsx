
import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, CheckCircle, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { PlanType } from '../types';
import { initiatePayment } from '../services/paymentService';

interface PaymentModalProps {
  plan: PlanType;
  price: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, price, onClose, onSuccess }) => {
  const [step, setStep] = useState<'loading' | 'iframe' | 'success' | 'error'>('loading');
  const [iframeContent, setIframeContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Ödeme işlemini başlat
  useEffect(() => {
    const startPayment = async () => {
      try {
        const result = await initiatePayment(plan, price, 'user@example.com');
        
        if (result.status === 'success' && result.htmlContent) {
          setIframeContent(result.htmlContent);
          setStep('iframe');
        } else if (result.paymentPageUrl) {
          // Stripe gibi redirect gerektiren durumlar için
          window.location.href = result.paymentPageUrl;
        } else {
          setErrorMessage(result.errorMessage || 'Ödeme başlatılamadı.');
          setStep('error');
        }
      } catch (err) {
        setErrorMessage('Sunucu hatası oluştu.');
        setStep('error');
      }
    };

    startPayment();
  }, [plan, price]);

  // Iframe'den gelen mesajları dinle (Başarılı/Başarısız ödeme için)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Güvenlik: event.origin kontrolü yapılmalı (prodüksiyonda)
      if (event.data === 'payment-success') {
        setStep('success');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else if (event.data === 'payment-failed') {
        setErrorMessage('Ödeme işlemi banka tarafından reddedildi.');
        setStep('error');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative min-h-[500px] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-slate-800">Güvenli Ödeme</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow relative flex flex-col">
          
          {/* 1. Loading State */}
          {step === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white z-10">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-slate-800">Ödeme Sayfası Hazırlanıyor...</h3>
              <p className="text-slate-500 text-sm mt-2">Banka ile güvenli bağlantı kuruluyor.</p>
            </div>
          )}

          {/* 2. Iframe / Payment Form State */}
          {step === 'iframe' && (
            <div className="w-full h-full flex-grow bg-slate-50">
               {/* 
                  NOT: dangerouslySetInnerHTML güvenlik riski oluşturabilir. 
                  Gerçek entegrasyonda Backend size doğrudan bir URL verirse 
                  bunu <iframe src={url} /> şeklinde kullanmak daha güvenlidir.
                  Burada simülasyon için HTML inject ediyoruz.
               */}
               <iframe 
                  srcDoc={iframeContent}
                  className="w-full h-full border-0 min-h-[400px]"
                  title="Ödeme Formu"
               />
            </div>
          )}

          {/* 3. Success State */}
          {step === 'success' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white z-20 animate-in zoom-in">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Ödeme Başarılı!</h3>
              <p className="text-slate-600">Üyeliğiniz hesabınıza tanımlanıyor, lütfen bekleyiniz...</p>
            </div>
          )}

          {/* 4. Error State */}
          {step === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white z-20 animate-in zoom-in">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-red-700 mb-2">Ödeme Başarısız</h3>
              <p className="text-slate-600 mb-6">{errorMessage}</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors"
              >
                Kapat ve Tekrar Dene
              </button>
            </div>
          )}

        </div>

        {/* Footer info (only visible if not success) */}
        {step !== 'success' && (
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400 flex items-center justify-center gap-1 flex-shrink-0">
                <Lock className="w-3 h-3" />
                256-bit SSL ile güvenli ödeme altyapısı
            </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
