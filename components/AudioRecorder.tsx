import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, Trash2, FileAudio, AlertCircle, Clock } from 'lucide-react';
import { AudioData, AudioSourceType } from '../types';
import { formatTime } from '../utils/audioUtils';

interface AudioRecorderProps {
  onAudioReady: (data: AudioData) => void;
  onClear: () => void;
  isTranscribing: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, onClear, isTranscribing }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up URL object on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError("Lütfen geçerli bir ses dosyası seçin (MP3, WAV, M4A vb.).");
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
         setError("Dosya çok büyük. Lütfen 50MB'dan küçük bir dosya seçin.");
         return;
      }

      const url = URL.createObjectURL(file);
      setFileName(file.name);
      
      const audio = document.createElement('audio');
      audio.src = url;
      
      audio.onloadedmetadata = () => {
        setAudioUrl(url);
        setDuration(audio.duration);
        
        onAudioReady({
          blob: file,
          url: url,
          type: AudioSourceType.FILE_UPLOAD,
          fileName: file.name,
          duration: audio.duration
        });
      };

      audio.onerror = () => {
        // Fallback
        setAudioUrl(url);
        setDuration(0);
        onAudioReady({
            blob: file,
            url: url,
            type: AudioSourceType.FILE_UPLOAD,
            fileName: file.name
        });
      };
    }
  };

  const togglePlayback = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleClear = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setDuration(0);
    setFileName("");
    setIsPlaying(false);
    setError(null);
    onClear();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto transition-all">
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3 text-sm shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {!audioUrl ? (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
           <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">Ses Dosyası Yükle</h2>
          
           <div className="relative group cursor-pointer flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-300">
             <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isTranscribing}
            />
            <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-10 h-10" />
            </div>
            <p className="text-lg text-slate-700 font-medium mb-2">Dosyayı buraya sürükleyin veya seçin</p>
            <p className="text-sm text-slate-500">MP3, WAV, M4A, OGG (Max 50MB)</p>
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Gizlilik Uyarısı</p>
              <p className="opacity-90">Yüklediğiniz ses dosyaları sadece tarayıcınızda işlenir ve güvenli API üzerinden transkript edilir. Kayıtlar sunucularımızda saklanmaz.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Audio Review Area */
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FileAudio className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg truncate max-w-[200px] sm:max-w-xs" title={fileName}>
                  {fileName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                   <Clock className="w-3 h-3" />
                   {duration > 0 ? formatTime(duration) : 'Süre hesaplanıyor...'}
                </div>
              </div>
            </div>
            {!isTranscribing && (
              <button 
                onClick={handleClear}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                title="Dosyayı Kaldır"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
            
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-4">
            <button
              onClick={togglePlayback}
              className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors flex-shrink-0 shadow-md"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <audio 
              ref={audioPlayerRef} 
              src={audioUrl} 
              onEnded={() => setIsPlaying(false)}
              className="w-full hidden"
            />
            <div className="flex-grow flex flex-col justify-center h-10">
               <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden relative">
                 <div className={`h-full bg-indigo-500 ${isPlaying ? 'animate-[pulse_2s_infinite]' : ''} w-full opacity-60`}></div>
               </div>
               <p className="text-xs text-center text-slate-400 mt-1">Ses önizlemesi</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;