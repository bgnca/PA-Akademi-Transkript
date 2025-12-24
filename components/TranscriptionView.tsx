
import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Download, Type, Edit2, Save, X, FileText, Sparkles, Loader2, GraduationCap, Play, MessageSquare, Bot, Send, User, FileJson, FileType, CheckSquare, Square } from 'lucide-react';
import { TranscriptSegment, ChatMessage } from '../types';
import { chatWithSessionAI, suggestChatQuestions } from '../services/geminiService';
import AudioPlayer from './AudioPlayer';
import { parseTimestamp } from '../utils/audioUtils';
import { generateTXT, generateDOCX, generatePDF, ExportFormat } from '../utils/exportUtils';

interface TranscriptionViewProps {
  transcriptData: string | TranscriptSegment[];
  report?: string;
  critique?: string;
  audioUrl?: string | null;
  onUpdateText: (newText: string | TranscriptSegment[]) => void;
  onGenerateReport: (approach: string) => void;
  onGenerateCritique: (approach: string) => void;
  isGeneratingReport: boolean;
  isGeneratingCritique: boolean;
}

const TranscriptionView: React.FC<TranscriptionViewProps> = ({ 
  transcriptData, 
  report,
  critique,
  audioUrl,
  onUpdateText, 
  onGenerateReport,
  onGenerateCritique,
  isGeneratingReport,
  isGeneratingCritique
}) => {
  const [activeTab, setActiveTab] = useState<'transcript' | 'report' | 'critique' | 'chat'>('transcript');
  const [isEditing, setIsEditing] = useState(false);
  const [reportApproach, setReportApproach] = useState("Bilişsel Davranışçı Terapi (BDT)");
  const [critiqueApproach, setCritiqueApproach] = useState("Bilişsel Davranışçı Terapi (BDT)");
  
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);

  useEffect(() => {
    if (typeof transcriptData === 'string') {
        const lines = transcriptData.split('\n');
        setSegments(lines.map((l, i) => ({ id: i, speaker: l.startsWith('P:') ? 'P' : 'D', text: l.replace(/^[PD]:/, '').trim(), timestamp: '00:00' })));
    } else {
        setSegments(transcriptData);
    }
  }, [transcriptData]);

  const handlePlaySegment = (timestampStr: string) => {
     if (!audioPlayerRef.current || !audioUrl) {
       alert("Ses dosyası bu oturumda yüklü değil.");
       return;
     }
     const seconds = parseTimestamp(timestampStr);
     audioPlayerRef.current.currentTime = seconds;
     audioPlayerRef.current.play();
  };

  const handleSaveEdit = () => {
    onUpdateText(segments);
    setIsEditing(false);
  };

  const therapyApproaches = [
    "Bilişsel Davranışçı Terapi (BDT)",
    "Şema Terapi",
    "Psikodinamik Terapi",
    "Varoluşçu Terapi",
    "Gestalt Terapi",
    "Kabul ve Kararlılık Terapisi (ACT)",
    "Bütüncül / Eklektik"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col h-[850px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      
      {/* Tabs */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg">
          {(['transcript', 'chat', 'report', 'critique'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-hidden relative flex flex-col">
        {activeTab === 'transcript' && (
          <div className="h-full flex flex-col">
            <AudioPlayer audioUrl={audioUrl || null} refProp={audioPlayerRef} />
            <div className="flex justify-between items-center px-6 py-2 border-b border-slate-100 bg-white">
              <span className="text-xs text-slate-500 font-medium">Konuşmacı ayrımı ve zaman damgaları yapay zeka tarafından oluşturuldu.</span>
              <button 
                onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
              >
                {isEditing ? <><Save className="w-3 h-3" /> Kaydet</> : <><Edit2 className="w-3 h-3" /> Düzenle</>}
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
              {segments.map((seg) => (
                <div key={seg.id} className="flex gap-4 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${seg.speaker === 'P' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                    {seg.speaker}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{seg.speaker === 'P' ? 'Psikolog' : 'Danışan'}</span>
                      <button onClick={() => handlePlaySegment(seg.timestamp)} className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                        <Play className="w-3 h-3 fill-current" /> {seg.timestamp}
                      </button>
                    </div>
                    {isEditing ? (
                      <textarea 
                        value={seg.text} 
                        onChange={(e) => setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, text: e.target.value } : s))}
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="p-3 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-700 text-sm leading-relaxed">{seg.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="h-full p-8 overflow-y-auto custom-scrollbar">
            {!report ? (
              <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-6">
                <FileText className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Seans Raporu Oluştur</h3>
                <p className="text-slate-600 max-w-md mb-6">Hangi ekol çerçevesinde rapor oluşturulmasını istersiniz?</p>
                
                <div className="w-full max-w-xs mb-8">
                  <select 
                    value={reportApproach} 
                    onChange={(e) => setReportApproach(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {therapyApproaches.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <button
                  onClick={() => onGenerateReport(reportApproach)}
                  disabled={isGeneratingReport}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingReport ? <><Loader2 className="w-5 h-5 animate-spin" /> Oluşturuluyor...</> : <><Sparkles className="w-5 h-5" /> Raporu Hazırla</>}
                </button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100 prose prose-slate">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">{report}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'critique' && (
          <div className="h-full p-8 overflow-y-auto custom-scrollbar">
            {!critique ? (
              <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-6">
                <GraduationCap className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Süpervizör Geri Bildirimi</h3>
                <p className="text-slate-600 max-w-md mb-6">Yapay zeka süpervizörünüz seansı hangi bakış açısıyla eleştirsin?</p>
                
                <div className="w-full max-w-xs mb-8">
                  <select 
                    value={critiqueApproach} 
                    onChange={(e) => setCritiqueApproach(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {therapyApproaches.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <button
                  onClick={() => onGenerateCritique(critiqueApproach)}
                  disabled={isGeneratingCritique}
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingCritique ? <><Loader2 className="w-5 h-5 animate-spin" /> İnceleniyor...</> : <><GraduationCap className="w-5 h-5" /> Analizi Başlat</>}
                </button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100 prose prose-slate">
                <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">{critique}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex flex-col bg-slate-50">
             <div className="flex-grow p-6 flex flex-col items-center justify-center text-center opacity-50">
               <Bot className="w-12 h-12 mb-4" />
               <p className="text-slate-600">Bu seans özelinde klinik asistanla sohbet edin.</p>
               <span className="text-xs bg-slate-200 px-2 py-1 rounded mt-2">Aktif Transkript Kullanılıyor</span>
             </div>
             <div className="p-4 bg-white border-t border-slate-200">
               <input className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Bir soru sorun..." />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionView;
