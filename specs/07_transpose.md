# CaT4G - 転調機能

**状態: 実装必須**

コード譜の転調とコードダイアグラム表示機能。

## 機能仕様

### 基本機能

- -12 〜 +12 半音の範囲で転調
- クイックプリセット（+1, -1, +3, -3, +5, -5）
- リアルタイムコード変換
- コードダイアグラム表示
- 押さえ方の選択・カスタム登録

### UI 要素

| 要素 | 説明 |
|------|------|
| 転調スライダー | -12 〜 +12 の範囲 |
| プリセットボタン | よく使う転調量 |
| 原調に戻るボタン | transpose = 0 にリセット |
| カポ位置表示 | 転調後の推奨カポ位置 |
| コードダイアグラム | クリックで押さえ方を表示 |

## コード管理システム

### データ構造

コード情報はコードベースで管理し、カスタム押さえ方は DB に保存。

```typescript
// src/lib/chords/types.ts

// コードのルート音
type NoteRoot = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

// コード品質（メジャー、マイナー等）
type ChordQuality =
  | ''        // メジャー
  | 'm'       // マイナー
  | '7'       // セブンス
  | 'M7'      // メジャーセブンス
  | 'm7'      // マイナーセブンス
  | 'dim'     // ディミニッシュ
  | 'dim7'    // ディミニッシュセブンス
  | 'aug'     // オーギュメント
  | 'sus2'    // サスツー
  | 'sus4'    // サスフォー
  | 'add9'    // アドナイン
  | '9'       // ナインス
  | 'm9'      // マイナーナインス
  | '11'      // イレブンス
  | '13'      // サーティーンス
  | '6'       // シックス
  | 'm6'      // マイナーシックス
  | '7sus4'   // セブンサスフォー
  | '7#9'     // セブンシャープナイン
  | '7b9';    // セブンフラットナイン

// コードの押さえ方
interface ChordFingering {
  id: string;                        // 一意識別子
  frets: (number | null)[];          // 各弦のフレット位置 [1弦, 2弦, 3弦, 4弦, 5弦, 6弦]
  fingers: (number | null)[];        // 指番号 (1=人差し指, 2=中指, 3=薬指, 4=小指)
  barreAt: number | null;            // バレーの位置
  barreStrings: [number, number] | null; // バレーする弦の範囲 [開始, 終了]
  baseFret: number;                  // 基準フレット（ダイアグラム表示用）
  muted: boolean[];                  // ミュートする弦
  isDefault: boolean;                // デフォルト押さえ方かどうか
  difficulty: 'easy' | 'medium' | 'hard';
  name?: string;                     // カスタム名（ユーザー登録用）
}

// コード定義
interface ChordDefinition {
  root: NoteRoot;
  quality: ChordQuality;
  bass?: NoteRoot;                   // 分数コードのベース音
  fingerings: ChordFingering[];      // 利用可能な押さえ方のリスト
}

// ユーザーの押さえ方設定
interface UserChordPreference {
  chordName: string;                 // 例: "C", "Am7", "D/F#"
  preferredFingeringId: string;      // 選択中の押さえ方 ID
  customFingerings: ChordFingering[]; // ユーザー登録の押さえ方
}
```

### コードデータベース（コードベース）

```typescript
// src/lib/chords/database.ts

import { ChordDefinition, ChordFingering } from './types';

// 基本コードの押さえ方データ
export const CHORD_DATABASE: Record<string, ChordDefinition> = {
  // メジャーコード
  'C': {
    root: 'C',
    quality: '',
    fingerings: [
      {
        id: 'C-open',
        frets: [0, 1, 0, 2, 3, null],
        fingers: [null, 1, null, 2, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'easy',
      },
      {
        id: 'C-barre-3',
        frets: [3, 5, 5, 5, 3, 3],
        fingers: [1, 3, 3, 3, 1, 1],
        barreAt: 3,
        barreStrings: [1, 6],
        baseFret: 3,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      },
    ],
  },
  'D': {
    root: 'D',
    quality: '',
    fingerings: [
      {
        id: 'D-open',
        frets: [2, 3, 2, 0, null, null],
        fingers: [1, 3, 2, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: true,
        difficulty: 'easy',
      },
    ],
  },
  // ... 他のコード

  // マイナーコード
  'Am': {
    root: 'A',
    quality: 'm',
    fingerings: [
      {
        id: 'Am-open',
        frets: [0, 1, 2, 2, 0, null],
        fingers: [null, 1, 2, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'easy',
      },
    ],
  },

  // セブンスコード
  'G7': {
    root: 'G',
    quality: '7',
    fingerings: [
      {
        id: 'G7-open',
        frets: [1, 0, 0, 0, 2, 3],
        fingers: [1, null, null, null, 2, 3],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      },
    ],
  },

  // 分数コード
  'D/F#': {
    root: 'D',
    quality: '',
    bass: 'F#',
    fingerings: [
      {
        id: 'D/F#-open',
        frets: [2, 3, 2, 0, 0, 2],
        fingers: [1, 3, 2, null, null, 1],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'medium',
      },
    ],
  },
};

// 全音階
export const NOTES: NoteRoot[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 異名同音の正規化
export const NOTE_ALIASES: Record<string, NoteRoot> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Fb': 'E',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'Cb': 'B',
  'E#': 'F',
  'B#': 'C',
};
```

### 転調ロジック

```typescript
// src/lib/chords/transpose.ts

import { NOTES, NOTE_ALIASES, CHORD_DATABASE } from './database';
import { NoteRoot, ChordDefinition } from './types';

// 音名を正規化
function normalizeNote(note: string): NoteRoot {
  if (NOTE_ALIASES[note]) {
    return NOTE_ALIASES[note];
  }
  return note as NoteRoot;
}

// コード文字列をパース
interface ParsedChord {
  root: NoteRoot;
  quality: string;
  bass?: NoteRoot;
}

export function parseChord(chordStr: string): ParsedChord | null {
  // 分数コードの処理
  const slashIndex = chordStr.indexOf('/');
  let mainPart = chordStr;
  let bass: NoteRoot | undefined;

  if (slashIndex !== -1) {
    mainPart = chordStr.substring(0, slashIndex);
    const bassStr = chordStr.substring(slashIndex + 1);
    const bassMatch = bassStr.match(/^[A-G][#b]?/);
    if (bassMatch) {
      bass = normalizeNote(bassMatch[0]);
    }
  }

  // ルート音の抽出
  const rootMatch = mainPart.match(/^[A-G][#b]?/);
  if (!rootMatch) return null;

  const root = normalizeNote(rootMatch[0]);
  const quality = mainPart.substring(rootMatch[0].length);

  return { root, quality, bass };
}

// コードを転調
export function transposeChord(chord: string, semitones: number): string {
  const parsed = parseChord(chord);
  if (!parsed) return chord;

  const { root, quality, bass } = parsed;

  // ルート音を転調
  const rootIndex = NOTES.indexOf(root);
  const newRootIndex = (rootIndex + semitones + 12) % 12;
  const newRoot = NOTES[newRootIndex];

  // ベース音も転調（分数コードの場合）
  let newBass = '';
  if (bass) {
    const bassIndex = NOTES.indexOf(bass);
    const newBassIndex = (bassIndex + semitones + 12) % 12;
    newBass = '/' + NOTES[newBassIndex];
  }

  return newRoot + quality + newBass;
}

// 転調後のコード定義を取得
export function getTransposedChordDefinition(
  chord: string,
  semitones: number
): ChordDefinition | null {
  const transposedChord = transposeChord(chord, semitones);

  // データベースから検索
  if (CHORD_DATABASE[transposedChord]) {
    return CHORD_DATABASE[transposedChord];
  }

  // 動的に生成（バレーコードとして計算）
  return generateChordDefinition(transposedChord);
}

// バレーコードを動的生成
function generateChordDefinition(chord: string): ChordDefinition | null {
  const parsed = parseChord(chord);
  if (!parsed) return null;

  // 基本形からの移動フレット数を計算
  // ... バレーコード生成ロジック

  return null; // 実装省略
}
```

### カスタム押さえ方の DB 保存

```sql
-- migrations/002_chord_preferences.sql

CREATE TABLE IF NOT EXISTS chord_preferences (
    id TEXT PRIMARY KEY,
    chord_name TEXT NOT NULL,
    preferred_fingering_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(chord_name)
);

CREATE TABLE IF NOT EXISTS custom_fingerings (
    id TEXT PRIMARY KEY,
    chord_name TEXT NOT NULL,
    frets TEXT NOT NULL,           -- JSON array
    fingers TEXT NOT NULL,         -- JSON array
    barre_at INTEGER,
    barre_strings TEXT,            -- JSON array [start, end]
    base_fret INTEGER NOT NULL DEFAULT 1,
    muted TEXT NOT NULL,           -- JSON array
    difficulty TEXT DEFAULT 'medium',
    name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_custom_fingerings_chord ON custom_fingerings(chord_name);
```

```typescript
// src/lib/database/chordPreferences.ts

import Database from '@tauri-apps/plugin-sql';
import { ChordFingering, UserChordPreference } from '../chords/types';

export async function getChordPreference(
  db: Database,
  chordName: string
): Promise<UserChordPreference | null> {
  const result = await db.select<any[]>(
    'SELECT * FROM chord_preferences WHERE chord_name = ?',
    [chordName]
  );

  if (result.length === 0) return null;

  const customFingerings = await db.select<any[]>(
    'SELECT * FROM custom_fingerings WHERE chord_name = ?',
    [chordName]
  );

  return {
    chordName,
    preferredFingeringId: result[0].preferred_fingering_id,
    customFingerings: customFingerings.map(parseFingeringRow),
  };
}

export async function setPreferredFingering(
  db: Database,
  chordName: string,
  fingeringId: string
): Promise<void> {
  await db.execute(
    `INSERT INTO chord_preferences (id, chord_name, preferred_fingering_id)
     VALUES (?, ?, ?)
     ON CONFLICT(chord_name) DO UPDATE SET
       preferred_fingering_id = excluded.preferred_fingering_id,
       updated_at = datetime('now')`,
    [crypto.randomUUID(), chordName, fingeringId]
  );
}

export async function addCustomFingering(
  db: Database,
  chordName: string,
  fingering: Omit<ChordFingering, 'id' | 'isDefault'>
): Promise<string> {
  const id = crypto.randomUUID();
  await db.execute(
    `INSERT INTO custom_fingerings
     (id, chord_name, frets, fingers, barre_at, barre_strings, base_fret, muted, difficulty, name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      chordName,
      JSON.stringify(fingering.frets),
      JSON.stringify(fingering.fingers),
      fingering.barreAt,
      fingering.barreStrings ? JSON.stringify(fingering.barreStrings) : null,
      fingering.baseFret,
      JSON.stringify(fingering.muted),
      fingering.difficulty,
      fingering.name,
    ]
  );
  return id;
}
```

### コードダイアグラムコンポーネント

```typescript
// src/components/ChordDiagram.tsx

import { ChordFingering } from '../lib/chords/types';

interface ChordDiagramProps {
  chord: string;
  fingering: ChordFingering;
  size?: 'sm' | 'md' | 'lg';
  showFingers?: boolean;
  onClick?: () => void;
}

export function ChordDiagram({
  chord,
  fingering,
  size = 'md',
  showFingers = true,
  onClick,
}: ChordDiagramProps) {
  const sizes = {
    sm: { width: 60, height: 80, dotSize: 6 },
    md: { width: 80, height: 100, dotSize: 8 },
    lg: { width: 120, height: 150, dotSize: 12 },
  };

  const { width, height, dotSize } = sizes[size];
  const stringSpacing = width / 6;
  const fretSpacing = (height - 20) / 5;

  return (
    <div
      className={`inline-flex flex-col items-center cursor-pointer ${onClick ? 'hover:bg-gray-800' : ''}`}
      onClick={onClick}
    >
      {/* コード名 */}
      <span className="text-sm font-mono mb-1">{chord}</span>

      <svg width={width} height={height} className="bg-gray-900 rounded">
        {/* ナット（1フレットの場合） */}
        {fingering.baseFret === 1 && (
          <rect x={5} y={15} width={width - 10} height={3} fill="white" />
        )}

        {/* フレット番号（2フレット以上の場合） */}
        {fingering.baseFret > 1 && (
          <text x={2} y={25} fontSize={10} fill="#9ca3af">
            {fingering.baseFret}
          </text>
        )}

        {/* 弦 */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`string-${i}`}
            x1={10 + i * stringSpacing}
            y1={18}
            x2={10 + i * stringSpacing}
            y2={height - 5}
            stroke="#6b7280"
            strokeWidth={1}
          />
        ))}

        {/* フレット */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`fret-${i}`}
            x1={5}
            y1={18 + i * fretSpacing}
            x2={width - 5}
            y2={18 + i * fretSpacing}
            stroke="#6b7280"
            strokeWidth={1}
          />
        ))}

        {/* バレー */}
        {fingering.barreAt && fingering.barreStrings && (
          <rect
            x={10 + fingering.barreStrings[0] * stringSpacing - dotSize / 2}
            y={18 + (fingering.barreAt - fingering.baseFret) * fretSpacing + fretSpacing / 2 - dotSize / 2}
            width={(fingering.barreStrings[1] - fingering.barreStrings[0]) * stringSpacing + dotSize}
            height={dotSize}
            rx={dotSize / 2}
            fill="#a855f7"
          />
        )}

        {/* 押さえる位置 */}
        {fingering.frets.map((fret, stringIndex) => {
          if (fret === null || fret === 0) return null;

          const x = 10 + stringIndex * stringSpacing;
          const y = 18 + (fret - fingering.baseFret) * fretSpacing + fretSpacing / 2;

          return (
            <g key={`dot-${stringIndex}`}>
              <circle cx={x} cy={y} r={dotSize / 2} fill="#a855f7" />
              {showFingers && fingering.fingers[stringIndex] && (
                <text
                  x={x}
                  y={y + 3}
                  fontSize={8}
                  fill="white"
                  textAnchor="middle"
                >
                  {fingering.fingers[stringIndex]}
                </text>
              )}
            </g>
          );
        })}

        {/* 開放弦・ミュート */}
        {fingering.frets.map((fret, stringIndex) => {
          const x = 10 + stringIndex * stringSpacing;

          if (fingering.muted[stringIndex]) {
            return (
              <text key={`mute-${stringIndex}`} x={x} y={12} fontSize={10} fill="#ef4444" textAnchor="middle">
                ×
              </text>
            );
          }

          if (fret === 0) {
            return (
              <circle key={`open-${stringIndex}`} cx={x} cy={10} r={4} fill="none" stroke="#22c55e" strokeWidth={1.5} />
            );
          }

          return null;
        })}
      </svg>
    </div>
  );
}
```

### 押さえ方選択モーダル

```typescript
// src/components/ChordFingeringSelector.tsx

interface ChordFingeringSelectorProps {
  chord: string;
  fingerings: ChordFingering[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddCustom: () => void;
}

export function ChordFingeringSelector({
  chord,
  fingerings,
  selectedId,
  onSelect,
  onAddCustom,
}: ChordFingeringSelectorProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{chord} の押さえ方を選択</h3>

      <div className="grid grid-cols-3 gap-4">
        {fingerings.map((fingering) => (
          <div
            key={fingering.id}
            className={`
              p-2 rounded border-2 cursor-pointer
              ${selectedId === fingering.id
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-700 hover:border-gray-600'}
            `}
            onClick={() => onSelect(fingering.id)}
          >
            <ChordDiagram chord={chord} fingering={fingering} size="md" />
            <div className="text-xs text-center mt-1 text-gray-400">
              {fingering.difficulty === 'easy' && '簡単'}
              {fingering.difficulty === 'medium' && '普通'}
              {fingering.difficulty === 'hard' && '難しい'}
            </div>
          </div>
        ))}

        {/* カスタム追加ボタン */}
        <button
          onClick={onAddCustom}
          className="p-2 rounded border-2 border-dashed border-gray-600 hover:border-gray-500 flex items-center justify-center"
        >
          <span className="text-gray-400">+ 追加</span>
        </button>
      </div>
    </div>
  );
}
```

## 転調 UI

```typescript
// src/components/TransposeControls.tsx

interface TransposeControlsProps {
  transpose: number;
  originalKey?: string;
  onTransposeChange: (value: number) => void;
}

export function TransposeControls({
  transpose,
  originalKey,
  onTransposeChange,
}: TransposeControlsProps) {
  const presets = [-5, -3, -1, 1, 3, 5];

  return (
    <div className="flex items-center gap-4 border-l border-gray-700 pl-4">
      {/* 転調量表示 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTransposeChange(transpose - 1)}
          disabled={transpose <= -12}
          className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          -
        </button>
        <span className="w-12 text-center font-mono">
          {transpose >= 0 ? '+' : ''}{transpose}
        </span>
        <button
          onClick={() => onTransposeChange(transpose + 1)}
          disabled={transpose >= 12}
          className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* プリセットボタン */}
      <div className="flex gap-1">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => onTransposeChange(preset)}
            className={`
              px-2 py-1 text-xs rounded
              ${transpose === preset ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}
            `}
          >
            {preset >= 0 ? '+' : ''}{preset}
          </button>
        ))}
      </div>

      {/* リセットボタン */}
      {transpose !== 0 && (
        <button
          onClick={() => onTransposeChange(0)}
          className="text-sm text-gray-400 hover:text-white"
        >
          原調に戻す
        </button>
      )}

      {/* 転調後のキー表示 */}
      {originalKey && (
        <span className="text-sm text-gray-400">
          {originalKey} → {transposeChord(originalKey, transpose)}
        </span>
      )}
    </div>
  );
}
```

## 実装タスク

1. [ ] `src/lib/chords/types.ts` - コード型定義
2. [ ] `src/lib/chords/database.ts` - コードデータベース（全コード定義）
3. [ ] `src/lib/chords/transpose.ts` - 転調ロジック
4. [ ] `migrations/002_chord_preferences.sql` - カスタム押さえ方 DB
5. [ ] `src/lib/database/chordPreferences.ts` - カスタム押さえ方 CRUD
6. [ ] `src/components/ChordDiagram.tsx` - コードダイアグラム
7. [ ] `src/components/ChordFingeringSelector.tsx` - 押さえ方選択
8. [ ] `src/components/TransposeControls.tsx` - 転調 UI
9. [ ] MainArea でコードクリック時にダイアグラム表示

## 対応コード一覧

### メジャー系
C, C#, D, D#, E, F, F#, G, G#, A, A#, B

### マイナー系
Cm, C#m, Dm, D#m, Em, Fm, F#m, Gm, G#m, Am, A#m, Bm

### セブンス系
C7, D7, E7, F7, G7, A7, B7
Cm7, Dm7, Em7, Fm7, Gm7, Am7, Bm7
CM7, DM7, EM7, FM7, GM7, AM7, BM7

### その他
sus2, sus4, add9, dim, aug, 6, m6, 9, m9, 11, 13

### 分数コード
D/F#, G/B, C/E, Am/G, etc.

## 次のステップ

転調機能完了後 → [08_playlist.md](./08_playlist.md) でプレイリスト機能を実装
