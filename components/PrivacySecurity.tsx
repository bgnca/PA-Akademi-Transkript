
import React from 'react';
import { Shield, Lock, Server, Eye, FileCheck, ArrowLeft } from 'lucide-react';

interface PrivacySecurityProps {
  onBack: () => void;
}

const PrivacySecurity: React.FC<PrivacySecurityProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Geri Dön
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-indigo-900 text-white px-8 py-10 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl font-bold mb-2">Veri Güvenliği ve Gizlilik Politikası</h1>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              Psikoloji Ağı Transkript Uygulaması, danışan mahremiyetini ve veri güvenliğini en üst düzeyde tutmak üzere tasarlanmıştır.
            </p>
          </div>

          <div className="p-8 sm:p-12 space-y-12">
            
            {/* Core Principle */}
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Yerel İşleme Prensibi (Local-First)</h3>
                <p className="text-slate-600 leading-relaxed">
                  Uygulamamız, ses dosyalarınızı kalıcı olarak sunucularımızda <strong>saklamaz</strong>. 
                  Yüklediğiniz dosyalar tarayıcınızın belleğinde işlenir ve sadece transkripsiyon işlemi için şifreli bir tünel üzerinden Google Gemini API servisine iletilir. 
                  İşlem bittiğinde ses dosyası RAM'den silinir. Veritabanımızda ses kaydı tutulmaz.
                </p>
              </div>
            </div>

            {/* Encryption */}
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Uçtan Uca Şifreleme</h3>
                <p className="text-slate-600 leading-relaxed">
                  Cihazınız ile AI motoru arasındaki tüm veri trafiği <strong>TLS 1.3 (Transport Layer Security)</strong> standardı ile şifrelenir. 
                  Bu, verilerinizin transfer sırasında üçüncü şahıslar tarafından ele geçirilmesini imkansız kılar.
                  Kredi kartı bilgileriniz sistemimizde saklanmaz, doğrudan ödeme sağlayıcı (BDDK Lisanslı) tarafından işlenir.
                </p>
              </div>
            </div>

            {/* AI Privacy */}
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Yapay Zeka ve Veri Öğrenimi</h3>
                <p className="text-slate-600 leading-relaxed">
                  Kullandığımız Google Enterprise API sözleşmesi gereği, gönderilen ses kayıtları ve metin dökümleri 
                  <strong>modeli eğitmek için kullanılmaz</strong>. 
                  Verileriniz izole bir konteynerde işlenir ve işlem sonrası imha edilir.
                </p>
              </div>
            </div>

            {/* Compliance */}
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">KVKK ve GDPR Uyumluluğu</h3>
                <p className="text-slate-600 leading-relaxed">
                  Platformumuz 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Genel Veri Koruma Tüzüğü (GDPR) standartlarına uygundur.
                  Danışanlarınızın isimlerini veya kimlik bilgilerini sisteme girmek zorunda değilsiniz; "Rumuz" (Alias) sistemi ile tam anonimlik sağlayabilirsiniz.
                </p>
              </div>
            </div>

          </div>

          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm">
              Bu belge en son 15.10.2023 tarihinde güncellenmiştir. Sorularınız için: <a href="#" className="text-indigo-600 underline">guvenlik@psikolojiagi.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurity;
