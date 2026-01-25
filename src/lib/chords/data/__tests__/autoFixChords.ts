/**
 * CaT4G - Auto Fix Chord Fingerings
 * 検証で見つかったエラーを自動的に正しいフィンガリングで修正
 *
 * 使用方法: npx tsx src/lib/chords/data/__tests__/autoFixChords.ts
 */

// 開放弦のMIDI (mod 12): [1弦E, 2弦B, 3弦G, 4弦D, 5弦A, 6弦E]
const OPEN_STRINGS = [4, 11, 7, 2, 9, 4];

// ルート音のMIDI
const ROOT_MIDI: Record<string, number> = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
  'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11,
};

// コード品質のインターバル
const INTERVALS: Record<string, number[]> = {
  'm7-5': [0, 3, 6, 10],  // Half diminished
  'dim7': [0, 3, 6, 9],   // Diminished 7
  'dim': [0, 3, 6],       // Diminished triad
  'blk': [0, 2, 6, 10],   // Blackadder
  'aug': [0, 4, 8],       // Augmented
  'mM7': [0, 3, 7, 11],   // Minor Major 7
  'sus2': [0, 2, 7],      // Suspended 2
  'm7': [0, 3, 7, 10],    // Minor 7
};

/**
 * 指定されたルートと品質に対して正しいフィンガリングを計算
 */
function calculateFingering(root: string, quality: string): { frets: (number | null)[], notes: number[] } | null {
  const rootMidi = ROOT_MIDI[root];
  if (rootMidi === undefined) return null;

  const intervals = INTERVALS[quality];
  if (!intervals) return null;

  // 必要な音（mod 12）
  const requiredNotes = intervals.map(i => (rootMidi + i) % 12);

  // 各弦で必要な音を出すためのフレット位置を探す
  // 複数のボイシングを試す
  const voicings = findValidVoicings(requiredNotes, quality);

  if (voicings.length === 0) return null;

  // 最も弾きやすいボイシングを選択（フレット範囲が狭いもの）
  return voicings[0];
}

/**
 * 有効なボイシングを探す
 */
function findValidVoicings(requiredNotes: number[], _quality: string): { frets: (number | null)[], notes: number[] }[] {
  const voicings: { frets: (number | null)[], notes: number[], span: number }[] = [];

  // 4弦を使用するパターン（strings 1-4）
  for (let baseFret = 0; baseFret <= 12; baseFret++) {
    const frets: (number | null)[] = [null, null, null, null, null, null];
    const playedNotes: number[] = [];
    let valid = true;

    // 弦1-4を使用
    for (let string = 0; string < 4; string++) {
      const openNote = OPEN_STRINGS[string];
      // この弦で必要な音のいずれかを出せるフレットを探す
      let found = false;
      for (const targetNote of requiredNotes) {
        const fret = (targetNote - openNote + 12) % 12;
        const actualFret = fret === 0 ? 0 : (fret + Math.floor(baseFret / 12) * 12);
        // baseFretの近くにあるか確認
        if (actualFret >= baseFret && actualFret <= baseFret + 4) {
          frets[string] = actualFret;
          playedNotes.push(targetNote);
          found = true;
          break;
        }
        // オクターブ上も試す
        const actualFret12 = actualFret + 12;
        if (actualFret12 >= baseFret && actualFret12 <= baseFret + 4) {
          frets[string] = actualFret12;
          playedNotes.push(targetNote);
          found = true;
          break;
        }
      }
      if (!found) {
        valid = false;
        break;
      }
    }

    if (valid) {
      // 全ての必要な音が含まれているか確認
      const uniqueNotes = [...new Set(playedNotes)];
      const hasAllNotes = requiredNotes.every(n => uniqueNotes.includes(n));

      if (hasAllNotes) {
        const activeFrets = frets.filter(f => f !== null) as number[];
        const span = Math.max(...activeFrets) - Math.min(...activeFrets);
        voicings.push({ frets, notes: uniqueNotes, span });
      }
    }
  }

  // フレットスパンでソート
  voicings.sort((a, b) => a.span - b.span);

  return voicings.map(v => ({ frets: v.frets, notes: v.notes }));
}

/**
 * フィンガリングを検証
 */
function verifyFingering(frets: (number | null)[], muted: boolean[], requiredNotes: number[]): { valid: boolean, actualNotes: number[], missing: number[], extra: number[] } {
  const actualNotes: number[] = [];

  frets.forEach((fret, string) => {
    if (fret !== null && !muted[string]) {
      const note = (OPEN_STRINGS[string] + fret) % 12;
      if (!actualNotes.includes(note)) {
        actualNotes.push(note);
      }
    }
  });

  const missing = requiredNotes.filter(n => !actualNotes.includes(n));
  // 5度(interval 7)は省略可
  const missingWithoutFive = missing.filter(_n => {
    // これは単純化のため、5度の省略チェックは行わない
    return true;
  });

  const extra = actualNotes.filter(n => !requiredNotes.includes(n));

  return {
    valid: missingWithoutFive.length === 0 && extra.length === 0,
    actualNotes,
    missing: missingWithoutFive,
    extra,
  };
}

// 正しいフィンガリングのテンプレート（手動で検証済み）
const CORRECT_FINGERINGS: Record<string, Record<string, { frets: (number | null)[], muted: boolean[], difficulty: string }[]>> = {
  // dim7: [0, 3, 6, 9] - 対称コードなので3フレットごとに同じ形
  'dim7': {
    'C': [
      { frets: [null, null, 1, 2, 1, 2], muted: [true, true, false, false, false, false], difficulty: 'medium' },
    ],
    'C#': [
      { frets: [null, null, 2, 3, 2, 3], muted: [true, true, false, false, false, false], difficulty: 'medium' },
    ],
    'D': [
      { frets: [null, null, 0, 1, 0, 1], muted: [true, true, false, false, false, false], difficulty: 'easy' },
    ],
    'D#': [
      { frets: [null, null, 1, 2, 1, 2], muted: [true, true, false, false, false, false], difficulty: 'medium' },
    ],
    'E': [
      { frets: [null, null, 2, 3, 2, 3], muted: [true, true, false, false, false, false], difficulty: 'medium' },
    ],
    'F': [
      { frets: [null, null, 0, 1, 0, 1], muted: [true, true, false, false, false, false], difficulty: 'easy' },
    ],
    'F#': [
      { frets: [null, null, 1, 2, 1, 2], muted: [true, true, false, false, false, false], difficulty: 'medium' },
    ],
    'G': [
      { frets: [null, null, 2, 3, 2, 3], muted: [true, true, false, false, false, false], difficulty: 'medium' },
    ],
    'G#': [
      { frets: [null, null, 0, 1, 0, 1], muted: [true, true, false, false, false, false], difficulty: 'easy' },
    ],
    'A': [
      { frets: [null, null, 1, 2, 1, 2], muted: [true, true, false, false, false, false], difficulty: 'medium' },
    ],
    'A#': [
      { frets: [null, null, 2, 3, 2, 3], muted: [true, true, false, false, false, false], difficulty: 'medium' },
    ],
    'B': [
      { frets: [null, null, 0, 1, 0, 1], muted: [true, true, false, false, false, false], difficulty: 'easy' },
    ],
  },
  // m7-5: [0, 3, 6, 10] - ハーフディミニッシュ
  'm7-5': {
    'C': [
      { frets: [null, 4, 4, 4, null, 8], muted: [true, false, false, false, true, false], difficulty: 'hard' },
    ],
    'C#': [
      { frets: [null, 5, 5, 5, null, 9], muted: [true, false, false, false, true, false], difficulty: 'hard' },
    ],
    'D': [
      { frets: [null, 6, 6, 6, null, 10], muted: [true, false, false, false, true, false], difficulty: 'hard' },
    ],
    'D#': [
      { frets: [null, 7, 7, 7, null, 11], muted: [true, false, false, false, true, false], difficulty: 'hard' },
    ],
    'E': [
      { frets: [0, 2, 0, 2, null, 0], muted: [false, false, false, false, true, false], difficulty: 'easy' },
    ],
    'F': [
      { frets: [1, 3, 1, 3, null, 1], muted: [false, false, false, false, true, false], difficulty: 'medium' },
    ],
    'F#': [
      { frets: [2, 4, 2, 4, null, 2], muted: [false, false, false, false, true, false], difficulty: 'medium' },
    ],
    'G': [
      { frets: [3, 5, 3, 5, null, 3], muted: [false, false, false, false, true, false], difficulty: 'medium' },
    ],
    'G#': [
      { frets: [4, 6, 4, 6, null, 4], muted: [false, false, false, false, true, false], difficulty: 'hard' },
    ],
    'A': [
      { frets: [null, 1, 2, 1, 0, null], muted: [true, false, false, false, false, true], difficulty: 'easy' },
    ],
    'A#': [
      { frets: [null, 2, 3, 2, 1, null], muted: [true, false, false, false, false, true], difficulty: 'medium' },
    ],
    'B': [
      { frets: [null, 3, 4, 3, 2, null], muted: [true, false, false, false, false, true], difficulty: 'medium' },
    ],
  },
};

function main() {
  console.log('='.repeat(80));
  console.log('CaT4G Auto Fix Chord Fingerings');
  console.log('='.repeat(80));
  console.log('');

  // 検証
  for (const [quality, roots] of Object.entries(CORRECT_FINGERINGS)) {
    console.log(`\n=== ${quality} ===`);
    const intervals = INTERVALS[quality];

    for (const [root, fingerings] of Object.entries(roots)) {
      const rootMidi = ROOT_MIDI[root];
      const requiredNotes = intervals.map(i => (rootMidi + i) % 12);

      for (const f of fingerings) {
        const result = verifyFingering(f.frets, f.muted, requiredNotes);
        const status = result.valid ? '✓' : '✗';
        console.log(`${root}${quality}: ${status} frets=[${f.frets.map(x => x === null ? 'x' : x).join(',')}]`);
        if (!result.valid) {
          console.log(`  Required: ${requiredNotes.join(',')}`);
          console.log(`  Actual: ${result.actualNotes.join(',')}`);
          console.log(`  Missing: ${result.missing.join(',')}`);
          console.log(`  Extra: ${result.extra.join(',')}`);
        }
      }
    }
  }

  console.log('\n\nGenerating TypeScript code for correct fingerings...\n');

  // TypeScriptコード生成
  for (const [quality, roots] of Object.entries(CORRECT_FINGERINGS)) {
    console.log(`// ${quality} chord fingerings`);
    for (const [root, fingerings] of Object.entries(roots)) {
      for (let i = 0; i < fingerings.length; i++) {
        const f = fingerings[i];
        console.log(`// ${root}${quality}`);
        console.log(`{`);
        console.log(`  id: '${root}${quality}-${i + 1}',`);
        console.log(`  frets: [${f.frets.map(x => x === null ? 'null' : x).join(', ')}],`);
        console.log(`  fingers: [null, null, null, null, null, null],`);
        console.log(`  baseFret: ${Math.max(1, Math.min(...f.frets.filter(x => x !== null) as number[]))},`);
        console.log(`  muted: [${f.muted.join(', ')}],`);
        console.log(`  difficulty: '${f.difficulty}',`);
        console.log(`},`);
      }
    }
    console.log('');
  }
}

main();
