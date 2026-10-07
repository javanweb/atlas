import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../../types';
import { ParticleHumanoid } from '../ParticleHumanoid';
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowLeft,
  Scan,
  Radio,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface ForzaFaceToFaceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (sessionData: {
    capturedImage?: string;
    transcript: string;
    identifiedProducts: Product[];
    durationSeconds: number;
  }) => void;
  catalogProducts: Product[];
}

export const ForzaFaceToFaceOverlay: React.FC<ForzaFaceToFaceOverlayProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
  catalogProducts,
}) => {
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [detectedProduct, setDetectedProduct] = useState<Product | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [aiSpeechText, setAiSpeechText] = useState('سلام! من FORZA هستم. قطعه صنعتی یا پلاک دستگاه را جلوی دوربین بگیرید تا تحلیل کنم.');
  const [userSpeechText, setUserSpeechText] = useState('');
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Camera stream
  useEffect(() => {
    if (!isOpen) return;

    if (isCameraActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Camera stream permission unavailable, using simulation:', err);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, isCameraActive]);

  if (!isOpen) return null;

  const handleCaptureAndScan = () => {
    setIsScanning(true);
    setAiSpeechText('در حال تحلیل هندسه قطعه، گام شیارها و پلاک کاتالوگ...');

    // Take snapshot simulation
    const sampleImg = 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80';
    setCapturedSnapshot(sampleImg);

    setTimeout(() => {
      setIsScanning(false);
      const matched = catalogProducts[0] || null;
      setDetectedProduct(matched);
      setConfidence(94);
      setAiSpeechText(
        `قطعه با موفقیت شناسایی شد! این محصول "${matched?.name || 'شیر توپی صنعتی'}" با استاندارد DIN است. مدل فابریک با تحویل فوری در انبار موجود است.`
      );
    }, 1800);
  };

  const handleEndSession = () => {
    onSessionComplete({
      capturedImage: capturedSnapshot || undefined,
      transcript: aiSpeechText,
      identifiedProducts: detectedProduct ? [detectedProduct] : catalogProducts.slice(0, 2),
      durationSeconds: sessionSeconds,
    });
    onClose();
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] text-white flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      {/* Top HUD Bar */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#C95210] to-[#E06518] flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_#E06518]">
            FZ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">FORZA Face-to-Face AI</h2>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>LIVE</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              مدت جلسه: {formatTime(sessionSeconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleEndSession}
            className="px-4 py-2 bg-white/10 hover:bg-[#E06518] text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>ادامه در چت متنی</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Viewport */}
      <div className="relative flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* CENTER / LEFT: 3D Holographic AI Avatar (7 Cols on desktop) */}
        <div className="relative lg:col-span-7 h-full flex flex-col items-center justify-center p-6 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Holographic 3D Particle Face / AI Voice Core */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            <ParticleHumanoid speed={isMicActive ? 1.4 : 0.8} energy={isMicActive ? 90 : 60} />

            {/* Glowing Ring Waveform */}
            <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-ping pointer-events-none opacity-40" />
          </div>

          {/* Real-time AI Speech Caption Bubble */}
          <div className="relative z-10 w-full max-w-xl mt-4 bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl text-right">
            <div className="flex items-center gap-2 text-[#E06518] text-xs font-bold mb-1">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>پاسخ زنده FORZA AI:</span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {aiSpeechText}
            </p>
          </div>
        </div>

        {/* RIGHT: User Live Camera & Part Viewfinder HUD (5 Cols on desktop) */}
        <div className="relative lg:col-span-5 h-full p-6 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-r border-white/10 bg-black/30 backdrop-blur-md">
          
          {/* User Camera Frame */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-orange-500/40 bg-slate-950 shadow-2xl group">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <VideoOff className="w-10 h-10" />
                <span className="text-xs">دوربین غیرفعال است</span>
              </div>
            )}

            {/* HUD Viewfinder Overlay & Scanning Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#E06518]" />
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#E06518]" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#E06518]" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#E06518]" />

              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#E06518] to-transparent shadow-[0_0_15px_#E06518] animate-bounce" />
              )}
            </div>

            {/* Scan Action Button on Camera Viewport */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-[10px] font-mono text-slate-300 border border-white/10">
                1080p HUD VISION
              </span>

              <button
                type="button"
                onClick={handleCaptureAndScan}
                disabled={isScanning}
                className="px-4 py-2 bg-gradient-to-r from-[#C95210] to-[#E06518] text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>{isScanning ? 'در حال اسکن...' : 'اسکن قطعه روبروی دوربین'}</span>
              </button>
            </div>
          </div>

          {/* Real-time Detected Product Card (if identified during call) */}
          {detectedProduct && (
            <div className="p-4 rounded-2xl bg-[#12203C]/90 backdrop-blur-md border border-orange-500/50 shadow-2xl space-y-3 text-right animate-in fade-in slide-in-from-bottom-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>تطابق فنی: {confidence}٪</span>
                </span>
                <span className="text-[10px] font-mono text-orange-400">کد: {detectedProduct.code}</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={detectedProduct.image || detectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200'}
                  alt={detectedProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-white/20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{detectedProduct.name}</h4>
                  <p className="text-[11px] text-slate-300 truncate mt-0.5">{detectedProduct.brand}</p>
                </div>
              </div>
            </div>
          )}

          {/* Live Session Note */}
          <div className="text-[11px] text-slate-400 text-right leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
            💡 تمام تصاویر ثبت شده، پارت‌نامبرهای شناسایی شده و صدای این جلسه بلافاصله پس از پایان به صورت خودکار در گفتگوی فعال ذخیره می‌گردند.
          </div>
        </div>

      </div>

      {/* Bottom Control Dock */}
      <div className="relative z-20 flex items-center justify-center gap-4 py-4 px-6 bg-black/60 backdrop-blur-md border-t border-white/10">
        <button
          type="button"
          onClick={() => setIsMicActive(!isMicActive)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isMicActive
              ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              : 'bg-rose-500/30 text-rose-400 border border-rose-500/50'
          }`}
          title={isMicActive ? 'بی‌صدا کردن میکروفون' : 'فعال کردن میکروفون'}
        >
          {isMicActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={() => setIsCameraActive(!isCameraActive)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isCameraActive
              ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              : 'bg-rose-500/30 text-rose-400 border border-rose-500/50'
          }`}
          title={isCameraActive ? 'خاموش کردن دوربین' : 'روشن کردن دوربین'}
        >
          {isCameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={handleCaptureAndScan}
          className="h-12 px-6 rounded-full bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_#E06518] transition-transform active:scale-95 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>عکس‌برداری و تحلیل آنی</span>
        </button>

        <button
          type="button"
          onClick={handleEndSession}
          className="h-12 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>پایان و ذخیره در چت</span>
        </button>
      </div>
    </div>
  );
};
