/**
 * CaT4G - New Data Structure Verification
 * 新しいデータ構造（41種/ルート × 12ルート = 492コード）の構成音を検証
 *
 * 使用方法: npx tsx src/lib/chords/data/__tests__/verifyNewData.ts
 */

import { ALL_CHORD_DATA, EXPECTED_INTERVALS, OPEN_STRINGS, ROOT_TO_MIDI, SLASH_INTERVALS } from '../index';
import type { RootNote, ChordQuality, SlashChordPattern, Fingering } from '../types';

// MIDI番号から音名へのマッピング
const MIDI_TO_NOTE: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface VerificationError {
  chord: string;
  fingeringId: string;
  frets: (number | null)[];
  expectedNotes: string[];
  actualNotes: string[];
  missingNotes: string[];
  extraNotes: string[];
}

/**
 * フィンガリングから実際に鳴る音を計算
 */
function calculateActualNotes(fingering: Fingering): number[] {
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
function calculateExpectedNotes(rootMidi: number, intervals: number[]): number[] {
  return intervals.map(interval => (rootMidi + interval) % 12).sort((a, b) => a - b);
}

/**
 * ユニークな音のセットを比較
 */
function compareNotes(expected: number[], actual: number[], fiveDegree: number): { missing: number[], extra: number[] } {
  const missing = expected.filter(n => !actual.includes(n));
  const extra = actual.filter(n => !expected.includes(n));

  // 5度の省略は許容
  const missingWithoutFive = missing.filter(n => n !== fiveDegree);

  return { missing: missingWithoutFive, extra };
}

/**
 * 基本コードの検証
 */
function verifyBasicChords(): VerificationError[] {
  const errors: VerificationError[] = [];
  const roots: RootNote[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  for (const root of roots) {
    const rootMidi = ROOT_TO_MIDI[root];
    const fiveDegree = (rootMidi + 7) % 12;
    const basicData = ALL_CHORD_DATA[root].basic;

    for (const [quality, fingerings] of Object.entries(basicData)) {
      const intervals = EXPECTED_INTERVALS[quality as ChordQuality];
      if (!intervals) continue;

      const expectedNotes = calculateExpectedNotes(rootMidi, intervals);

      for (const fingering of fingerings) {
        const actualNotes = calculateActualNotes(fingering);
        const { missing, extra } = compareNotes(expectedNotes, actualNotes, fiveDegree);

        if (missing.length > 0 || extra.length > 0) {
          errors.push({
            chord: `${root}${quality}`,
            fingeringId: fingering.id,
            frets: fingering.frets,
            expectedNotes: expectedNotes.map(n => MIDI_TO_NOTE[n]),
            actualNotes: actualNotes.map(n => MIDI_TO_NOTE[n]),
            missingNotes: missing.map(n => MIDI_TO_NOTE[n]),
            extraNotes: extra.map(n => MIDI_TO_NOTE[n]),
          });
        }
      }
    }
  }

  return errors;
}

/**
 * 分数コードの検証
 */
function verifySlashChords(): VerificationError[] {
  const errors: VerificationError[] = [];
  const roots: RootNote[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  for (const root of roots) {
    const rootMidi = ROOT_TO_MIDI[root];
    const slashData = ALL_CHORD_DATA[root].slash;

    for (const [pattern, fingerings] of Object.entries(slashData)) {
      // パターンからベース音と基本コードを抽出
      const patternKey = pattern as SlashChordPattern;
      const bassInterval = SLASH_INTERVALS[patternKey];

      // 基本コードのインターバルを取得
      let baseIntervals: number[];
      if (pattern.startsWith('major/')) {
        baseIntervals = [0, 4, 7]; // Major triad
      } else if (pattern.startsWith('minor7/')) {
        baseIntervals = [0, 3, 7, 10]; // Minor 7
      } else if (pattern.startsWith('minor/')) {
        baseIntervals = [0, 3, 7]; // Minor triad
      } else {
        continue;
      }

      // 期待される音 = 基本コード + ベース音
      const expectedNotes = [...baseIntervals.map(i => (rootMidi + i) % 12)];
      const bassNote = (rootMidi + bassInterval) % 12;
      if (!expectedNotes.includes(bassNote)) {
        expectedNotes.push(bassNote);
      }
      expectedNotes.sort((a, b) => a - b);

      const fiveDegree = (rootMidi + 7) % 12;

      for (const fingering of fingerings) {
        const actualNotes = calculateActualNotes(fingering);
        const { missing, extra } = compareNotes(expectedNotes, actualNotes, fiveDegree);

        if (missing.length > 0 || extra.length > 0) {
          errors.push({
            chord: `${root}${pattern}`,
            fingeringId: fingering.id,
            frets: fingering.frets,
            expectedNotes: expectedNotes.map(n => MIDI_TO_NOTE[n]),
            actualNotes: actualNotes.map(n => MIDI_TO_NOTE[n]),
            missingNotes: missing.map(n => MIDI_TO_NOTE[n]),
            extraNotes: extra.map(n => MIDI_TO_NOTE[n]),
          });
        }
      }
    }
  }

  return errors;
}

/**
 * 統計情報を表示
 */
function showStats() {
  let totalBasic = 0;
  let totalSlash = 0;
  const roots: RootNote[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  console.log('\n=== データ統計 ===\n');

  for (const root of roots) {
    let basicCount = 0;
    let slashCount = 0;

    for (const fingerings of Object.values(ALL_CHORD_DATA[root].basic)) {
      basicCount += fingerings.length;
    }
    for (const fingerings of Object.values(ALL_CHORD_DATA[root].slash)) {
      slashCount += fingerings.length;
    }

    console.log(`${root}: 基本=${basicCount}, 分数=${slashCount}, 計=${basicCount + slashCount}`);
    totalBasic += basicCount;
    totalSlash += slashCount;
  }

  console.log('---');
  console.log(`合計: 基本=${totalBasic}, 分数=${totalSlash}, 総計=${totalBasic + totalSlash}`);
}

/**
 * メイン実行
 */
function main() {
  console.log('='.repeat(80));
  console.log('CaT4G New Data Structure Verification');
  console.log('='.repeat(80));

  showStats();

  console.log('\n=== 構成音検証 ===\n');

  console.log('Verifying basic chords (31 qualities × 12 roots)...');
  const basicErrors = verifyBasicChords();

  console.log('Verifying slash chords (10 patterns × 12 roots)...');
  const slashErrors = verifySlashChords();

  const allErrors = [...basicErrors, ...slashErrors];

  console.log('\n' + '='.repeat(80));
  console.log(`VERIFICATION COMPLETE: ${allErrors.length} errors found`);
  console.log('='.repeat(80));

  if (allErrors.length > 0) {
    console.log('\n### Error Details\n');

    for (const error of allErrors) {
      console.log(`\nChord: ${error.chord}`);
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

  } else {
    console.log('\nAll chord fingerings verified successfully!');
  }
}

main();
