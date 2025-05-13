
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlayIcon, PauseIcon } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  text: string;
  phonemes: string[];
}

const AudioPlayer = ({ audioUrl, text, phonemes }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);
      
      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioUrl]);

  useEffect(() => {
    // Simulate drawing a waveform
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#9b87f5";
        
        // Generate a fake waveform
        const bars = 50;
        const barWidth = canvas.width / bars - 2;
        
        for (let i = 0; i < bars; i++) {
          const height = Math.sin(i * 0.2) * 30 + Math.random() * 20 + 10;
          ctx.fillRect(i * (barWidth + 2), canvas.height / 2 - height / 2, barWidth, height);
        }
      }
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex items-center space-x-3">
        <Button
          type="button"
          onClick={togglePlayPause}
          className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
        >
          {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
        </Button>
        
        <div className="flex-1">
          <div 
            className="h-2 bg-gray-200 rounded-full cursor-pointer" 
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-purple-600 rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Waveform Visualization</h3>
        <canvas 
          ref={canvasRef}
          className="w-full h-20 bg-gray-50 rounded"
          width={600}
          height={80}
        ></canvas>
      </div>
      
      {phonemes.length > 0 && (
        <Card className="p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Phoneme Breakdown</h3>
          <div className="flex flex-wrap gap-1">
            {phonemes.map((phoneme, index) => (
              <span 
                key={index}
                className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
              >
                {phoneme}
              </span>
            ))}
          </div>
        </Card>
      )}
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Text</h3>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default AudioPlayer;
