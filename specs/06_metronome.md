# CaT4G - メトロノーム機能

**状態: 実装必須**

演奏練習用のメトロノーム機能。

## 機能仕様

### 基本機能

- BPM に基づくクリック音再生
- 拍子対応（4/4, 3/4, 6/8, 2/4）
- 音量調整
- ビジュアルインジケーター（拍に合わせた視覚的フィードバック）

### UI 要素

| 要素 | 説明 |
|------|------|
| メトロノームトグル | ON/OFF 切り替え |
| BPM 表示/入力 | 現在の BPM（手動変更可能） |
| 拍子選択 | 4/4, 3/4, 6/8, 2/4 から選択 |
| 音量スライダー | 0% - 100% |
| ビート表示 | 現在の拍を視覚的に表示 |

### パラメータ

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| bpm | number | 120 | テンポ |
| timeSignature | string | '4/4' | 拍子 |
| volume | number | 0.7 | 音量 (0-1) |
| accentFirstBeat | boolean | true | 1拍目を強調 |

## 実装

### 状態管理

```typescript
interface MetronomeState {
  enabled: boolean;
  bpm: number;
  timeSignature: '4/4' | '3/4' | '6/8' | '2/4';
  volume: number;
  currentBeat: number;
}
```

### カスタムフック

```typescript
// src/hooks/useMetronome.ts

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseMetronomeOptions {
  bpm: number;
  timeSignature: '4/4' | '3/4' | '6/8' | '2/4';
  volume: number;
  accentFirstBeat?: boolean;
}

interface UseMetronomeReturn {
  isPlaying: boolean;
  currentBeat: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

export function useMetronome({
  bpm,
  timeSignature,
  volume,
  accentFirstBeat = true,
}: UseMetronomeOptions): UseMetronomeReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const schedulerIdRef = useRef<number | null>(null);
  const currentBeatRef = useRef(0);

  // 拍子から拍数を取得
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0]);

  // オシレーターでクリック音を生成
  const playClick = useCallback((isAccent: boolean) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // アクセント音は高い周波数
    osc.frequency.value = isAccent ? 1000 : 800;
    osc.type = 'sine';

    gain.gain.value = volume * (isAccent ? 1.0 : 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, [volume]);

  // スケジューラー
  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const secondsPerBeat = 60.0 / bpm;
    const scheduleAheadTime = 0.1; // 100ms 先まで予約

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const isAccent = accentFirstBeat && currentBeatRef.current === 0;
      playClick(isAccent);

      setCurrentBeat(currentBeatRef.current);

      // 次の拍へ
      currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
      nextNoteTimeRef.current += secondsPerBeat;
    }

    schedulerIdRef.current = requestAnimationFrame(scheduler);
  }, [bpm, beatsPerMeasure, accentFirstBeat, playClick]);

  const start = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    currentBeatRef.current = 0;
    nextNoteTimeRef.current = audioContextRef.current.currentTime;
    setIsPlaying(true);
    scheduler();
  }, [scheduler]);

  const stop = useCallback(() => {
    if (schedulerIdRef.current) {
      cancelAnimationFrame(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (schedulerIdRef.current) {
        cancelAnimationFrame(schedulerIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // BPM 変更時にタイミングを再計算
  useEffect(() => {
    if (isPlaying) {
      stop();
      start();
    }
  }, [bpm, timeSignature]);

  return {
    isPlaying,
    currentBeat,
    start,
    stop,
    toggle,
  };
}
```

### ビジュアルインジケーター

```typescript
// src/components/MetronomeBeatIndicator.tsx

interface MetronomeBeatIndicatorProps {
  beatsPerMeasure: number;
  currentBeat: number;
  isPlaying: boolean;
}

export function MetronomeBeatIndicator({
  beatsPerMeasure,
  currentBeat,
  isPlaying,
}: MetronomeBeatIndicatorProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: beatsPerMeasure }).map((_, index) => (
        <div
          key={index}
          className={`
            w-3 h-3 rounded-full transition-all duration-75
            ${index === currentBeat && isPlaying
              ? index === 0
                ? 'bg-amber-500 scale-125'  // アクセント
                : 'bg-purple-500 scale-110' // 通常拍
              : 'bg-gray-600'
            }
          `}
        />
      ))}
    </div>
  );
}
```

### ControlBar 統合

```typescript
// src/components/ControlBar.tsx (メトロノーム部分)

interface MetronomeControlsProps {
  enabled: boolean;
  bpm: number;
  timeSignature: '4/4' | '3/4' | '6/8' | '2/4';
  volume: number;
  currentBeat: number;
  onToggle: () => void;
  onBpmChange: (bpm: number) => void;
  onTimeSignatureChange: (ts: '4/4' | '3/4' | '6/8' | '2/4') => void;
  onVolumeChange: (volume: number) => void;
}

export function MetronomeControls({
  enabled,
  bpm,
  timeSignature,
  volume,
  currentBeat,
  onToggle,
  onBpmChange,
  onTimeSignatureChange,
  onVolumeChange,
}: MetronomeControlsProps) {
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0]);

  return (
    <div className="flex items-center gap-4 border-l border-gray-700 pl-4">
      {/* メトロノームトグル */}
      <button
        onClick={onToggle}
        className={`
          p-2 rounded
          ${enabled ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}
        `}
      >
        <MetronomeIcon />
      </button>

      {/* BPM 入力 */}
      <div className="flex items-center gap-1">
        <button onClick={() => onBpmChange(bpm - 1)} className="px-1">-</button>
        <input
          type="number"
          value={bpm}
          onChange={(e) => onBpmChange(parseInt(e.target.value) || 120)}
          className="w-14 text-center bg-gray-800 rounded"
          min="40"
          max="240"
        />
        <button onClick={() => onBpmChange(bpm + 1)} className="px-1">+</button>
        <span className="text-sm text-gray-400">BPM</span>
      </div>

      {/* 拍子選択 */}
      <select
        value={timeSignature}
        onChange={(e) => onTimeSignatureChange(e.target.value as any)}
        className="bg-gray-800 rounded px-2 py-1"
      >
        <option value="4/4">4/4</option>
        <option value="3/4">3/4</option>
        <option value="6/8">6/8</option>
        <option value="2/4">2/4</option>
      </select>

      {/* ビートインジケーター */}
      <MetronomeBeatIndicator
        beatsPerMeasure={beatsPerMeasure}
        currentBeat={currentBeat}
        isPlaying={enabled}
      />

      {/* 音量 */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-16"
      />
    </div>
  );
}
```

## 実装タスク

1. [ ] `src/hooks/useMetronome.ts` - メトロノームフック
2. [ ] `src/components/MetronomeBeatIndicator.tsx` - ビートインジケーター
3. [ ] ControlBar にメトロノーム UI 追加
4. [ ] キーボードショートカット（M キーでトグル）

## 次のステップ

メトロノーム完了後 → [07_transpose.md](./07_transpose.md) で転調機能を実装
