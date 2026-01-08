import { ChordLine } from './ChordLine';
import type { SongWithDetails } from '@/types/database';
import type { ChordDisplayMode } from './MainArea';

interface ChordSheetProps {
  song: SongWithDetails;
  transpose?: number;
  onChordClick?: (chord: string) => void;
  chordDisplayMode?: ChordDisplayMode;
}

/**
 * コード譜全体を表示するコンポーネント
 */
export function ChordSheet({ song, transpose = 0, onChordClick, chordDisplayMode = 'text' }: ChordSheetProps) {
  const { song: songData, artist, sections } = song;

  // 実効キーを計算（オリジナルキー + 転調）
  const effectiveKey = songData.originalKey
    ? transposeKey(songData.originalKey, transpose)
    : null;

  return (
    <div className="chord-sheet">
      {/* Song Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{songData.title}</h1>
        {artist && (
          <p className="text-lg text-text-secondary">{artist.name}</p>
        )}

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {effectiveKey && (
            <Badge label="Key" value={effectiveKey} />
          )}
          {songData.capo > 0 && (
            <Badge label="Capo" value={`${songData.capo}フレット`} />
          )}
          {songData.bpm && (
            <Badge label="BPM" value={songData.bpm.toString()} />
          )}
          {songData.timeSignature && songData.timeSignature !== '4/4' && (
            <Badge label="拍子" value={songData.timeSignature} />
          )}
          {songData.difficulty && (
            <Badge
              label="難易度"
              value={difficultyLabel(songData.difficulty)}
              variant={difficultyVariant(songData.difficulty)}
            />
          )}
        </div>

        {/* Source link */}
        {songData.sourceUrl && (
          <a
            href={songData.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-primary mt-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            元サイトを開く
          </a>
        )}
      </header>

      {/* Sections */}
      <div className="sections space-y-6">
        {sections.map(({ section, lines }) => (
          <section key={section.id} className="section">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-semibold text-accent-primary">
                {section.name}
              </h2>
              {section.repeatCount > 1 && (
                <span className="text-xs bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded">
                  ×{section.repeatCount}
                </span>
              )}
            </div>

            {/* Lines */}
            <div className="lines bg-background-surface/50 rounded-lg p-4 border border-white/5">
              {lines.map((line) => (
                <ChordLine
                  key={line.id}
                  lyrics={line.lyrics}
                  chords={line.chords}
                  transpose={transpose}
                  onChordClick={onChordClick}
                  displayMode={chordDisplayMode}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Notes */}
      {songData.notes && (
        <div className="mt-6 p-4 bg-background-surface/30 rounded-lg border border-white/5">
          <h3 className="text-sm font-medium text-text-secondary mb-2">メモ</h3>
          <p className="text-sm whitespace-pre-wrap">{songData.notes}</p>
        </div>
      )}
    </div>
  );
}

// Badge component
interface BadgeProps {
  label: string;
  value: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

function Badge({ label, value, variant = 'default' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-white/10 text-text-secondary',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${variantClasses[variant]}`}>
      <span className="opacity-70">{label}:</span> {value}
    </span>
  );
}

// Helper functions
function difficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '上級',
  };
  return labels[difficulty] || difficulty;
}

function difficultyVariant(difficulty: string): 'success' | 'warning' | 'error' {
  const variants: Record<string, 'success' | 'warning' | 'error'> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error',
  };
  return variants[difficulty] || 'default' as 'success';
}

// Transpose key helper
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposeKey(key: string, semitones: number): string {
  if (semitones === 0) return key;

  const match = key.match(/^([A-G][#♯b♭]?)(m?)$/);
  if (!match) return key;

  const [, note, minor] = match;
  const normalizedNote = note.replace('♯', '#').replace('♭', 'b');

  const index = NOTES.findIndex(
    (n) => n.toLowerCase() === normalizedNote.toLowerCase()
  );
  if (index === -1) return key;

  const newIndex = (index + semitones + 12) % 12;
  return NOTES[newIndex] + minor;
}
