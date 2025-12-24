import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Rewind, FastForward, Volume2, Gauge } from 'lucide-react';
import { formatTime } from '../utils/audioUtils';

interface AudioPlayerProps {
  audioUrl: string | null;
  onTimeUpdate?: (currentTime: number) => void;
  refProp?: React.RefObject<HTMLAudioElement | null>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onTimeUpdate, refProp }) => {
  const internalRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = refProp || internalRef; // Use passed ref or internal ref

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (onTimeUpdate) onTimeUpdate(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, onTimeUpdate]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeSpeed = () => {
    const speeds = [0.5, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  if (!audioUrl) return null;

  return (
    <div className="w-full bg-white border-b border-slate-200 p-3 flex items-center gap-4 shadow-sm sticky top-0 z-30">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center flex-shrink-0 transition-colors"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
      </button>

      <div className="flex-grow flex flex-col justify-center">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
        <button 
          onClick={changeSpeed}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 px-2 py-1.5 rounded transition-colors w-16 justify-center"
          title="Oynatma Hızı"
        >
          <Gauge className="w-3 h-3" />
          {playbackRate}x
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;