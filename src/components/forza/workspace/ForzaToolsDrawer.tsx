import React, { useState } from 'react';
import {
  Wrench,
  Calculator,
  Compass,
  Layers,
  X,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface ForzaToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendCalcToChat: (prompt: string) => void;
}

export const ForzaToolsDrawer: React.FC<ForzaToolsDrawerProps> = ({
  isOpen,
  onClose,
  onSendCalcToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'belt' | 'torque' | 'bearing'>('belt');

  // Belt Calc
  const [calcC, setCalcC] = useState('500');
  const [calcD, setCalcD] = useState('315');
  const [calcd, setCalcd] = useState('160');
  const [beltResult, setBeltResult] = useState<number | null>(null);

  const calculateBelt = () => {
    const C = parseFloat(calcC) || 0;
    const D = parseFloat(calcD) || 0;
    const d = parseFloat(calcd) || 0;
    if (C <= 0 || D <= 0 || d <= 0) return;
    const L = 2 * C + 1.5708 * (D + d) + Math.pow(D - d, 2) / (4 * C);
    setBeltResult(Math.round(L));
  };

  // Torque Calc
  const [powerKw, setPowerKw] = useState('15');
  const [rpm, setRpm] = useState('1450');
  const [torqueResult, setTorqueResult] = useState<number | null>(null);

  const calculateTorque = () => {
    const P = parseFloat(powerKw) || 0;
    const n = parseFloat(rpm) || 0;
    if (P <= 0 || n <= 0) return;
    const T = (9550 * P) / n;
    setTorqueResult(Math.round(T * 10) / 10);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-slate-800 text-sm">ابزارها و محاسبات مهندسی</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="grid grid-cols-3 gap-1 p-2 border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => setActiveTab('belt')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'belt' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            طول تسمه
          </button>
          <button
            onClick={() => setActiveTab('torque')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'torque' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            توان و گشتاور
          </button>
          <button
            onClick={() => setActiveTab('bearing')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'bearing' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            لقی بلبرینگ
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'belt' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500 leading-relaxed">
                محاسبه طول تسمه V-Belt بر اساس فرمول استاندارد ISO 4184 و DIN 2215:
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">فاصله مرکز تا مرکز پولی‌ها (C به mm):</label>
                  <input
                    type="number"
                    value={calcC}
                    onChange={e => setCalcC(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">قطر پولی بزرگ (D):</label>
                    <input
                      type="number"
                      value={calcD}
                      onChange={e => setCalcD(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">قطر پولی کوچک (d):</label>
                    <input
                      type="number"
                      value={calcd}
                      onChange={e => setCalcd(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateBelt}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition active:scale-98"
                >
                  محاسبه طول تسمه
                </button>

                {beltResult !== null && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl text-center space-y-1">
                    <div className="text-[11px] text-slate-600">طول استاندارد محاسبه‌شده:</div>
                    <div className="text-xl font-black text-orange-600">{beltResult} میلی‌متر</div>
                    <button
                      onClick={() => {
                        onSendCalcToChat(
                          `با فاصله محوری C=${calcC}mm و قطرهای D=${calcD}mm و d=${calcd}mm، طول تسمه محاسبه‌شده ${beltResult}mm شد. لطفاً پارت نامبر و پروفیل استاندارد FORZA موجود در انبار را معرفی کن.`
                        );
                        onClose();
                      }}
                      className="text-xs text-orange-700 font-bold hover:underline block w-full mt-2"
                    >
                      ارسال به چت برای استعلام موجودی ↲
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'torque' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500">
                فرمول استاندارد گشتاور: <code>T = (9550 × P) / n</code>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">توان الکتروموتور (kW):</label>
                  <input
                    type="number"
                    value={powerKw}
                    onChange={e => setPowerKw(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">دور بر دقیقه (RPM):</label>
                  <input
                    type="number"
                    value={rpm}
                    onChange={e => setRpm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <button
                  onClick={calculateTorque}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition active:scale-98"
                >
                  محاسبه گشتاور
                </button>

                {torqueResult !== null && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl text-center space-y-1">
                    <div className="text-[11px] text-slate-600">گشتاور نامی شفت:</div>
                    <div className="text-xl font-black text-orange-600">{torqueResult} Nm (نیوتن‌متر)</div>
                    <button
                      onClick={() => {
                        onSendCalcToChat(
                          `برای موتور با توان ${powerKw}kW و دور ${rpm}RPM، گشتاور ${torqueResult}Nm به دست آمد. کوپلینگ و پولی مناسب با ضریب ایمنی ۱.۵ پیشنهاد بده.`
                        );
                        onClose();
                      }}
                      className="text-xs text-orange-700 font-bold hover:underline block w-full mt-2"
                    >
                      ارسال به چت برای استعلام کوپلینگ ↲
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bearing' && (
            <div className="space-y-3 text-slate-700">
              <div className="font-bold text-slate-900">راهنمای کلاس‌های لقی بلبرینگ:</div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div><strong>C2 (لقی کم):</strong> خطوط دقیق، اسپیندل بدون لقی محوری</div>
                <div><strong>Normal (عادی):</strong> کاربردهای عمومی زیر ۱۰۰۰ دور</div>
                <div><strong>C3 (دور بالا):</strong> کوره‌ها، فن‌ها و دورهای بالای ۱۴۰۰ RPM</div>
                <div><strong>C4 (بسیار زیاد):</strong> آسیاب‌ها، کوره‌های ارتعاشی و سیمان</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
