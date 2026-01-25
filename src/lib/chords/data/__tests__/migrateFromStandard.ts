/**
 * CaT4G - Migration Script
 * standardChords.tsから正しいデータを抽出し、新しいルートベース構造に移行
 *
 * 使用方法: npx tsx src/lib/chords/data/__tests__/migrateFromStandard.ts
 */

import { STANDARD_CHORD_FINGERINGS } from '../../standardChords';
import type { ChordFingering } from '../../types';
import * as fs from 'fs';

// ルート音の正規化
const ROOT_ALIASES: Record<string, string> = {
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

// 品質名の正規化マップ
const QUALITY_NORMALIZE: Record<string, string> = {
  'maj': '',
  'M': '',
  'major': '',
  'min': 'm',
  'minor': 'm',
  '-': 'm',
  'dom7': '7',
  'maj7': 'M7',
  'min7': 'm7',
  'ø': 'm7-5',
  'ø7': 'm7-5',
  'm7b5': 'm7-5',
  'hdim': 'm7-5',
  'hdim7': 'm7-5',
  'o': 'dim',
  'o7': 'dim7',
  '+': 'aug',
  'aug7': '7+5',
  '+7': '7+5',
  'minmaj7': 'mM7',
  'm(maj7)': 'mM7',
  'm/M7': 'mM7',
  'minadd9': 'madd9',
};

// 全31品質リスト
const ALL_QUALITIES = [
  '', 'm', '7', 'm7', 'M7',
  'm7-5', 'm-5',
  'dim', 'dim7', 'aug',
  'sus2', 'sus4', '7sus4',
  '6', 'm6',
  'mM7',
  '9', 'm9', 'M9', '9sus4', 'add9',
  '69', 'm69',
  '-5', '7-5', '7+5', 'M7-5', 'm7+5', '7+9',
  '4.4', 'blk',
];

// 12ルート
const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface ParsedChord {
  root: string;
  quality: string;
  bass?: string;
}

/**
 * コード名をルートと品質に分解
 */
function parseChordName(chordName: string): ParsedChord | null {
  // 特殊なコード（blkなど）の処理
  if (chordName.endsWith('blk')) {
    const rootPart = chordName.slice(0, -3);
    const root = ROOT_ALIASES[rootPart] || rootPart;
    return { root, quality: 'blk' };
  }

  // スラッシュコード対応
  const slashMatch = chordName.match(/^([A-G][#b]?)([^/]*)\/([A-G][#b]?)$/);
  if (slashMatch) {
    const root = ROOT_ALIASES[slashMatch[1]] || slashMatch[1];
    const quality = QUALITY_NORMALIZE[slashMatch[2]] ?? slashMatch[2];
    const bass = ROOT_ALIASES[slashMatch[3]] || slashMatch[3];
    return { root, quality, bass };
  }

  // 通常のコード
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return null;

  const root = ROOT_ALIASES[match[1]] || match[1];
  const quality = QUALITY_NORMALIZE[match[2]] ?? match[2];
  return { root, quality };
}

/**
 * ChordFingeringを新形式のFingeringに変換
 */
function convertFingering(f: ChordFingering, id: string): any {
  return {
    id: f.id || id,
    frets: f.frets,
    fingers: f.fingers,
    barreAt: f.barreAt,
    barreStrings: f.barreStrings,
    baseFret: f.baseFret,
    muted: f.muted,
    difficulty: f.difficulty || 'medium',
  };
}

// データ収集構造
type RootData = {
  basic: Record<string, any[]>;
  slash: Record<string, any[]>;
};

function main() {
  console.log('='.repeat(80));
  console.log('CaT4G Migration: standardChords.ts -> root-based structure');
  console.log('='.repeat(80));

  // ルートごとのデータを初期化
  const rootDataMap: Record<string, RootData> = {};
  for (const root of ALL_ROOTS) {
    rootDataMap[root] = {
      basic: {},
      slash: {},
    };
    // 全品質を空配列で初期化
    for (const q of ALL_QUALITIES) {
      rootDataMap[root].basic[q] = [];
    }
  }

  // standardChords.tsからデータを抽出
  let processed = 0;
  let skipped = 0;

  for (const [chordName, fingerings] of Object.entries(STANDARD_CHORD_FINGERINGS)) {
    const parsed = parseChordName(chordName);
    if (!parsed) {
      console.log(`  SKIP: Cannot parse "${chordName}"`);
      skipped++;
      continue;
    }

    const { root, quality, bass } = parsed;

    // ルートが有効か確認
    if (!ALL_ROOTS.includes(root)) {
      console.log(`  SKIP: Unknown root "${root}" in "${chordName}"`);
      skipped++;
      continue;
    }

    // スラッシュコードの場合
    if (bass) {
      // TODO: スラッシュコードの移行
      continue;
    }

    // 品質が有効か確認
    if (!ALL_QUALITIES.includes(quality)) {
      console.log(`  SKIP: Unknown quality "${quality}" in "${chordName}"`);
      skipped++;
      continue;
    }

    // フィンガリングを追加
    for (let i = 0; i < fingerings.length; i++) {
      const f = fingerings[i];
      const id = `${root}${quality}-${i + 1}`;
      rootDataMap[root].basic[quality].push(convertFingering(f, id));
      processed++;
    }
  }

  console.log(`\nProcessed: ${processed} fingerings`);
  console.log(`Skipped: ${skipped} entries`);

  // 各ルートの統計を表示
  console.log('\n=== Root Statistics ===\n');
  for (const root of ALL_ROOTS) {
    let count = 0;
    let emptyQualities: string[] = [];
    for (const [q, fingerings] of Object.entries(rootDataMap[root].basic)) {
      count += fingerings.length;
      if (fingerings.length === 0) {
        emptyQualities.push(q || 'major');
      }
    }
    console.log(`${root}: ${count} fingerings, ${emptyQualities.length} empty qualities`);
    if (emptyQualities.length > 0 && emptyQualities.length <= 10) {
      console.log(`  Empty: ${emptyQualities.join(', ')}`);
    }
  }

  // JSON出力（デバッグ用）
  const outputPath = 'src/lib/chords/data/__tests__/migrated_data.json';
  fs.writeFileSync(outputPath, JSON.stringify(rootDataMap, null, 2));
  console.log(`\nData exported to: ${outputPath}`);
}

main();
