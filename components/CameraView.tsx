import React, { useRef, useEffect, useCallback } from 'react';
import { CameraIcon, XIcon } from './Icon';

interface CameraViewProps {
  onClose: () => void;
  onCapture: (imageBase64: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480 } });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access the camera. Please ensure you have given permission.");
        onClose();
      }
    }
  }, [onClose]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <XIcon className="w-6 h-6" />
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">Capture Your Expression</h3>
        <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover"></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <button
          onClick={handleCapture}
          className="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <CameraIcon className="w-5 h-5" />
          Capture & Use Image
        </button>
      </div>
    </div>
  );
};

export default CameraView;
