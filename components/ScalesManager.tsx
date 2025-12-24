
import React, { useState } from 'react';
import { ClipboardList, Plus, Sparkles, TrendingUp, Calendar, AlertCircle, Loader2, Check } from 'lucide-react';
import { ScaleRecord } from '../types';

interface ScalesManagerProps {
  clientAlias: string;
  scales: ScaleRecord[];
  onAddScale: (scale: ScaleRecord) => void;
  onAnalyzeScale: (scaleId: string) => void;
  isAnalyzing: boolean;
}

const ScalesManager: React.FC<ScalesManagerProps> = ({ clientAlias, scales, onAddScale, onAnalyzeScale, isAnalyzing }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScale, setNewScale] = useState<{name: string, score: string, date: string}>({
      name: 'Beck Depresyon Envanteri',
      score: '',
      date: new Date().toISOString().slice(0, 10)
  });

  const handleAddSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newScale.name || !newScale.score) return;

      const record: ScaleRecord = {
          id: Date.now().toString(),
          clientAlias,
          name: newScale.name,
          score: Number(newScale.score),
          date: newScale.date,
          interpretation: ''
      };

      onAddScale(record);
      setShowAddForm(false);
      setNewScale({ ...newScale, score: '' });
  };

  // Group by scale name to show history properly if needed, but for now simple list
  const sortedScales = [...scales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            Psikometrik Ölçümler
         </h4>
         <button 
           onClick={() => setShowAddForm(!showAddForm)}
           className="text-sm flex items-center gap-1 text-indigo-600 font-medium hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
         >
            <Plus className="w-4 h-4" /> Yeni Ölçüm Ekle
         </button>
      </div>

      {showAddForm && (
          <form onSubmit={handleAddSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid gap-4 animate-in slide-in-from-top-2">
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Ölçek Adı</label>
                  <input 
                    type="text" 
                    list="scaleNames"
                    value={newScale.name}
                    onChange={e => setNewScale({...newScale, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Örn: Beck Anksiyete..."
                    required
                  />
                  <datalist id="scaleNames">
                      <option value="Beck Depresyon Envanteri" />
                      <option value="Beck Anksiyete Envanteri" />
                      <option value="SCL-90-R" />
                      <option value="Hamilton Depresyon Ölçeği" />
                      <option value="Yale-Brown OKB Ölçeği" />
                      <option value="MMPI" />
                  </datalist>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Puan</label>
                    <input 
                        type="number" 
                        value={newScale.score}
                        onChange={e => setNewScale({...newScale, score: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        placeholder="0-63"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Tarih</label>
                    <input 
                        type="date" 
                        value={newScale.date}
                        onChange={e => setNewScale({...newScale, date: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        required
                    />
                  </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-500 text-sm hover:text-slate-700 px-3">İptal</button>
                  <button type="submit" className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700">Kaydet</button>
              </div>
          </form>
      )}

      {sortedScales.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
              Henüz kayıtlı ölçüm yok.
          </div>
      ) : (
          <div className="space-y-4">
              {sortedScales.map(scale => (
                  <div key={scale.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                          <div>
                              <h5 className="font-bold text-slate-800">{scale.name}</h5>
                              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {scale.date}</span>
                                  <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Puan: {scale.score}</span>
                              </div>
                          </div>
                          {!scale.interpretation && (
                              <button 
                                onClick={() => onAnalyzeScale(scale.id)}
                                disabled={isAnalyzing}
                                className="flex items-center gap-1 text-xs font-bold text-amber-600 border border-amber-200 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                              >
                                  {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                  Yorumla
                              </button>
                          )}
                      </div>

                      {scale.interpretation && (
                          <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 border border-slate-100 relative group">
                              <div className="flex items-start gap-2">
                                  <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                  <div className="space-y-2">
                                      <p>{scale.interpretation}</p>
                                      {scale.nextScheduledDate && (
                                          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mt-2 bg-indigo-50 inline-flex px-2 py-1 rounded">
                                              <TrendingUp className="w-3 h-3" />
                                              Öneri: Bir sonraki uygulama {scale.nextScheduledDate} tarihinde.
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default ScalesManager;
