
import React, { useState } from 'react';
import { Calendar, Clock, FileText, ChevronRight, Search, User, Hash, ChevronDown, ChevronUp, Layers, CheckSquare, MessageSquare } from 'lucide-react';
import { SessionRecord, ScaleRecord } from '../types';
import { formatTime } from '../utils/audioUtils';
import ScalesManager from './ScalesManager';

interface DashboardProps {
  sessions: SessionRecord[];
  onSelectSession: (session: SessionRecord) => void;
  onBulkSupervision?: (sessions: SessionRecord[]) => void;
  
  // Scale props
  scales: ScaleRecord[];
  onAddScale: (scale: ScaleRecord) => void;
  onAnalyzeScale: (scaleId: string) => void;
  isAnalyzingScale: boolean;
}

interface ClientGroup {
    alias: string;
    sessions: SessionRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
    sessions, 
    onSelectSession, 
    onBulkSupervision,
    scales,
    onAddScale,
    onAnalyzeScale,
    isAnalyzingScale
}) => {
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Tab state within expanded client: 'sessions' | 'scales'
  const [activeClientTab, setActiveClientTab] = useState<'sessions' | 'scales'>('sessions');

  // Group sessions by client alias
  const groupedSessions: ClientGroup[] = (Object.values(sessions.reduce((acc, session) => {
    const alias = session.clientAlias || 'İsimsiz Danışanlar';
    if (!acc[alias]) {
        acc[alias] = { alias, sessions: [] };
    }
    acc[alias].sessions.push(session);
    return acc;
  }, {} as Record<string, ClientGroup>)) as ClientGroup[]).sort((a, b) => a.alias.localeCompare(b.alias));

  // Filter based on search
  const filteredGroups = groupedSessions.map(group => ({
      ...group,
      sessions: group.sessions.filter(s => 
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.date.includes(searchTerm)
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Newest first
  })).filter(g => g.sessions.length > 0);

  const toggleClient = (alias: string) => {
    if (expandedClient === alias) {
        setExpandedClient(null);
    } else {
        setExpandedClient(alias);
        setActiveClientTab('sessions'); // Reset tab to default
        setSelectedForBulk([]); // Reset bulk selection
    }
  };

  const toggleBulkSelect = (e: React.MouseEvent, sessionId: string) => {
      e.stopPropagation();
      if (selectedForBulk.includes(sessionId)) {
          setSelectedForBulk(prev => prev.filter(id => id !== sessionId));
      } else {
          setSelectedForBulk(prev => [...prev, sessionId]);
      }
  };

  const handleBulkAction = (e: React.MouseEvent) => {
      e.stopPropagation();
      const sessionsToAnalyze = sessions.filter(s => selectedForBulk.includes(s.id));
      if (onBulkSupervision && sessionsToAnalyze.length > 0) {
          onBulkSupervision(sessionsToAnalyze);
      }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Danışan Paneli</h2>
          <p className="text-slate-500 mt-1">Seans arşivleri ve psikometrik takipler.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Danışan ara..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
          />
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Henüz kayıt bulunamadı</h3>
          <p className="text-slate-500 mt-2">İlk seansınızı kaydetmek için ana sayfaya gidin.</p>
        </div>
      ) : (
        <div className="space-y-4">
            {filteredGroups.map((group) => (
                <div key={group.alias} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Group Header */}
                    <div 
                        className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-colors ${expandedClient === group.alias ? 'bg-indigo-50 border-b border-indigo-100' : 'hover:bg-slate-50'}`}
                        onClick={() => toggleClient(group.alias)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">{group.alias}</h3>
                                <p className="text-sm text-slate-500">{group.sessions.length} Seans Kaydı</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {expandedClient === group.alias ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedClient === group.alias && (
                         <div className="bg-white animate-in slide-in-from-top-2 duration-200">
                             {/* Tabs */}
                             <div className="flex border-b border-slate-100 px-6">
                                 <button 
                                   onClick={() => setActiveClientTab('sessions')}
                                   className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeClientTab === 'sessions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                 >
                                     <div className="flex items-center gap-2"><FileText className="w-4 h-4"/> Seans Geçmişi</div>
                                 </button>
                                 <button 
                                   onClick={() => setActiveClientTab('scales')}
                                   className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeClientTab === 'scales' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                 >
                                     <div className="flex items-center gap-2"><CheckSquare className="w-4 h-4"/> Ölçek Takibi</div>
                                 </button>
                             </div>

                             {/* Tab Content: Sessions */}
                             {activeClientTab === 'sessions' && (
                                <div className="divide-y divide-slate-100">
                                    {/* Bulk Actions Bar */}
                                    <div className="p-3 bg-slate-50 flex justify-end">
                                        {selectedForBulk.length > 1 && (
                                            <button 
                                                onClick={handleBulkAction}
                                                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                            >
                                                <Layers className="w-3 h-3" />
                                                Seçilenleri Analiz Et ({selectedForBulk.length})
                                            </button>
                                        )}
                                        {selectedForBulk.length <= 1 && (
                                            <span className="text-xs text-slate-400 py-2">Toplu süpervizyon için birden fazla seans seçin.</span>
                                        )}
                                    </div>

                                    {group.sessions.map((session) => (
                                        <div 
                                            key={session.id} 
                                            className={`flex items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer ${selectedForBulk.includes(session.id) ? 'bg-indigo-50/50' : ''}`}
                                            onClick={() => onSelectSession(session)}
                                        >
                                            <div 
                                                className="pr-4" 
                                                onClick={(e) => toggleBulkSelect(e, session.id)}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedForBulk.includes(session.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white hover:border-indigo-400'}`}>
                                                    {selectedForBulk.includes(session.id) && <CheckSquare className="w-3 h-3" />}
                                                </div>
                                            </div>

                                            <div className="flex-grow grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="w-4 h-4 text-slate-400" />
                                                    <span className="font-medium text-slate-700">
                                                        {session.sessionNumber ? `${session.sessionNumber}. Seans` : 'Seans No Yok'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    {new Date(session.date).toLocaleDateString('tr-TR')}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    {formatTime(session.duration)}
                                                </div>
                                                <div>
                                                    {session.report ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                            Raporlu
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                            Ham
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <ChevronRight className="w-5 h-5 text-slate-300 ml-2" />
                                        </div>
                                    ))}
                                </div>
                             )}

                             {/* Tab Content: Scales */}
                             {activeClientTab === 'scales' && (
                                 <div className="p-6">
                                     <ScalesManager 
                                        clientAlias={group.alias} 
                                        scales={scales.filter(s => s.clientAlias === group.alias)}
                                        onAddScale={onAddScale}
                                        onAnalyzeScale={onAnalyzeScale}
                                        isAnalyzing={isAnalyzingScale}
                                     />
                                 </div>
                             )}
                         </div>
                    )}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
