/**
 * CaT4G - Root File Generator
 * Generates TypeScript root files from migrated_data.json
 *
 * Usage: npx tsx src/lib/chords/data/__tests__/generateRootFiles.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
interface Fingering {
  id: string;
  frets: (number | null)[];
  fingers: (number | null)[];
  barreAt?: number | null;
  barreStrings?: [number, number] | null;
  baseFret: number;
  muted: boolean[];
  difficulty: 'easy' | 'medium' | 'hard';
  intervals?: number[];
}

interface RootData {
  basic: Record<string, Fingering[]>;
  slash?: Record<string, Fingering[]>;
}

type MigratedData = Record<string, RootData>;

// All 31 chord qualities in order
const ALL_QUALITIES = [
  '',        // Major
  'm',       // Minor
  '7',       // Dominant 7
  'm7',      // Minor 7
  'M7',      // Major 7
  'm7-5',    // Half Diminished (= m7b5)
  'm-5',     // Minor flat 5
  'dim',     // Diminished
  'dim7',    // Diminished 7
  'aug',     // Augmented
  'sus2',    // Suspended 2
  'sus4',    // Suspended 4
  '7sus4',   // Dominant 7 sus4
  '6',       // Major 6
  'm6',      // Minor 6
  'mM7',     // Minor Major 7
  '9',       // Dominant 9
  'm9',      // Minor 9
  'M9',      // Major 9
  '9sus4',   // Dominant 9 sus4
  'add9',    // Add 9
  '69',      // Major 6/9
  'm69',     // Minor 6/9
  '-5',      // Major flat 5
  '7-5',     // Dominant 7 flat 5
  '7+5',     // Dominant 7 sharp 5
  'M7-5',    // Major 7 flat 5
  'm7+5',    // Minor 7 sharp 5
  '7+9',     // Dominant 7 sharp 9
  '4.4',     // Quartal chord
  'blk',     // Blackadder chord
] as const;

// All 10 slash chord patterns
const ALL_SLASH_PATTERNS = [
  'major/2',
  'major/4',
  'major/5',
  'major/7',
  'major/9',
  'major/10',
  'minor/3',
  'minor/7',
  'minor7/5',
  'minor7/10',
] as const;

// Root to file name mapping
const ROOT_TO_FILENAME: Record<string, string> = {
  'C': 'C',
  'C#': 'Cs',
  'D': 'D',
  'D#': 'Ds',
  'E': 'E',
  'F': 'F',
  'F#': 'Fs',
  'G': 'G',
  'G#': 'Gs',
  'A': 'A',
  'A#': 'As',
  'B': 'B',
};

// Root to variable prefix mapping
const ROOT_TO_PREFIX: Record<string, string> = {
  'C': 'C',
  'C#': 'CS',
  'D': 'D',
  'D#': 'DS',
  'E': 'E',
  'F': 'F',
  'F#': 'FS',
  'G': 'G',
  'G#': 'GS',
  'A': 'A',
  'A#': 'AS',
  'B': 'B',
};

// Root to MIDI number
const ROOT_TO_MIDI: Record<string, number> = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
  'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11,
};

// Quality descriptions for comments
const QUALITY_DESCRIPTIONS: Record<string, string> = {
  '': 'Major',
  'm': 'Minor',
  '7': 'Dominant 7',
  'm7': 'Minor 7',
  'M7': 'Major 7',
  'm7-5': 'Half Diminished (m7b5)',
  'm-5': 'Minor flat 5 (diminished triad variant)',
  'dim': 'Diminished',
  'dim7': 'Diminished 7',
  'aug': 'Augmented',
  'sus2': 'Suspended 2',
  'sus4': 'Suspended 4',
  '7sus4': 'Dominant 7 sus4',
  '6': 'Major 6',
  'm6': 'Minor 6',
  'mM7': 'Minor Major 7',
  '9': 'Dominant 9',
  'm9': 'Minor 9',
  'M9': 'Major 9',
  '9sus4': 'Dominant 9 sus4',
  'add9': 'Add 9',
  '69': 'Major 6/9',
  'm69': 'Minor 6/9',
  '-5': 'Major flat 5',
  '7-5': 'Dominant 7 flat 5',
  '7+5': 'Dominant 7 sharp 5 (= aug7)',
  'M7-5': 'Major 7 flat 5',
  'm7+5': 'Minor 7 sharp 5',
  '7+9': 'Dominant 7 sharp 9',
  '4.4': 'Quartal chord (C-F-Bb)',
  'blk': 'Blackadder chord',
};

// Expected intervals for each quality
const EXPECTED_INTERVALS: Record<string, number[]> = {
  '': [0, 4, 7],
  'm': [0, 3, 7],
  '7': [0, 4, 7, 10],
  'm7': [0, 3, 7, 10],
  'M7': [0, 4, 7, 11],
  'm7-5': [0, 3, 6, 10],
  'm-5': [0, 3, 6],
  'dim': [0, 3, 6],
  'dim7': [0, 3, 6, 9],
  'aug': [0, 4, 8],
  'sus2': [0, 2, 7],
  'sus4': [0, 5, 7],
  '7sus4': [0, 5, 7, 10],
  '6': [0, 4, 7, 9],
  'm6': [0, 3, 7, 9],
  'mM7': [0, 3, 7, 11],
  '9': [0, 4, 7, 10, 14],
  'm9': [0, 3, 7, 10, 14],
  'M9': [0, 4, 7, 11, 14],
  '9sus4': [0, 5, 7, 10, 14],
  'add9': [0, 4, 7, 14],
  '69': [0, 4, 7, 9, 14],
  'm69': [0, 3, 7, 9, 14],
  '-5': [0, 4, 6],
  '7-5': [0, 4, 6, 10],
  '7+5': [0, 4, 8, 10],
  'M7-5': [0, 4, 6, 11],
  'm7+5': [0, 3, 8, 10],
  '7+9': [0, 4, 7, 10, 15],
  '4.4': [0, 5, 10],
  'blk': [0, 2, 6, 10],
};

/**
 * Format a fingering object as TypeScript code
 */
function formatFingering(fingering: Fingering, indent: string = '    '): string {
  const lines: string[] = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  id: '${fingering.id}',`);

  // Format frets array
  const fretsStr = fingering.frets.map(f => f === null ? 'null' : f).join(', ');
  lines.push(`${indent}  frets: [${fretsStr}],`);

  // Format fingers array
  const fingersStr = fingering.fingers.map(f => f === null ? 'null' : f).join(', ');
  lines.push(`${indent}  fingers: [${fingersStr}],`);

  // Add barreAt if present
  if (fingering.barreAt !== undefined && fingering.barreAt !== null) {
    lines.push(`${indent}  barreAt: ${fingering.barreAt},`);
    if (fingering.barreStrings) {
      lines.push(`${indent}  barreStrings: [${fingering.barreStrings[0]}, ${fingering.barreStrings[1]}],`);
    }
  }

  lines.push(`${indent}  baseFret: ${fingering.baseFret},`);

  // Format muted array
  const mutedStr = fingering.muted.map(m => m ? 'true' : 'false').join(', ');
  lines.push(`${indent}  muted: [${mutedStr}],`);

  lines.push(`${indent}  difficulty: '${fingering.difficulty}',`);

  // Add intervals if present
  if (fingering.intervals && fingering.intervals.length > 0) {
    lines.push(`${indent}  intervals: [${fingering.intervals.join(', ')}],`);
  }

  lines.push(`${indent}},`);
  return lines.join('\n');
}

/**
 * Generate the TypeScript file content for a root
 */
function generateRootFile(root: string, data: RootData): string {
  const prefix = ROOT_TO_PREFIX[root];
  const midi = ROOT_TO_MIDI[root];
  const lines: string[] = [];

  // File header
  lines.push('/**');
  lines.push(` * CaT4G - ${root} Root Chord Data`);
  lines.push(` * ${root}ルートの全31コード品質 + 10分数コード`);
  lines.push(' *');
  lines.push(' * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]');
  lines.push(' * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]');
  lines.push(' *');
  lines.push(` * ${root} = MIDI ${midi}`);
  lines.push(' */');
  lines.push('');
  lines.push("import type { Fingering, ChordQuality, SlashChordPattern } from '../types';");
  lines.push('');

  // Basic chords section
  lines.push(`// ${root}ルートの基本コード（31品質）`);
  lines.push(`export const ${prefix}_BASIC: Record<ChordQuality, Fingering[]> = {`);

  // Group qualities by category
  const categories = [
    { name: '基本 (5種)', qualities: ['', 'm', '7', 'm7', 'M7'] },
    { name: 'ハーフディミニッシュ系 (2種)', qualities: ['m7-5', 'm-5'] },
    { name: 'ディミニッシュ/オーギュメント (3種)', qualities: ['dim', 'dim7', 'aug'] },
    { name: 'サスペンド系 (3種)', qualities: ['sus2', 'sus4', '7sus4'] },
    { name: 'シックス系 (2種)', qualities: ['6', 'm6'] },
    { name: 'マイナーメジャー (1種)', qualities: ['mM7'] },
    { name: 'ナインス系 (5種)', qualities: ['9', 'm9', 'M9', '9sus4', 'add9'] },
    { name: 'シックスナインス系 (2種)', qualities: ['69', 'm69'] },
    { name: 'オルタード系 (6種)', qualities: ['-5', '7-5', '7+5', 'M7-5', 'm7+5', '7+9'] },
    { name: '特殊 (2種)', qualities: ['4.4', 'blk'] },
  ];

  for (const category of categories) {
    lines.push('  // ============================================');
    lines.push(`  // ${category.name}`);
    lines.push('  // ============================================');
    lines.push('');

    for (const quality of category.qualities) {
      const fingerings = data.basic[quality] || [];
      const intervals = EXPECTED_INTERVALS[quality] || [];
      const description = QUALITY_DESCRIPTIONS[quality] || quality;
      const chordName = quality === '' ? `${root} Major` : `${root}${quality}`;
      const intervalsStr = intervals.map(i => i % 12).map(getNoteName).join(', ');

      lines.push(`  // ${chordName} - ${description}`);
      if (intervals.length > 0) {
        lines.push(`  // Intervals: [${intervals.join(', ')}] = ${intervalsStr}`);
      }

      if (fingerings.length === 0) {
        lines.push(`  '${quality}': [],`);
      } else {
        lines.push(`  '${quality}': [`);
        for (const fingering of fingerings) {
          lines.push(formatFingering(fingering));
        }
        lines.push('  ],');
      }
      lines.push('');
    }
  }

  lines.push('};');
  lines.push('');

  // Slash chords section
  lines.push(`// ${root}ルートの分数コード（10パターン）`);
  lines.push(`export const ${prefix}_SLASH: Record<SlashChordPattern, Fingering[]> = {`);

  // Group slash patterns by type
  const slashCategories = [
    { name: 'メジャー分数 (6種)', patterns: ['major/2', 'major/4', 'major/5', 'major/7', 'major/9', 'major/10'] },
    { name: 'マイナー分数 (2種)', patterns: ['minor/3', 'minor/7'] },
    { name: 'マイナー7分数 (2種)', patterns: ['minor7/5', 'minor7/10'] },
  ];

  for (const category of slashCategories) {
    lines.push(`  // ${category.name}`);

    for (const pattern of category.patterns) {
      const slashData = data.slash || {};
      const fingerings = slashData[pattern] || [];

      if (fingerings.length === 0) {
        lines.push(`  '${pattern}': [],`);
      } else {
        lines.push(`  '${pattern}': [`);
        for (const fingering of fingerings) {
          lines.push(formatFingering(fingering));
        }
        lines.push('  ],');
      }
    }
    lines.push('');
  }

  lines.push('};');
  lines.push('');

  return lines.join('\n');
}

/**
 * Get note name from interval (relative to C)
 */
function getNoteName(interval: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return notes[interval % 12];
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(80));
  console.log('CaT4G Root File Generator');
  console.log('='.repeat(80));
  console.log('');

  // Read migrated data
  const dataPath = path.join(__dirname, 'migrated_data.json');
  console.log(`Reading migrated data from: ${dataPath}`);

  let migratedData: MigratedData;
  try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    migratedData = JSON.parse(rawData);
    console.log(`Loaded data for ${Object.keys(migratedData).length} roots`);
  } catch (error) {
    console.error(`Error reading migrated data: ${error}`);
    process.exit(1);
  }

  // Output directory
  const outputDir = path.join(__dirname, '..', 'roots');
  console.log(`Output directory: ${outputDir}`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('Created output directory');
  }

  // Generate files for each root
  const roots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let totalFingerings = 0;

  console.log('');
  console.log('Generating root files...');
  console.log('');

  for (const root of roots) {
    const filename = ROOT_TO_FILENAME[root];
    const filePath = path.join(outputDir, `${filename}.ts`);

    // Get data for this root (or create empty structure)
    const rootData: RootData = migratedData[root] || { basic: {}, slash: {} };

    // Ensure all qualities exist
    for (const quality of ALL_QUALITIES) {
      if (!rootData.basic[quality]) {
        rootData.basic[quality] = [];
      }
    }

    // Ensure slash data exists
    if (!rootData.slash) {
      rootData.slash = {};
    }
    for (const pattern of ALL_SLASH_PATTERNS) {
      if (!rootData.slash[pattern]) {
        rootData.slash[pattern] = [];
      }
    }

    // Count fingerings
    let basicCount = 0;
    let slashCount = 0;
    for (const fingerings of Object.values(rootData.basic)) {
      basicCount += fingerings.length;
    }
    for (const fingerings of Object.values(rootData.slash)) {
      slashCount += fingerings.length;
    }
    totalFingerings += basicCount + slashCount;

    // Generate and write file
    const content = generateRootFile(root, rootData);
    fs.writeFileSync(filePath, content, 'utf-8');

    console.log(`  ${root.padEnd(3)} -> ${filename}.ts (basic: ${basicCount}, slash: ${slashCount})`);
  }

  console.log('');
  console.log('='.repeat(80));
  console.log(`Generated ${roots.length} root files with ${totalFingerings} total fingerings`);
  console.log('='.repeat(80));
  console.log('');
  console.log('Next step: Run verification script:');
  console.log('  npx tsx src/lib/chords/data/__tests__/verifyNewData.ts');
}

main().catch(console.error);
