import type { TimeSignature } from '@/types/database';

// 音楽のキー一覧
const MUSICAL_KEYS = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
  'Cm', 'C#m', 'Dbm', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm', 'F#m', 'Gbm', 'Gm', 'G#m', 'Abm', 'Am', 'A#m', 'Bbm', 'Bm',
];

// 拍子選択肢
const TIME_SIGNATURES: TimeSignature[] = ['4/4', '3/4', '6/8', '2/4'];

interface SongMetadataFormProps {
  bpm: number | null;
  onBpmChange: (value: number | null) => void;
  timeSignature: TimeSignature;
  onTimeSignatureChange: (value: TimeSignature) => void;
  capo: number;
  onCapoChange: (value: number) => void;
  originalKey: string | null;
  onKeyChange: (value: string | null) => void;
  className?: string;
}

export function SongMetadataForm({
  bpm,
  onBpmChange,
  timeSignature,
  onTimeSignatureChange,
  capo,
  onCapoChange,
  originalKey,
  onKeyChange,
  className = '',
}: SongMetadataFormProps) {
  const handleCapoDown = () => {
    if (capo > 0) {
      onCapoChange(capo - 1);
    }
  };

  const handleCapoUp = () => {
    if (capo < 12) {
      onCapoChange(capo + 1);
    }
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onBpmChange(null);
    } else {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed) && parsed >= 20 && parsed <= 300) {
        onBpmChange(parsed);
      }
    }
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onKeyChange(value === '' ? null : value);
  };

  return (
    <div className={`flex flex-wrap items-center gap-6 ${className}`}>
      {/* BPM */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-black whitespace-nowrap">BPM</label>
        <input
          type="number"
          value={bpm ?? ''}
          onChange={handleBpmChange}
          placeholder="120"
          min={20}
          max={300}
          className="w-20 px-2 py-1 bg-background-surface rounded border border-border
                     text-center font-mono focus:border-accent-primary focus:outline-none"
        />
      </div>

      {/* Time Signature */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-black whitespace-nowrap">拍子</label>
        <select
          value={timeSignature}
          onChange={(e) => onTimeSignatureChange(e.target.value as TimeSignature)}
          className="bg-background-surface rounded px-2 py-1 text-sm border border-border
                     focus:border-accent-primary focus:outline-none"
        >
          {TIME_SIGNATURES.map((ts) => (
            <option key={ts} value={ts}>
              {ts}
            </option>
          ))}
        </select>
      </div>

      {/* Capo */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-black whitespace-nowrap">Capo</label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="btn-icon text-xs"
            onClick={handleCapoDown}
            disabled={capo <= 0}
          >
            -
          </button>
          <span
            className={`w-6 text-center font-mono ${
              capo !== 0 ? 'text-orange-400 font-semibold' : ''
            }`}
          >
            {capo}
          </span>
          <button
            type="button"
            className="btn-icon text-xs"
            onClick={handleCapoUp}
            disabled={capo >= 12}
          >
            +
          </button>
        </div>
      </div>

      {/* Key (調) */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-black whitespace-nowrap">調</label>
        <select
          value={originalKey ?? ''}
          onChange={handleKeyChange}
          className="bg-background-surface rounded px-2 py-1 text-sm border border-border
                     focus:border-accent-primary focus:outline-none min-w-[70px]"
        >
          <option value="">未設定</option>
          <optgroup label="メジャー">
            {MUSICAL_KEYS.filter((k) => !k.includes('m')).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </optgroup>
          <optgroup label="マイナー">
            {MUSICAL_KEYS.filter((k) => k.includes('m')).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Reset button */}
      {(bpm !== null || capo !== 0 || originalKey !== null) && (
        <button
          type="button"
          className="text-xs text-text-muted hover:text-text-secondary"
          onClick={() => {
            onBpmChange(null);
            onCapoChange(0);
            onKeyChange(null);
          }}
        >
          リセット
        </button>
      )}
    </div>
  );
}
