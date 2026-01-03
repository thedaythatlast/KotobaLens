
import React, { useRef, useState, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            setIsReady(true);
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please ensure permissions are granted.");
        onCancel();
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    const video = videoRef.current;
    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // Convert to base64
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
    const base64 = dataUrl.split(',')[1];
    onCapture(base64);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-4">
      <div className="w-full flex justify-end">
        <button 
          onClick={onCancel}
          className="text-white bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      <div className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border-2 border-white/20">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 border-2 border-indigo-500/50 pointer-events-none rounded-2xl flex items-center justify-center">
          <div className="w-64 h-32 border-2 border-dashed border-indigo-400 opacity-50"></div>
        </div>
      </div>

      <div className="w-full flex justify-center pb-8">
        <button
          disabled={!isReady}
          onClick={capturePhoto}
          className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95 ${!isReady ? 'opacity-50' : 'bg-white/10'}`}
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-lg"></div>
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
