
import React, { useState, useEffect } from 'react';
import AudioRecorder from './AudioRecorder';
import TranscriptionView from './TranscriptionView';
import PricingPlans from './PricingPlans';
import Dashboard from './Dashboard';
import PaymentModal from './PaymentModal';
import { AudioData, SessionRecord, UserCredits, PlanType, TranscriptSegment, ScaleRecord, User, PlanConfig } from '../types';
import { transcribeAudio, generateSessionReport, generateSupervisionCritique, generateBulkSupervision, interpretPsychometricScale } from '../services/geminiService';
import { BrainCircuit, Sparkles, AlertTriangle, Loader2, ArrowRight, LayoutDashboard, Home, CreditCard, Shield, Info, Users, User as UserIcon, Hash, Calendar, Layers, LogOut } from 'lucide-react';
import { formatTime } from '../utils/audioUtils';

// Constants for initial state
const INITIAL_CREDITS: UserCredits = {
  plan: 'Free',
  remainingSeconds: 300, 
  totalSeconds: 300
};

interface UserWorkspaceProps {
  user: User;
  onLogout: () => void;
  plans: PlanConfig[];
}

const UserWorkspace: React.FC<UserWorkspaceProps> = ({ user, onLogout, plans }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'pricing' | 'bulk_result'>('home');
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  const [bulkAnalysisResult, setBulkAnalysisResult] = useState<string | null>(null);

  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<{plan: PlanType, price: string, minutes: number} | null>(null);

  // Data State
  const [userCredits, setUserCredits] = useState<UserCredits>(INITIAL_CREDITS);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [scales, setScales] = useState<ScaleRecord[]>([]);

  // Processing State
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [transcription, setTranscription] = useState<string | TranscriptSegment[] | null>(null);
  const [currentReport, setCurrentReport] = useState<string | undefined>(undefined);
  const [currentCritique, setCurrentCritique] = useState<string | undefined>(undefined);
  
  // New Metadata State for Current Upload
  const [clientAlias, setClientAlias] = useState("");
  const [sessionNumber, setSessionNumber] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingCritique, setIsGeneratingCritique] = useState(false);
  const [isBulkAnalyzing, setIsBulkAnalyzing] = useState(false);
  const [isAnalyzingScale, setIsAnalyzingScale] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedCredits = localStorage.getItem(`psikoscribe_credits_${user.id}`);
    const storedSessions = localStorage.getItem(`psikoscribe_sessions_${user.id}`);
    const storedScales = localStorage.getItem(`psikoscribe_scales_${user.id}`);

    if (storedCredits) {
      setUserCredits(JSON.parse(storedCredits));
    } else {
      saveCredits(INITIAL_CREDITS);
    }

    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }

    if (storedScales) {
      setScales(JSON.parse(storedScales));
    }
  }, [user.id]);

  // Save to LocalStorage with User ID isolation
  const saveCredits = (credits: UserCredits) => {
    setUserCredits(credits);
    localStorage.setItem(`psikoscribe_credits_${user.id}`, JSON.stringify(credits));
  };

  const saveSessions = (newSessions: SessionRecord[]) => {
    setSessions(newSessions);
    localStorage.setItem(`psikoscribe_sessions_${user.id}`, JSON.stringify(newSessions));
  };

  const saveScales = (newScales: ScaleRecord[]) => {
    setScales(newScales);
    localStorage.setItem(`psikoscribe_scales_${user.id}`, JSON.stringify(newScales));
  };

  const handlePlanSelect = (plan: PlanType, minutes: number) => {
    const selected = plans.find(p => p.type === plan);
    const price = selected ? selected.price : "₺0";

    setPendingPlan({ plan, price, minutes });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (pendingPlan) {
        const totalSeconds = pendingPlan.minutes * 60;
        // Logic: Add to existing or reset? Usually add.
        // For simplicity in this demo, we add to remaining.
        saveCredits({
            plan: pendingPlan.plan,
            totalSeconds: userCredits.totalSeconds + totalSeconds,
            remainingSeconds: userCredits.remainingSeconds + totalSeconds 
        });
        setShowPaymentModal(false);
        setPendingPlan(null);
        setError(null);
        setCurrentView('home');
    }
  };

  const handleAudioReady = (data: AudioData) => {
    setAudioData(data);
    setTranscription(null);
    setCurrentReport(undefined);
    setCurrentCritique(undefined);
    setError(null);
    // Reset metadata
    setClientAlias("");
    setSessionNumber("");
    setSessionDate(new Date().toISOString().slice(0, 10));
  };

  const handleClear = () => {
    setAudioData(null);
    setTranscription(null);
    setCurrentReport(undefined);
    setCurrentCritique(undefined);
    setError(null);
  };

  const handleTranscribe = async () => {
    if (!audioData) return;

    if (!clientAlias.trim()) {
        setError("Lütfen bir danışan rumuzu girin.");
        return;
    }

    const estimatedDuration = Math.ceil(audioData.duration || 60); 
    
    if (userCredits.remainingSeconds < estimatedDuration) {
      setError(`Yetersiz bakiye. Bu işlem için ${formatTime(estimatedDuration)} gerekli, ancak bakiyeniz ${formatTime(userCredits.remainingSeconds)}.`);
      return;
    }

    setIsTranscribing(true);
    setError(null);

    try {
      const mimeType = audioData.blob.type || 'audio/webm';
      const result = await transcribeAudio(audioData.blob, mimeType);
      
      setTranscription(result);

      // Deduct credits
      const newCredits = {
        ...userCredits,
        remainingSeconds: Math.max(0, userCredits.remainingSeconds - estimatedDuration)
      };
      saveCredits(newCredits);

      // Save Session Automatically
      const newSession: SessionRecord = {
        id: Date.now().toString(),
        date: sessionDate, // Use user selected date
        title: audioData.fileName || `Seans Kaydı`,
        clientAlias: clientAlias,
        sessionNumber: sessionNumber,
        duration: estimatedDuration,
        transcript: result
      };
      
      saveSessions([newSession, ...sessions]);
      setSelectedSession(newSession); 

    } catch (err: any) {
      console.error("Transcription failed", err);
      let message = "Bir hata oluştu. Lütfen tekrar deneyin.";
      if (err.message.includes("API Key")) {
        message = "API Anahtarı eksik veya hatalı.";
      } else if (err.message.includes("candidate")) {
        message = "Model bu sesi işleyemedi.";
      } else if (err.message.includes("JSON")) {
        message = "Yapay zeka çıktısı işlenemedi. Lütfen tekrar deneyin.";
      }
      setError(message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerateReport = async (approach: string) => {
    // Check if transcription is string or object and convert to string for the report prompt
    let textToAnalyze = "";
    if (typeof transcription === 'string') {
        textToAnalyze = transcription;
    } else if (Array.isArray(transcription)) {
        textToAnalyze = transcription.map(s => `${s.speaker}: ${s.text}`).join('\n');
    }

    if (!textToAnalyze) return;

    setIsGeneratingReport(true);
    try {
      const report = await generateSessionReport(textToAnalyze, approach);
      setCurrentReport(report);

      if (selectedSession) {
        const updatedSessions = sessions.map(s => 
          s.id === selectedSession.id ? { ...s, report } : s
        );
        saveSessions(updatedSessions);
        setSelectedSession({ ...selectedSession, report });
      }

    } catch (e) {
      setError("Rapor oluşturulurken bir hata oluştu.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleGenerateCritique = async (approach: string) => {
     let textToAnalyze = "";
     if (typeof transcription === 'string') {
         textToAnalyze = transcription;
     } else if (Array.isArray(transcription)) {
         textToAnalyze = transcription.map(s => `${s.speaker}: ${s.text}`).join('\n');
     }
     
     if (!textToAnalyze) return;

     setIsGeneratingCritique(true);
     try {
       const critique = await generateSupervisionCritique(textToAnalyze, approach);
       setCurrentCritique(critique);

       if (selectedSession) {
         const updatedSessions = sessions.map(s => 
           s.id === selectedSession.id ? { ...s, critique, critiqueApproach: approach } : s
         );
         saveSessions(updatedSessions);
         setSelectedSession({ ...selectedSession, critique, critiqueApproach: approach });
       }
     } catch (e) {
       setError("Eleştiri raporu oluşturulurken bir hata oluştu.");
     } finally {
       setIsGeneratingCritique(false);
     }
  };

  const handleUpdateTranscript = (newText: string | TranscriptSegment[]) => {
    setTranscription(newText);
    if (selectedSession) {
      const updatedSessions = sessions.map(s => 
        s.id === selectedSession.id ? { ...s, transcript: newText } : s
      );
      saveSessions(updatedSessions);
      setSelectedSession({ ...selectedSession, transcript: newText });
    }
  };

  const handleSessionSelect = (session: SessionRecord) => {
    setSelectedSession(session);
    setTranscription(session.transcript);
    setCurrentReport(session.report);
    setCurrentCritique(session.critique);
    setAudioData(null); // Clear audio upload state, but we don't have the audio blob for history
    setCurrentView('home'); 
  };

  const handleBulkSupervision = async (selectedSessions: SessionRecord[]) => {
      const approach = prompt("Toplu süpervizyon için ekol giriniz (Örn: BDT, Şema):");
      if (!approach) return;

      setIsBulkAnalyzing(true);
      setCurrentView('bulk_result');
      
      try {
          // Prepare data
          const sessionData = selectedSessions.map(s => ({
              date: s.date,
              transcript: typeof s.transcript === 'string' ? s.transcript : s.transcript.map(x => x.text).join('\n')
          }));

          const result = await generateBulkSupervision(sessionData, approach);
          setBulkAnalysisResult(result);

      } catch (error) {
          console.error(error);
          setBulkAnalysisResult("Toplu analiz başarısız oldu.");
      } finally {
          setIsBulkAnalyzing(false);
      }
  };

  // Scale Functions
  const handleAddScale = (newScale: ScaleRecord) => {
      saveScales([...scales, newScale]);
  };

  const handleAnalyzeScale = async (scaleId: string) => {
      const targetScale = scales.find(s => s.id === scaleId);
      if (!targetScale) return;

      setIsAnalyzingScale(true);
      try {
          // Find history for this client and this scale type
          const history = scales
            .filter(s => s.clientAlias === targetScale.clientAlias && s.name === targetScale.name && s.id !== scaleId)
            .map(s => ({ date: s.date, score: s.score }));

          const result = await interpretPsychometricScale(targetScale.name, targetScale.score, history);
          
          const updatedScales = scales.map(s => 
              s.id === scaleId ? { ...s, interpretation: result.interpretation, nextScheduledDate: result.nextDate } : s
          );
          saveScales(updatedScales);
      } catch (e) {
          console.error(e);
          setError("Ölçek yorumlanırken bir hata oluştu.");
      } finally {
          setIsAnalyzingScale(false);
      }
  };

  const renderContent = () => {
    if (currentView === 'pricing') {
      return <PricingPlans currentPlan={userCredits.plan} onSelectPlan={handlePlanSelect} plans={plans} />;
    }

    if (currentView === 'dashboard') {
      return <Dashboard 
        sessions={sessions} 
        onSelectSession={handleSessionSelect} 
        onBulkSupervision={handleBulkSupervision}
        scales={scales}
        onAddScale={handleAddScale}
        onAnalyzeScale={handleAnalyzeScale}
        isAnalyzingScale={isAnalyzingScale}
      />;
    }

    if (currentView === 'bulk_result') {
        return (
            <div className="max-w-4xl mx-auto w-full animate-in fade-in duration-500">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="mb-4 text-slate-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" /> Panele Dön
                </button>

                {isBulkAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-64">
                         <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                         <h3 className="text-xl font-bold text-slate-700">Toplu Süpervizyon Hazırlanıyor...</h3>
                         <p className="text-slate-500">Seçilen seanslar incelenip süreç analizi yapılıyor.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-xl border border-slate-100 rounded-xl overflow-hidden min-h-[600px]">
                        <div className="bg-amber-700 px-8 py-6 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <Layers className="w-6 h-6 opacity-80" />
                                <span className="text-sm font-medium opacity-80 uppercase tracking-widest">Çoklu Seans Analizi</span>
                            </div>
                            <h2 className="text-2xl font-bold">Bütüncül Süpervizyon Raporu</h2>
                        </div>
                        <div className="p-8 prose prose-slate max-w-none prose-headings:text-amber-800">
                            <div className="whitespace-pre-wrap text-slate-800 leading-loose">
                                {bulkAnalysisResult}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Home View
    return (
      <div className="flex flex-col items-center justify-start w-full max-w-7xl mx-auto">
         {/* Intro / Hero only if no active work */}
        {!transcription && !isTranscribing && !audioData && (
          <div className="w-full">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Hoş geldin, {user.name}
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Klinik seanslarını güvenle yükle ve yapay zeka destekli analize başla.
              </p>
            </div>

            {/* Upload Area */}
            <div className="mb-16">
               <AudioRecorder 
                 onAudioReady={handleAudioReady} 
                 onClear={handleClear} 
                 isTranscribing={isTranscribing}
               />
            </div>
          </div>
        )}

        {/* Processing View Logic */}
        {!selectedSession && !transcription && audioData && (
           <div className="w-full">
             <AudioRecorder 
               onAudioReady={handleAudioReady} 
               onClear={handleClear} 
               isTranscribing={isTranscribing}
             />
           </div>
        )}

        {/* If viewing history, show a back button to recorder */}
        {selectedSession && (
          <div className="w-full max-w-5xl mb-4 flex justify-between items-center px-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
             <div className="flex flex-col">
               <span className="text-xs text-slate-500 uppercase tracking-wide font-bold">Aktif Çalışma</span>
               <div className="flex items-center gap-2">
                 <span className="font-semibold text-slate-800 text-lg">{selectedSession.clientAlias}</span>
                 {selectedSession.sessionNumber && (
                    <span className="text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-600">#{selectedSession.sessionNumber}</span>
                 )}
               </div>
             </div>
             <button 
               onClick={() => {
                 setSelectedSession(null);
                 setTranscription(null);
                 setCurrentReport(undefined);
                 setCurrentCritique(undefined);
                 setAudioData(null);
               }}
               className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors"
             >
               + Yeni Kayıt
             </button>
          </div>
        )}

        {/* Action Button for New Audio */}
        {audioData && !transcription && !selectedSession && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-2xl">
            
            {/* Metadata Inputs */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-indigo-500" />
                    Danışan Bilgileri
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Danışan Rumuzu / Kod</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={clientAlias}
                                onChange={(e) => setClientAlias(e.target.value)}
                                placeholder="Örn: DN-2401"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                             <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kaçıncı Seans</label>
                         <div className="relative">
                            <input 
                                type="number" 
                                value={sessionNumber}
                                onChange={(e) => setSessionNumber(e.target.value)}
                                placeholder="Örn: 4"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                            <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                     <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Seans Tarihi</label>
                         <div className="relative">
                            <input 
                                type="date" 
                                value={sessionDate}
                                onChange={(e) => setSessionDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <button
                onClick={handleTranscribe}
                disabled={isTranscribing}
                className={`
                    group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold text-lg shadow-xl shadow-indigo-200 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 w-full justify-center sm:w-auto
                `}
                >
                {isTranscribing ? (
                    <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analiz Ediliyor...
                    </>
                ) : (
                    <>
                    <Sparkles className="w-5 h-5" />
                    Transkripsiyonu Başlat
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
                </button>
                <div className="mt-3 text-sm text-slate-500">
                Tahmini Süre: {audioData.duration ? formatTime(audioData.duration) : 'Hesaplanıyor...'} 
                <span className="mx-2">•</span>
                Bakiye: {formatTime(userCredits.remainingSeconds)}
                </div>
                {isTranscribing && (
                <p className="text-center text-slate-500 mt-4 text-sm animate-pulse max-w-md">
                    Ses işleniyor ve konuşmacılar ayrıştırılıyor... <br/>
                    Dosya boyutuna bağlı olarak bu işlem birkaç dakika sürebilir. Lütfen sayfayı kapatmayın.
                </p>
                )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md flex flex-col items-start gap-2 text-red-700 animate-in fade-in duration-300 mx-auto">
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">Hata</p>
            </div>
            <p className="text-sm">{error}</p>
            {error.includes("Yetersiz bakiye") && (
                <button 
                  onClick={() => setCurrentView('pricing')}
                  className="text-sm font-semibold underline hover:text-red-800 mt-1"
                >
                    Paket Yükselt
                </button>
            )}
          </div>
        )}

        {/* Results */}
        {transcription && (
          <TranscriptionView 
            transcriptData={transcription} 
            report={currentReport}
            critique={currentCritique}
            audioUrl={audioData?.url}
            onUpdateText={handleUpdateTranscript}
            onGenerateReport={handleGenerateReport}
            onGenerateCritique={handleGenerateCritique}
            isGeneratingReport={isGeneratingReport}
            isGeneratingCritique={isGeneratingCritique}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Payment Modal */}
      {showPaymentModal && pendingPlan && (
        <PaymentModal 
          plan={pendingPlan.plan} 
          price={pendingPlan.price}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => {
              setCurrentView('home');
              setSelectedSession(null);
              setTranscription(null);
              setAudioData(null);
            }}
          >
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent hidden sm:block">
              Psikoloji Ağı
            </h1>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4">
            <button 
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Anasayfa</span>
            </button>
            <button 
               onClick={() => setCurrentView('dashboard')}
               className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Panelim</span>
            </button>
             <button 
               onClick={() => setCurrentView('pricing')}
               className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'pricing' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Paketler</span>
            </button>
            
            <div className="ml-2 pl-4 border-l border-slate-200 flex items-center gap-4">
               <div className="flex flex-col items-end hidden sm:flex">
                 <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{userCredits.plan} Üyelik</span>
                 <span className="text-xs text-indigo-600 font-medium">{Math.floor(userCredits.remainingSeconds / 60)} dk krediniz var</span>
               </div>
               <button onClick={onLogout} title="Çıkış Yap" className="text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
               </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-2">© {new Date().getFullYear()} Psikoloji Ağı Transkript Uygulaması</p>
          <div className="flex justify-center gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-indigo-600">Kullanım Şartları</a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600">Gizlilik Politikası</a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600">İletişim</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserWorkspace;
