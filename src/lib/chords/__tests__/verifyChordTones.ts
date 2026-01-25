/**
 * CaT4G - Chord Tone Verification Script
 * 全フィンガリングの構成音を検証し、エラーを検出
 *
 * 使用方法: npx tsx src/lib/chords/__tests__/verifyChordTones.ts
 */

import { CHORD_DATABASE } from '../database';
import { STANDARD_CHORD_FINGERINGS } from '../standardChords';
import { generateDimFingerings, generateDim7Fingerings, generateAugFingerings, generateAug7Fingerings } from '../symmetricChords';
import { generate9Fingerings, generateM9Fingerings, generatem9Fingerings, generatemadd9Fingerings, generate7sus4Fingerings, generate7sus2Fingerings, generateadd9Fingerings, generateadd2Fingerings, generateadd4Fingerings, generate9sus4Fingerings, generateM7b5Fingerings } from '../extendedChords';
import { generatem7b5Fingerings } from '../m7b5Chords';
import { generatePowerChordFingerings } from '../powerChords';
import { generateSus2Fingerings } from '../sus2Chords';
import type { ChordFingering } from '../types';

// 開放弦の音（標準チューニング）
// [1弦(E4), 2弦(B3), 3弦(G3), 4弦(D3), 5弦(A2), 6弦(E2)]
const OPEN_STRINGS: number[] = [4, 11, 7, 2, 9, 4]; // MIDIノート番号 mod 12

// 音名からMIDI番号（mod 12）へのマッピング
const NOTE_TO_MIDI: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

// MIDI番号から音名へのマッピング
const MIDI_TO_NOTE: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// コード構成音のインターバル定義
const CHORD_INTERVALS: Record<string, number[]> = {
  '': [0, 4, 7], // Major
  'm': [0, 3, 7], // Minor
  '7': [0, 4, 7, 10], // Dominant 7
  'm7': [0, 3, 7, 10], // Minor 7
  'M7': [0, 4, 7, 11], // Major 7
  'dim': [0, 3, 6], // Diminished
  'dim7': [0, 3, 6, 9], // Diminished 7
  'aug': [0, 4, 8], // Augmented
  'aug7': [0, 4, 8, 10], // Augmented 7
  'm7b5': [0, 3, 6, 10], // Half diminished
  '9': [0, 4, 7, 10, 14], // Dominant 9
  'M9': [0, 4, 7, 11, 14], // Major 9
  'm9': [0, 3, 7, 10, 14], // Minor 9
  'madd9': [0, 3, 7, 14], // Minor add 9
  '7sus4': [0, 5, 7, 10], // 7 sus4
  '7sus2': [0, 2, 7, 10], // 7 sus2
  'add9': [0, 4, 7, 14], // Add 9
  'add2': [0, 2, 4, 7], // Add 2
  'add4': [0, 4, 5, 7], // Add 4
  '9sus4': [0, 5, 7, 10, 14], // 9 sus4
  'M7b5': [0, 4, 6, 11], // Major 7 flat 5
  '5': [0, 7], // Power chord
  'sus2': [0, 2, 7], // Sus 2
  'sus4': [0, 5, 7], // Sus 4
  '6': [0, 4, 7, 9], // Major 6
  'm6': [0, 3, 7, 9], // Minor 6
  'mM7': [0, 3, 7, 11], // Minor Major 7
};

// 12音全てのルート
const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface VerificationError {
  chordName: string;
  fingeringId: string;
  frets: (number | null)[];
  expectedNotes: string[];
  actualNotes: string[];
  missingNotes: string[];
  extraNotes: string[];
  source: string;
}

/**
 * フィンガリングから実際に鳴る音を計算
 */
function calculateActualNotes(fingering: ChordFingering): number[] {
  const notes: number[] = [];

  fingering.frets.forEach((fret, stringIndex) => {
    if (fret !== null && !fingering.muted[stringIndex]) {
      const note = (OPEN_STRINGS[stringIndex] + fret) % 12;
      if (!notes.includes(note)) {
        notes.push(note);
      }
    }
  });

  return notes.sort((a, b) => a - b);
}

/**
 * 期待されるインターバルをルートに基づいて音に変換
 */
function calculateExpectedNotes(root: string, quality: string): number[] {
  const rootMidi = NOTE_TO_MIDI[root];
  if (rootMidi === undefined) return [];

  const intervals = CHORD_INTERVALS[quality];
  if (!intervals) return [];

  // インターバルをmod 12で音に変換
  return intervals.map(interval => (rootMidi + interval) % 12).sort((a, b) => a - b);
}

/**
 * ユニークな音のセットを比較
 */
function compareNotes(expected: number[], actual: number[]): { missing: number[], extra: number[] } {
  const missing = expected.filter(n => !actual.includes(n));
  const extra = actual.filter(n => !expected.includes(n));
  return { missing, extra };
}

/**
 * MIDI番号を音名に変換
 */
function midiToNoteName(midi: number): string {
  return MIDI_TO_NOTE[midi % 12];
}

/**
 * フィンガリングを検証
 */
function verifyFingering(
  chordName: string,
  quality: string,
  fingering: ChordFingering,
  source: string
): VerificationError | null {
  // ルートを抽出
  const rootMatch = chordName.match(/^([A-G][#b]?)/);
  if (!rootMatch) return null;
  const root = rootMatch[1];

  const expectedNotes = calculateExpectedNotes(root, quality);
  if (expectedNotes.length === 0) {
    // インターバル定義がない場合はスキップ
    return null;
  }

  const actualNotes = calculateActualNotes(fingering);
  const { missing, extra } = compareNotes(expectedNotes, actualNotes);

  // 5度の省略は許容（特にジャズコードでは一般的）
  const fiveDegree = (NOTE_TO_MIDI[root] + 7) % 12;
  const missingWithoutFive = missing.filter(n => n !== fiveDegree);

  // エラー判定: 5度以外の音が欠けているか、余計な音があるか
  if (missingWithoutFive.length > 0 || extra.length > 0) {
    return {
      chordName,
      fingeringId: fingering.id,
      frets: fingering.frets,
      expectedNotes: expectedNotes.map(midiToNoteName),
      actualNotes: actualNotes.map(midiToNoteName),
      missingNotes: missing.map(midiToNoteName),
      extraNotes: extra.map(midiToNoteName),
      source,
    };
  }

  return null;
}

/**
 * データベースのコードを検証
 */
function verifyDatabaseChords(): VerificationError[] {
  const errors: VerificationError[] = [];

  for (const [chordName, chordDef] of Object.entries(CHORD_DATABASE)) {
    // ChordDefinitionから品質とフィンガリングを取得
    const quality = chordDef.quality || '';
    const fingerings = chordDef.fingerings || [];

    for (const fingering of fingerings) {
      const error = verifyFingering(chordName, quality, fingering, 'database.ts');
      if (error) errors.push(error);
    }
  }

  return errors;
}

/**
 * 対称コード（dim/dim7/aug/aug7）を検証
 */
function verifySymmetricChords(): VerificationError[] {
  const errors: VerificationError[] = [];

  for (const root of ALL_ROOTS) {
    // dim
    const dimFingerings = generateDimFingerings(root);
    for (const f of dimFingerings) {
      const error = verifyFingering(`${root}dim`, 'dim', f, 'symmetricChords.ts');
      if (error) errors.push(error);
    }

    // dim7
    const dim7Fingerings = generateDim7Fingerings(root);
    for (const f of dim7Fingerings) {
      const error = verifyFingering(`${root}dim7`, 'dim7', f, 'symmetricChords.ts');
      if (error) errors.push(error);
    }

    // aug
    const augFingerings = generateAugFingerings(root);
    for (const f of augFingerings) {
      const error = verifyFingering(`${root}aug`, 'aug', f, 'symmetricChords.ts');
      if (error) errors.push(error);
    }

    // aug7
    const aug7Fingerings = generateAug7Fingerings(root);
    for (const f of aug7Fingerings) {
      const error = verifyFingering(`${root}aug7`, 'aug7', f, 'symmetricChords.ts');
      if (error) errors.push(error);
    }
  }

  return errors;
}

/**
 * m7b5コードを検証
 */
function verifyM7b5Chords(): VerificationError[] {
  const errors: VerificationError[] = [];

  for (const root of ALL_ROOTS) {
    const fingerings = generatem7b5Fingerings(root);
    for (const f of fingerings) {
      const error = verifyFingering(`${root}m7b5`, 'm7b5', f, 'm7b5Chords.ts');
      if (error) errors.push(error);
    }
  }

  return errors;
}

/**
 * 拡張コードを検証
 */
function verifyExtendedChords(): VerificationError[] {
  const errors: VerificationError[] = [];

  const generators: [string, (root: string) => ChordFingering[]][] = [
    ['9', generate9Fingerings],
    ['M9', generateM9Fingerings],
    ['m9', generatem9Fingerings],
    ['madd9', generatemadd9Fingerings],
    ['7sus4', generate7sus4Fingerings],
    ['7sus2', generate7sus2Fingerings],
    ['add9', generateadd9Fingerings],
    ['add2', generateadd2Fingerings],
    ['add4', generateadd4Fingerings],
    ['9sus4', generate9sus4Fingerings],
    ['M7b5', generateM7b5Fingerings],
  ];

  for (const root of ALL_ROOTS) {
    for (const [quality, generator] of generators) {
      const fingerings = generator(root);
      for (const f of fingerings) {
        const error = verifyFingering(`${root}${quality}`, quality, f, 'extendedChords.ts');
        if (error) errors.push(error);
      }
    }
  }

  return errors;
}

/**
 * パワーコードを検証
 */
function verifyPowerChords(): VerificationError[] {
  const errors: VerificationError[] = [];

  for (const root of ALL_ROOTS) {
    const fingerings = generatePowerChordFingerings(root);
    for (const f of fingerings) {
      const error = verifyFingering(`${root}5`, '5', f, 'powerChords.ts');
      if (error) errors.push(error);
    }
  }

  return errors;
}

/**
 * Sus2コードを検証
 */
function verifySus2Chords(): VerificationError[] {
  const errors: VerificationError[] = [];

  for (const root of ALL_ROOTS) {
    const fingerings = generateSus2Fingerings(root);
    for (const f of fingerings) {
      const error = verifyFingering(`${root}sus2`, 'sus2', f, 'sus2Chords.ts');
      if (error) errors.push(error);
    }
  }

  return errors;
}

/**
 * 標準コードライブラリを検証（最重要）
 */
function verifyStandardChords(): VerificationError[] {
  const errors: VerificationError[] = [];

  for (const [chordName, fingerings] of Object.entries(STANDARD_CHORD_FINGERINGS)) {
    // 品質を抽出
    const qualityMatch = chordName.match(/^[A-G][#b]?(.*)$/);
    const quality = qualityMatch ? qualityMatch[1] : '';

    for (const fingering of fingerings) {
      const error = verifyFingering(chordName, quality, fingering, 'standardChords.ts');
      if (error) errors.push(error);
    }
  }

  return errors;
}

/**
 * メイン実行
 */
function main() {
  console.log('='.repeat(80));
  console.log('CaT4G Chord Tone Verification');
  console.log('='.repeat(80));
  console.log('');

  const allErrors: VerificationError[] = [];

  // 各カテゴリを検証
  console.log('Verifying standard chord library (PRIMARY SOURCE)...');
  allErrors.push(...verifyStandardChords());

  console.log('Verifying database chords...');
  allErrors.push(...verifyDatabaseChords());

  console.log('Verifying symmetric chords (dim/dim7/aug/aug7)...');
  allErrors.push(...verifySymmetricChords());

  console.log('Verifying m7b5 chords...');
  allErrors.push(...verifyM7b5Chords());

  console.log('Verifying extended chords...');
  allErrors.push(...verifyExtendedChords());

  console.log('Verifying power chords...');
  allErrors.push(...verifyPowerChords());

  console.log('Verifying sus2 chords...');
  allErrors.push(...verifySus2Chords());

  console.log('');
  console.log('='.repeat(80));
  console.log(`VERIFICATION COMPLETE: ${allErrors.length} errors found`);
  console.log('='.repeat(80));
  console.log('');

  if (allErrors.length > 0) {
    // ソースファイルごとにグループ化
    const bySource: Record<string, VerificationError[]> = {};
    for (const error of allErrors) {
      if (!bySource[error.source]) {
        bySource[error.source] = [];
      }
      bySource[error.source].push(error);
    }

    for (const [source, errors] of Object.entries(bySource)) {
      console.log(`\n### ${source} (${errors.length} errors)`);
      console.log('-'.repeat(60));

      for (const error of errors) {
        console.log(`\nChord: ${error.chordName}`);
        console.log(`  ID: ${error.fingeringId}`);
        console.log(`  Frets: [${error.frets.map(f => f === null ? 'x' : f).join(', ')}]`);
        console.log(`  Expected: [${error.expectedNotes.join(', ')}]`);
        console.log(`  Actual:   [${error.actualNotes.join(', ')}]`);
        if (error.missingNotes.length > 0) {
          console.log(`  Missing:  [${error.missingNotes.join(', ')}]`);
        }
        if (error.extraNotes.length > 0) {
          console.log(`  Extra:    [${error.extraNotes.join(', ')}]`);
        }
      }
    }

    // サマリー
    console.log('\n');
    console.log('='.repeat(80));
    console.log('ERROR SUMMARY BY FILE');
    console.log('='.repeat(80));
    for (const [source, errors] of Object.entries(bySource)) {
      console.log(`  ${source}: ${errors.length} errors`);
    }
  } else {
    console.log('All chord fingerings verified successfully!');
  }
}

// スクリプト実行
main();
