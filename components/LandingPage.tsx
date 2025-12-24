
import React from 'react';
import { BrainCircuit, ArrowRight, Star, Users, Globe, Shield, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onViewPricing: () => void;
  onViewSample: () => void;
  onViewPrivacy: () => void;
  onViewTerms: () => void;
  onViewContact: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onLogin, 
  onRegister, 
  onViewPricing, 
  onViewSample,
  onViewPrivacy,
  onViewTerms,
  onViewContact
}) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent hidden sm:inline">
              Psikoloji Ağı
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              onClick={onViewPricing}
              className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors hidden sm:block"
            >
              Ücretlendirme
            </button>
            <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
            <button onClick={onLogin} className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors">
              Giriş Yap
            </button>
            <button 
              onClick={onRegister}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-sm shadow-lg shadow-indigo-200 transition-all hover:scale-105"
            >
              Ücretsiz Dene
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Star className="w-4 h-4 fill-current" />
            2000+ Psikolog tarafından tercih ediliyor
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
            Seanslarınızı <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Yapay Zeka</span> ile Analiz Edin
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Ses kayıtlarını saniyeler içinde metne dökün, klinik raporlar oluşturun ve süpervizyon desteği alın. Tamamen güvenli ve KVKK uyumlu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
               onClick={onRegister}
               className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-lg shadow-xl shadow-indigo-300 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Hemen Başla <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onViewSample}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-full text-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Örnek Raporu İncele
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Otomatik Transkripsiyon</h3>
              <p className="text-slate-600">
                Gelişmiş ses tanıma motorumuz, konuşmacıları (Psikolog/Danışan) ayırt eder ve %98 doğrulukla metne döker.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Uçtan Uca Güvenlik</h3>
              <p className="text-slate-600">
                Verileriniz yerel olarak işlenir. Sunucularımızda asla ses kaydı saklanmaz. Hasta mahremiyeti güvence altında.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Süpervizör</h3>
              <p className="text-slate-600">
                Seans dökümünüzü dilediğiniz ekolde (BDT, Şema, Analitik) analiz ettirin ve gelişim alanlarını keşfedin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-white font-bold text-2xl">
            <BrainCircuit className="w-8 h-8" />
            Psikoloji Ağı
          </div>
          <p className="mb-6 max-w-md mx-auto">
            Psikologlar için, psikologlar tarafından geliştirildi.
            <br />
            Teknoloji ve klinik deneyimin mükemmel uyumu.
          </p>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all text-slate-400">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all text-slate-400">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all text-slate-400">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all text-slate-400">
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm border-t border-slate-800 pt-8">
            <button onClick={onViewPrivacy} className="hover:text-white transition-colors">Gizlilik Politikası</button>
            <button onClick={onViewTerms} className="hover:text-white transition-colors">Kullanım Şartları</button>
            <button onClick={onViewContact} className="hover:text-white transition-colors">İletişim</button>
          </div>
          <p className="mt-8 text-xs opacity-50">© 2024 Psikoloji Ağı. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
