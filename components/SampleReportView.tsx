
import React, { useState } from 'react';
import TranscriptionView from './TranscriptionView';
import { ArrowLeft, Info } from 'lucide-react';
import { TranscriptSegment } from '../types';

interface SampleReportViewProps {
  onBack: () => void;
}

const SAMPLE_TRANSCRIPT: TranscriptSegment[] = [
  { id: 1, speaker: 'P', text: 'Hoş geldiniz. Geçen haftadan bu yana nasılsınız, hafta nasıl geçti?', timestamp: '00:05' },
  { id: 2, speaker: 'D', text: 'Aslında biraz karmaşıktı. İş yerinde o bahsettiğim sunumu yaptım.', timestamp: '00:12' },
  { id: 3, speaker: 'P', text: 'Nasıl hissettirdi sunum anı? Beklediğiniz o felaket senaryosu gerçekleşti mi?', timestamp: '00:18' },
  { id: 4, speaker: 'D', text: 'Tam olarak değil ama sesim titredi. Herkesin bana bakıp "ne kadar yetersiz" diye düşündüğünü hissettim.', timestamp: '00:25' },
  { id: 5, speaker: 'P', text: 'Bunu hissetmeniz çok doğal. Ancak "herkesin öyle düşündüğü" kısmı sizin yorumunuz olabilir mi? Somut bir tepki aldınız mı?', timestamp: '00:35' },
  { id: 6, speaker: 'D', text: 'Hayır, aslında müdürüm sunumdan sonra teşekkür etti. Ama sanki acıdığı için yaptı gibi geldi.', timestamp: '00:45', isUnclear: true },
  { id: 7, speaker: 'P', text: 'Bakın burada yine zihin okuma devrede. Olumlu geri bildirimi bile olumsuza çeviren bir filtreniz var.', timestamp: '00:55' }
];

const SAMPLE_REPORT = `
# Seans Analiz Raporu

## 1. Klinik Özet
Danışan, iş yerindeki performans kaygısı ve sosyal değerlendirilme korkusu temalarıyla seansa gelmiştir. Geçen hafta verilen maruz bırakma ödevi (sunum yapma) tamamlanmıştır.

## 2. Duygu Durum ve Bilişsel Analiz
Danışanın baskın duygulanımı **anksiyete** ve **utanç**tır.
Dikkat çeken bilişsel çarpıtmalar:
- **Zihin Okuma:** "Herkes yetersiz olduğumu düşündü."
- **Olumluyu Geçersiz Kılma:** "Müdürüm acıdığı için teşekkür etti."

## 3. Öne Çıkan Klinik Temalar
Yetersizlik şeması tetiklenmiş durumdadır. Başarıyı içselleştirmekte zorluk yaşamaktadır (Imposter sendromu belirtileri).

## 4. Terapist İçin Öneriler
Bilişsel yeniden yapılandırma tekniklerine devam edilmeli. Kanıt inceleme tekniği ile müdürün tepkisi yeniden ele alınabilir.
`;

const SAMPLE_CRITIQUE = `
# Süpervizyon Geri Bildirimi (Bilişsel Davranışçı Terapi)

## 1. Ekol Uyumluluğu
Terapist, BDT tekniklerini (Sokratik Sorgulama) başarıyla uygulamıştır. Özellikle "Somut bir tepki aldınız mı?" sorusu, danışanı gerçekliğe davet etmek için yerinde bir müdahaledir.

## 2. Gelişim Alanları
Danışan "acıdığı için yaptı" dediğinde, terapist biraz hızlı bir şekilde "zihin okuma" etiketini yapıştırmış. Bunun yerine "Size böyle hissettiren kanıtlar nelerdi?" diye sorarak danışanın kendisinin bulması sağlanabilirdi.

## 3. Terapötik İttifak
İttifak güçlü görünüyor, ancak terapistin didaktik tonu bazen empatik yansıtmayı gölgeleyebilir. Duygu odaklı yansıtmalara (Validasyon) daha fazla yer verilebilir.
`;

const SampleReportView: React.FC<SampleReportViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Örnek Seans Analizi</h1>
            <p className="text-xs text-slate-500">Demo Modu - Değişiklikler kaydedilmez</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
           <Info className="w-4 h-4" />
           Bu interaktif bir demodu.
        </div>
      </div>

      <div className="flex-grow p-4 sm:p-8">
        <TranscriptionView 
          transcriptData={SAMPLE_TRANSCRIPT}
          report={SAMPLE_REPORT}
          critique={SAMPLE_CRITIQUE}
          audioUrl={null} // No audio for static demo to avoid confusion
          onUpdateText={() => {}}
          onGenerateReport={() => {}}
          onGenerateCritique={() => {}}
          isGeneratingReport={false}
          isGeneratingCritique={false}
        />
      </div>
    </div>
  );
};

export default SampleReportView;
