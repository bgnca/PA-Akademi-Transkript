
import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin, FileText } from 'lucide-react';

interface PageProps {
  onBack: () => void;
}

export const TermsConditions: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Geri Dön
        </button>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-600" />
          Kullanım Şartları
        </h1>
        
        <div className="prose prose-slate max-w-none">
          <h3>1. Giriş</h3>
          <p>Bu uygulama ("Psikoloji Ağı Transkript"), profesyonel psikologların seans notlarını dijitalleştirmelerine yardımcı olmak amacıyla tasarlanmıştır.</p>
          
          <h3>2. Hizmet Kullanımı</h3>
          <p>Kullanıcılar, sistemi sadece yasal ve etik sınırlar çerçevesinde kullanmayı taahhüt eder. Danışan mahremiyeti kullanıcının sorumluluğundadır.</p>
          
          <h3>3. Veri İşleme</h3>
          <p>Ses kayıtları geçici olarak işlenir ve kalıcı olarak saklanmaz. Detaylar için Gizlilik Politikasına bakınız.</p>
          
          <h3>4. Üyelik ve İptal</h3>
          <p>Üyelik paketleri aylık olarak yenilenir. Kullanıcı dilediği zaman iptal edebilir, ancak iade yapılmaz.</p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Geri Dön
        </button>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8">İletişim</h1>
        <p className="text-slate-600 mb-12 text-lg">
          Sorularınız, önerileriniz veya kurumsal işbirlikleri için bize ulaşın. Ekibimiz en geç 24 saat içinde dönüş yapacaktır.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
             <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
               <Mail className="w-6 h-6" />
             </div>
             <div>
               <h3 className="font-bold text-slate-900">E-posta</h3>
               <p className="text-slate-600 mt-1">destek@psikolojiagi.com</p>
               <p className="text-slate-600">info@psikolojiagi.com</p>
             </div>
           </div>

           <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
             <div className="bg-green-100 p-3 rounded-lg text-green-600">
               <Phone className="w-6 h-6" />
             </div>
             <div>
               <h3 className="font-bold text-slate-900">Telefon</h3>
               <p className="text-slate-600 mt-1">+90 (850) 123 45 67</p>
               <p className="text-xs text-slate-400 mt-1">Hafta içi 09:00 - 18:00</p>
             </div>
           </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-sm border-t border-slate-100 pt-8">
           <MapPin className="w-5 h-5" />
           <span>Levent, Büyükdere Cd. No:123, 34394 Şişli/İstanbul</span>
        </div>
      </div>
    </div>
  );
};
