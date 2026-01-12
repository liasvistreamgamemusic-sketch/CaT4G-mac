/**
 * CountInOverlay - カウントイン表示オーバーレイ
 *
 * 再生開始前に1小節分のカウントを表示
 * BPMと拍子に合わせてビートを表示
 */

import { useEffect, useState, useRef } from 'react';

export interface CountInOverlayProps {
  /** 表示するかどうか */
  isActive: boolean;
  /** BPM */
  bpm: number;
  /** 拍子（例: '4/4', '3/4'） */
  timeSignature: string;
  /** 音声を再生するかどうか（メトロノームがオンの場合のみtrue） */
  playAudio: boolean;
  /** 音量（0.0〜1.0）メトロノームの音量と同期 */
  volume: number;
  /** カウントイン完了時のコールバック */
  onComplete: () => void;
  /** キャンセル時のコールバック */
  onCancel: () => void;
}

/**
 * 拍子から1小節あたりの拍数を取得
 */
function getBeatsPerMeasure(timeSignature: string): number {
  const parts = timeSignature.split('/');
  const numerator = parseInt(parts[0], 10);
  return isNaN(numerator) || numerator <= 0 ? 4 : numerator;
}

export function CountInOverlay({
  isActive,
  bpm,
  timeSignature,
  playAudio,
  volume,
  onComplete,
  onCancel,
}: CountInOverlayProps) {
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  // playAudioの最新値をrefで追跡（途中でオン/オフ切り替えに対応）
  const playAudioRef = useRef(playAudio);
  // volumeの最新値をrefで追跡
  const volumeRef = useRef(volume);

  const beatsPerMeasure = getBeatsPerMeasure(timeSignature);
  const msPerBeat = bpm > 0 ? 60000 / bpm : 500;

  // playAudioの変更をrefに同期
  useEffect(() => {
    playAudioRef.current = playAudio;
  }, [playAudio]);

  // volumeの変更をrefに同期
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // クリック音を再生（refを使用して最新のplayAudio状態をチェック）
  const playClickSound = (isAccent: boolean) => {
    // playAudioがオフなら音を鳴らさない
    if (!playAudioRef.current) return;

    // AudioContextがなければ作成
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // アクセントは高い音、通常は低い音
    oscillator.frequency.value = isAccent ? 1000 : 800;
    oscillator.type = 'sine';

    // 音量はメトロノームの音量と同期（アクセントは通常より大きく）
    const vol = volumeRef.current;
    const initialGain = vol * (isAccent ? 1.0 : 0.7);
    gainNode.gain.setValueAtTime(initialGain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  };

  // カウントイン開始
  useEffect(() => {
    if (!isActive) {
      setCurrentBeat(0);
      setIsAnimating(false);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    let beat = 1;
    setCurrentBeat(1);
    setIsAnimating(true);
    playClickSound(true); // First beat is accented (playClickSound内でplayAudioをチェック)

    timerRef.current = window.setInterval(() => {
      beat++;
      if (beat > beatsPerMeasure) {
        // カウントイン完了
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsAnimating(false);
        onComplete();
      } else {
        setCurrentBeat(beat);
        setIsAnimating(true);
        playClickSound(false); // playClickSound内でplayAudioをチェック
      }
    }, msPerBeat);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, bpm, beatsPerMeasure, msPerBeat, onComplete]); // playAudioは依存配列から除外（refで管理）

  // ESCキーでキャンセル
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onCancel]);

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div className="text-center" onClick={(e) => e.stopPropagation()}>
        {/* カウント数字 */}
        <div
          className={`text-[12rem] font-bold text-accent-primary transition-transform duration-100
            ${isAnimating ? 'scale-110' : 'scale-100'}`}
          style={{
            textShadow: '0 0 40px rgba(168, 85, 247, 0.6)',
          }}
        >
          {currentBeat}
        </div>

        {/* 拍子とBPM表示 */}
        <div className="mt-4 text-text-secondary">
          <span className="text-2xl font-medium">{timeSignature}</span>
          <span className="mx-4 text-text-muted">|</span>
          <span className="text-2xl font-medium">{bpm} BPM</span>
        </div>

        {/* ビートインジケーター */}
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: beatsPerMeasure }, (_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-100
                ${
                  i + 1 === currentBeat
                    ? 'bg-accent-primary scale-125 shadow-lg shadow-accent-primary/50'
                    : i + 1 < currentBeat
                      ? 'bg-accent-primary/50'
                      : 'bg-white/20'
                }`}
            />
          ))}
        </div>

        {/* キャンセル案内 */}
        <p className="mt-8 text-sm text-text-muted">
          ESC または画面クリックでキャンセル
        </p>
      </div>
    </div>
  );
}

export default CountInOverlay;
