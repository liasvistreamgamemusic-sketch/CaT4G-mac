/**
 * ChordDetailSettings - TAB譜用詳細設定コンポーネント
 * コード編集モーダルの「詳細設定タブ」で使用
 * Based on specs/10_song_editor_redesign.md Section 7.4
 */

import { useCallback } from 'react';
import type { PlayingTechnique, Dynamics, TimeSignature } from '@/types/database';
import {
  Timer,
  Hash,
  Hammer,
  ArrowUp,
  ArrowDown,
  Music,
  Volume1,
  Link,
  Waves,
  Hand,
  Sparkles,
  Zap,
  CircleDot,
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface ChordDetailSettingsProps {
  /** 拍数（1=1拍, 0.5=半拍, 2=2拍など） */
  duration: number | undefined;
  /** 適用する演奏テクニック */
  techniques: PlayingTechnique[] | undefined;
  /** 音の強さ（ダイナミクス） */
  dynamics: Dynamics | undefined;
  /** 次のコードとタイで繋ぐ */
  tieToNext: boolean | undefined;
  /** 現在の拍子（拍数入力のバリデーションに影響） */
  timeSignature: TimeSignature;
  /** 変更時のコールバック */
  onChange: (updates: Partial<{
    duration: number;
    techniques: PlayingTechnique[];
    dynamics: Dynamics;
    tieToNext: boolean;
  }>) => void;
}

// ============================================
// Constants
// ============================================

/** 拍数プリセット */
const DURATION_PRESETS = [
  { value: 0.5, label: '0.5' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 4, label: '4' },
];

/** テクニック一覧（アイコン付き） */
const TECHNIQUE_OPTIONS: {
  value: PlayingTechnique;
  label: string;
  shortLabel: string;
  icon: typeof Hammer;
}[] = [
  { value: 'hammer-on', label: 'ハンマリング', shortLabel: 'H', icon: Hammer },
  { value: 'pull-off', label: 'プリングオフ', shortLabel: 'P', icon: Hand },
  { value: 'slide-up', label: 'スライドアップ', shortLabel: '/', icon: ArrowUp },
  { value: 'slide-down', label: 'スライドダウン', shortLabel: '\\', icon: ArrowDown },
  { value: 'bend', label: 'ベンド', shortLabel: 'B', icon: Waves },
  { value: 'vibrato', label: 'ビブラート', shortLabel: '~', icon: Music },
  { value: 'palm-mute', label: 'パームミュート', shortLabel: 'PM', icon: Hand },
  { value: 'harmonic', label: 'ハーモニクス', shortLabel: '<>', icon: Sparkles },
  { value: 'let-ring', label: '余韻', shortLabel: 'LR', icon: CircleDot },
  { value: 'accent', label: 'アクセント', shortLabel: '>', icon: Zap },
];

/** ダイナミクス一覧（視覚的な強さ表現付き） */
const DYNAMICS_OPTIONS: {
  value: Dynamics;
  label: string;
  intensity: number; // 1-8 for visual representation
}[] = [
  { value: 'ppp', label: 'ppp', intensity: 1 },
  { value: 'pp', label: 'pp', intensity: 2 },
  { value: 'p', label: 'p', intensity: 3 },
  { value: 'mp', label: 'mp', intensity: 4 },
  { value: 'mf', label: 'mf', intensity: 5 },
  { value: 'f', label: 'f', intensity: 6 },
  { value: 'ff', label: 'ff', intensity: 7 },
  { value: 'fff', label: 'fff', intensity: 8 },
];

// ============================================
// Sub-components
// ============================================

/**
 * DurationInput - 拍数入力コンポーネント
 */
interface DurationInputProps {
  value: number | undefined;
  timeSignature: TimeSignature;
  onChange: (duration: number | undefined) => void;
}

function DurationInput({ value, onChange }: DurationInputProps) {
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(undefined);
    } else {
      const num = parseFloat(inputValue);
      if (!isNaN(num) && num >= 0.25 && num <= 8) {
        onChange(num);
      }
    }
  }, [onChange]);

  // 拍数を視覚的なバーで表示（4拍 = 100%）
  const barWidth = value ? Math.min((value / 4) * 100, 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-text-secondary">
        <Timer className="w-4 h-4" />
        <span className="text-xs font-medium">拍数</span>
      </div>

      {/* プリセットボタン */}
      <div className="flex gap-2">
        {DURATION_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
              value === preset.value
                ? 'bg-accent-primary text-white border-accent-primary shadow-md shadow-accent-primary/25'
                : 'bg-background-primary border-white/10 text-text-secondary hover:border-accent-primary/50 hover:text-text-primary'
            }`}
          >
            {preset.label}拍
          </button>
        ))}
      </div>

      {/* カスタム入力 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="number"
            value={value ?? ''}
            onChange={handleInputChange}
            step={0.25}
            min={0.25}
            max={8}
            className="w-24 pl-8 pr-3 py-2 bg-background-primary border border-white/10 rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/25 transition-all"
            placeholder="カスタム"
          />
        </div>
        <span className="text-xs text-text-muted">0.25〜8拍</span>
      </div>

      {/* 視覚的フィードバック: 拍数バー */}
      {value !== undefined && (
        <div className="space-y-1">
          <div className="h-2 bg-background-primary rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-300"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>0</span>
            <span>1拍</span>
            <span>2拍</span>
            <span>3拍</span>
            <span>4拍</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * TechniqueSelector - テクニック選択コンポーネント
 */
interface TechniqueSelectorProps {
  value: PlayingTechnique[] | undefined;
  onChange: (techniques: PlayingTechnique[] | undefined) => void;
}

function TechniqueSelector({ value = [], onChange }: TechniqueSelectorProps) {
  const selectedTechniques = value || [];

  const handleToggle = useCallback((technique: PlayingTechnique) => {
    const isSelected = selectedTechniques.includes(technique);
    const newTechniques = isSelected
      ? selectedTechniques.filter(t => t !== technique)
      : [...selectedTechniques, technique];
    onChange(newTechniques.length > 0 ? newTechniques : undefined);
  }, [selectedTechniques, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-text-secondary">
        <Music className="w-4 h-4" />
        <span className="text-xs font-medium">テクニック</span>
        {selectedTechniques.length > 0 && (
          <span className="px-1.5 py-0.5 text-[10px] bg-accent-primary/20 text-accent-primary rounded-full">
            {selectedTechniques.length}
          </span>
        )}
      </div>

      {/* 2列×5行のチェックボックスグリッド */}
      <div className="grid grid-cols-2 gap-2">
        {TECHNIQUE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedTechniques.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-accent-primary/15 border-accent-primary text-accent-primary'
                  : 'bg-background-primary border-white/10 text-text-secondary hover:border-white/20 hover:text-text-primary'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                isSelected ? 'bg-accent-primary text-white' : 'bg-white/5'
              }`}>
                <Icon className="w-3 h-3" />
              </div>
              <span className="text-xs font-medium flex-1 text-left">{option.label}</span>
              <span className="text-[10px] font-mono opacity-60">{option.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * DynamicsSelector - ダイナミクス選択コンポーネント
 */
interface DynamicsSelectorProps {
  value: Dynamics | undefined;
  onChange: (dynamics: Dynamics | undefined) => void;
}

function DynamicsSelector({ value, onChange }: DynamicsSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-text-secondary">
        <Volume1 className="w-4 h-4" />
        <span className="text-xs font-medium">ダイナミクス（強弱）</span>
      </div>

      {/* 横並びのラジオボタン風セレクター */}
      <div className="flex items-end gap-0.5 bg-background-primary rounded-xl p-1.5 border border-white/5">
        {DYNAMICS_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(value === option.value ? undefined : option.value)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'bg-accent-primary text-white shadow-md shadow-accent-primary/25'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }`}
              title={`${option.label} - ${option.intensity <= 3 ? '弱' : option.intensity <= 5 ? '中' : '強'}`}
            >
              {/* 視覚的な強弱バー */}
              <div
                className={`w-1.5 rounded-full transition-all duration-200 ${
                  isSelected ? 'bg-white' : 'bg-current'
                }`}
                style={{
                  height: `${8 + option.intensity * 3}px`,
                  opacity: isSelected ? 1 : 0.3 + option.intensity * 0.08
                }}
              />
              <span className={`text-xs font-bold italic ${
                isSelected ? 'text-white' : ''
              }`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 説明ラベル */}
      <div className="flex justify-between text-[10px] text-text-muted px-2">
        <span>最弱 (pianississimo)</span>
        <span>最強 (fortississimo)</span>
      </div>
    </div>
  );
}

/**
 * TieToggle - タイ接続トグルコンポーネント
 */
interface TieToggleProps {
  value: boolean | undefined;
  onChange: (tieToNext: boolean) => void;
}

function TieToggle({ value, onChange }: TieToggleProps) {
  const isEnabled = value ?? false;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-text-secondary">
        <Link className="w-4 h-4" />
        <span className="text-xs font-medium">タイ接続</span>
      </div>

      <button
        type="button"
        onClick={() => onChange(!isEnabled)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
          isEnabled
            ? 'bg-accent-primary/15 border-accent-primary'
            : 'bg-background-primary border-white/10 hover:border-white/20'
        }`}
      >
        {/* トグルスイッチ */}
        <div
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            isEnabled ? 'bg-accent-primary' : 'bg-white/10'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200 ${
              isEnabled ? 'left-6' : 'left-1'
            }`}
          />
        </div>

        {/* ラベルとアイコン */}
        <div className="flex-1 flex items-center gap-2">
          <span className={`text-sm font-medium ${
            isEnabled ? 'text-accent-primary' : 'text-text-secondary'
          }`}>
            次のコードと繋げる
          </span>
          {isEnabled && (
            <div className="flex items-center gap-0.5 text-accent-primary">
              <div className="w-3 h-0.5 bg-current rounded-full" />
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12a8 8 0 0 1 16 0" strokeLinecap="round" />
              </svg>
              <div className="w-3 h-0.5 bg-current rounded-full" />
            </div>
          )}
        </div>
      </button>

      {isEnabled && (
        <p className="text-[10px] text-text-muted px-2">
          タイで繋がれたコードは、音を持続させて次のコードに移行します
        </p>
      )}
    </div>
  );
}

// ============================================
// Main Component
// ============================================

/**
 * ChordDetailSettings
 * TAB譜生成に必要な追加情報（拍数、テクニック、ダイナミクス）を編集するためのコンポーネント
 */
export function ChordDetailSettings({
  duration,
  techniques,
  dynamics,
  tieToNext,
  timeSignature,
  onChange,
}: ChordDetailSettingsProps) {
  const handleDurationChange = useCallback((newDuration: number | undefined) => {
    onChange({ duration: newDuration });
  }, [onChange]);

  const handleTechniquesChange = useCallback((newTechniques: PlayingTechnique[] | undefined) => {
    onChange({ techniques: newTechniques });
  }, [onChange]);

  const handleDynamicsChange = useCallback((newDynamics: Dynamics | undefined) => {
    onChange({ dynamics: newDynamics });
  }, [onChange]);

  const handleTieChange = useCallback((newTieToNext: boolean) => {
    onChange({ tieToNext: newTieToNext });
  }, [onChange]);

  return (
    <div className="space-y-6">
      {/* 拍数入力 */}
      <DurationInput
        value={duration}
        timeSignature={timeSignature}
        onChange={handleDurationChange}
      />

      {/* 区切り線 */}
      <div className="border-t border-white/5" />

      {/* テクニック選択 */}
      <TechniqueSelector
        value={techniques}
        onChange={handleTechniquesChange}
      />

      {/* 区切り線 */}
      <div className="border-t border-white/5" />

      {/* ダイナミクス選択 */}
      <DynamicsSelector
        value={dynamics}
        onChange={handleDynamicsChange}
      />

      {/* 区切り線 */}
      <div className="border-t border-white/5" />

      {/* タイ接続トグル */}
      <TieToggle
        value={tieToNext}
        onChange={handleTieChange}
      />
    </div>
  );
}

export default ChordDetailSettings;
