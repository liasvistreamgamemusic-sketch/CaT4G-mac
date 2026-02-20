import { MetronomeBeatIndicator } from './MetronomeBeatIndicator';

export type TimeSignature = '4/4' | '3/4' | '6/8' | '2/4';

// 現在のセクション情報（usePlaybackSyncから渡される）
interface CurrentSectionInfo {
  name: string;
  transposeOverride: number | null;
  bpmOverride: number | null;
}

interface ControlBarProps {
  transpose?: number;
  onTransposeChange?: (value: number) => void;
  capo?: number;
  onCapoChange?: (value: number) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onPlayFromBeginning?: () => void;
  metronomeEnabled?: boolean;
  onMetronomeToggle?: () => void;
  bpm?: number;
  onBpmChange?: (value: number) => void;
  timeSignature?: TimeSignature;
  onTimeSignatureChange?: (value: TimeSignature) => void;
  metronomeVolume?: number;
  onMetronomeVolumeChange?: (value: number) => void;
  currentBeat?: number;
  // 現在のセクション情報（usePlaybackSyncから渡される）
  currentSection?: CurrentSectionInfo | null;
}

export function ControlBar({
  transpose = 0,
  onTransposeChange,
  capo = 0,
  onCapoChange,
  isPlaying = false,
  onPlayPause,
  onPlayFromBeginning,
  metronomeEnabled = false,
  onMetronomeToggle,
  bpm = 120,
  onBpmChange,
  timeSignature = '4/4',
  onTimeSignatureChange,
  metronomeVolume = 0.7,
  onMetronomeVolumeChange,
  currentBeat = 0,
  currentSection,
}: ControlBarProps) {
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0], 10);

  // 実効値の計算（セクションオーバーライドがある場合はそちらを使用）
  const effectiveBpm = currentSection?.bpmOverride ?? bpm;
  const effectiveTranspose = transpose + (currentSection?.transposeOverride ?? 0);

  // セクション固有の設定があるかどうか
  const hasSectionBpmOverride = currentSection?.bpmOverride != null;
  const hasSectionTransposeOverride = currentSection?.transposeOverride != null;

  const handleTransposeDown = () => {
    if (transpose > -12) {
      onTransposeChange?.(transpose - 1);
    }
  };

  const handleTransposeUp = () => {
    if (transpose < 12) {
      onTransposeChange?.(transpose + 1);
    }
  };

  const handleCapoDown = () => {
    if (capo > -2) {
      onCapoChange?.(capo - 1);
    }
  };

  const handleCapoUp = () => {
    if (capo < 12) {
      onCapoChange?.(capo + 1);
    }
  };

  return (
    <div className="h-16 glass border-t border-border flex items-center justify-between px-6">
      {/* Left: Capo & Transpose */}
      <div className="flex items-center gap-6">
        {/* Capo */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Capo</span>
          <div className="flex items-center gap-1">
            <button
              className="btn-icon text-xs"
              onClick={handleCapoDown}
              disabled={capo <= -2}
            >
              -
            </button>
            <span className={`w-8 text-center font-mono ${
              capo > 0 ? 'text-orange-400 font-semibold' :
              capo < 0 ? 'text-blue-400 font-semibold' : ''
            }`}>
              {capo === -1 ? '半↓' : capo === -2 ? '全↓' : capo}
            </span>
            <button
              className="btn-icon text-xs"
              onClick={handleCapoUp}
              disabled={capo >= 12}
            >
              +
            </button>
          </div>
        </div>

        {/* Transpose */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">移調</span>
          <div className="flex items-center gap-1">
            <button
              className="btn-icon text-xs"
              onClick={handleTransposeDown}
              disabled={transpose <= -12}
            >
              -
            </button>
            <span className={`w-8 text-center font-mono ${effectiveTranspose !== 0 ? 'text-accent-primary font-semibold' : ''}`}>
              {effectiveTranspose > 0 ? `+${effectiveTranspose}` : effectiveTranspose}
            </span>
            <button
              className="btn-icon text-xs"
              onClick={handleTransposeUp}
              disabled={transpose >= 12}
            >
              +
            </button>
            {hasSectionTransposeOverride && (
              <span className="text-yellow-400 text-xs ml-1" title="セクション固有の転調設定">★</span>
            )}
          </div>
        </div>

        {(capo !== 0 || transpose !== 0) && (
          <button
            className="text-xs text-text-muted hover:text-text-secondary"
            onClick={() => {
              onCapoChange?.(0);
              onTransposeChange?.(0);
            }}
          >
            リセット
          </button>
        )}
      </div>

      {/* Center: Playback Controls */}
      <div className="flex items-center gap-4">
        {/* Current Section Name */}
        {currentSection && (
          <div className="flex items-center gap-1 px-2 py-1 bg-accent-primary/10 rounded text-sm">
            <span className="text-accent-primary">▶</span>
            <span className="text-text-secondary truncate max-w-24" title={currentSection.name}>
              {currentSection.name}
            </span>
          </div>
        )}

        {/* Play from Beginning button - only visible when not playing */}
        {!isPlaying && (
          <button
            className="btn-icon"
            onClick={onPlayFromBeginning}
            title="最初から再生"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}

        <button
          className={`btn-icon ${isPlaying ? 'bg-accent-primary/20 text-accent-primary' : ''}`}
          onClick={onPlayPause}
          title={isPlaying ? 'スクロール停止' : 'オートスクロール開始'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">BPM</span>
          <input
            type="number"
            value={bpm}
            onChange={(e) => onBpmChange?.(parseInt(e.target.value) || 120)}
            min={40}
            max={240}
            className="w-16 px-2 py-1 bg-background-surface rounded border border-border
                       text-center font-mono focus:border-accent-primary focus:outline-none"
          />
          <span className={`text-sm font-mono ${hasSectionBpmOverride ? 'text-yellow-400' : 'text-text-muted'}`}>
            {hasSectionBpmOverride && `→ ${effectiveBpm}`}
          </span>
          {hasSectionBpmOverride && (
            <span className="text-yellow-400 text-xs" title="セクション固有のBPM設定">★</span>
          )}
        </div>
      </div>

      {/* Right: Metronome */}
      <div className="flex items-center gap-4">
        <button
          className={`btn-icon ${metronomeEnabled ? 'bg-accent-primary/20 text-orange-400' : 'text-gray-400'}`}
          onClick={onMetronomeToggle}
          title={metronomeEnabled ? 'メトロノーム停止 (M)' : 'メトロノーム開始 (M)'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Time Signature */}
        <select
          value={timeSignature}
          onChange={(e) => onTimeSignatureChange?.(e.target.value as TimeSignature)}
          className="bg-background-surface rounded px-2 py-1 text-sm border border-border
                     focus:border-accent-primary focus:outline-none"
        >
          <option value="4/4">4/4</option>
          <option value="3/4">3/4</option>
          <option value="6/8">6/8</option>
          <option value="2/4">2/4</option>
        </select>

        {/* Beat Indicator - ビジュアルは音声オフでも再生中は表示 */}
        <MetronomeBeatIndicator
          beatsPerMeasure={beatsPerMeasure}
          currentBeat={currentBeat}
          isPlaying={isPlaying}
        />

        {/* Volume Slider */}
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={metronomeVolume}
            onChange={(e) => onMetronomeVolumeChange?.(parseFloat(e.target.value))}
            className="w-16 accent-accent-primary"
            title="メトロノーム音量"
          />
        </div>
      </div>
    </div>
  );
}
