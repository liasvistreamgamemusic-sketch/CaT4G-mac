# CaT4G - オートスクロール機能

**状態: 実装必須**

演奏中にコード譜を自動でスクロールする機能。

## 機能仕様

### 基本機能

- 再生/一時停止ボタンで制御
- 速度: 0.5x 〜 2.0x（デフォルト: 1.0x）
- BPM 連動オプション（曲の BPM に合わせて速度を自動調整）

### UI 要素

| 要素 | 説明 |
|------|------|
| Play/Pause ボタン | スクロール開始/停止 |
| 速度スライダー | 0.5x - 2.0x の範囲で調整 |
| 速度表示 | 現在の速度を数値で表示 |
| BPM 連動トグル | ON: BPM に基づく速度調整 |

### パラメータ

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| BASE_SCROLL_AMOUNT | number | 1 | 基本スクロール量 (px) |
| SCROLL_INTERVAL | number | 50 | スクロール間隔 (ms) |
| MIN_SPEED | number | 0.5 | 最小速度倍率 |
| MAX_SPEED | number | 2.0 | 最大速度倍率 |

## 実装

### 状態管理

```typescript
// Layout.tsx または useAutoScroll.ts

interface AutoScrollState {
  isPlaying: boolean;
  scrollSpeed: number;
  bpmSync: boolean;
}

const [isPlaying, setIsPlaying] = useState(false);
const [scrollSpeed, setScrollSpeed] = useState(1.0);
const [bpmSync, setBpmSync] = useState(false);
```

### カスタムフック

```typescript
// src/hooks/useAutoScroll.ts

import { useEffect, useRef, useCallback } from 'react';

const BASE_SCROLL_AMOUNT = 1;
const SCROLL_INTERVAL = 50;

interface UseAutoScrollOptions {
  isPlaying: boolean;
  scrollSpeed: number;
  bpm?: number;
  bpmSync: boolean;
  containerRef: React.RefObject<HTMLElement>;
}

export function useAutoScroll({
  isPlaying,
  scrollSpeed,
  bpm,
  bpmSync,
  containerRef,
}: UseAutoScrollOptions) {
  const intervalRef = useRef<number | null>(null);

  // BPM に基づく速度計算
  const calculateSpeed = useCallback(() => {
    if (bpmSync && bpm) {
      // BPM 120 を基準とした相対速度
      return (bpm / 120) * scrollSpeed;
    }
    return scrollSpeed;
  }, [bpm, bpmSync, scrollSpeed]);

  useEffect(() => {
    if (isPlaying && containerRef.current) {
      const speed = calculateSpeed();

      intervalRef.current = window.setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollBy({
            top: BASE_SCROLL_AMOUNT * speed,
            behavior: 'auto',
          });

          // 最下部に到達したら停止
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            // 停止コールバック（親に通知）
          }
        }
      }, SCROLL_INTERVAL);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, scrollSpeed, bpm, bpmSync, containerRef, calculateSpeed]);

  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [containerRef]);

  const scrollToSection = useCallback((sectionIndex: number) => {
    if (containerRef.current) {
      const sections = containerRef.current.querySelectorAll('[data-section]');
      if (sections[sectionIndex]) {
        sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [containerRef]);

  return {
    scrollToTop,
    scrollToSection,
  };
}
```

### ControlBar コンポーネント

```typescript
// src/components/ControlBar.tsx (オートスクロール部分)

interface ControlBarProps {
  isPlaying: boolean;
  scrollSpeed: number;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  bpmSync: boolean;
  onBpmSyncChange: (sync: boolean) => void;
}

export function ControlBar({
  isPlaying,
  scrollSpeed,
  onPlayPause,
  onSpeedChange,
  bpmSync,
  onBpmSyncChange,
}: ControlBarProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Play/Pause ボタン */}
      <button
        onClick={onPlayPause}
        className="p-2 rounded-full bg-purple-600 hover:bg-purple-700"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      {/* 速度スライダー */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">速度</span>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={scrollSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-24"
        />
        <span className="text-sm w-12">{scrollSpeed.toFixed(1)}x</span>
      </div>

      {/* BPM 連動トグル */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={bpmSync}
          onChange={(e) => onBpmSyncChange(e.target.checked)}
          className="form-checkbox"
        />
        <span className="text-sm text-gray-400">BPM 連動</span>
      </label>
    </div>
  );
}
```

### キーボードショートカット

| キー | アクション |
|------|-----------|
| Space | 再生/一時停止 |
| ↑ | 速度 +0.1 |
| ↓ | 速度 -0.1 |
| Home | 先頭に戻る |
| End | 最後に移動 |

```typescript
// src/hooks/useKeyboardShortcuts.ts

import { useEffect } from 'react';

interface ShortcutHandlers {
  onPlayPause: () => void;
  onSpeedUp: () => void;
  onSpeedDown: () => void;
  onScrollToTop: () => void;
}

export function useKeyboardShortcuts({
  onPlayPause,
  onSpeedUp,
  onSpeedDown,
  onScrollToTop,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 入力フィールドにフォーカスがある場合はスキップ
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onPlayPause();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onSpeedUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onSpeedDown();
          break;
        case 'Home':
          e.preventDefault();
          onScrollToTop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause, onSpeedUp, onSpeedDown, onScrollToTop]);
}
```

## 実装タスク

1. [ ] `src/hooks/useAutoScroll.ts` - オートスクロールフック
2. [ ] `src/hooks/useKeyboardShortcuts.ts` - キーボードショートカット
3. [ ] ControlBar にオートスクロール UI 追加
4. [ ] MainArea でスクロールコンテナ設定

## 次のステップ

オートスクロール完了後 → [06_metronome.md](./06_metronome.md) でメトロノーム機能を実装
