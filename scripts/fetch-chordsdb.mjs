/**
 * CaT4G - chords-db Fetcher & Converter
 *
 * Fetches guitar chord data from tombatossals/chords-db on GitHub
 * and converts it to the project's ChordFingering format.
 *
 * Usage: node scripts/fetch-chordsdb.mjs
 *
 * Output: src/lib/chords/chordsDb.ts
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const OUTPUT_PATH = join(PROJECT_ROOT, 'src/lib/chords/chordsDb.ts');

// ============================================================
// Configuration
// ============================================================

const ROOTS = ['C', 'Csharp', 'D', 'Eb', 'E', 'F', 'Fsharp', 'G', 'Ab', 'A', 'Bb', 'B'];

const ROOT_API_NAMES = {
  C: 'C',
  Csharp: 'C%23',
  D: 'D',
  Eb: 'Eb',
  E: 'E',
  F: 'F',
  Fsharp: 'F%23',
  G: 'G',
  Ab: 'Ab',
  A: 'A',
  Bb: 'Bb',
  B: 'B',
};

/** Enharmonic conversion: chords-db root → project root */
const ROOT_NAME_MAP = {
  C: 'C',
  'C#': 'C#',
  D: 'D',
  Eb: 'D#',
  E: 'E',
  F: 'F',
  'F#': 'F#',
  G: 'G',
  Ab: 'G#',
  A: 'A',
  Bb: 'A#',
  B: 'B',
};

/** chords-db suffix → project quality (null = skip) */
const SUFFIX_MAP = {
  major: '',
  minor: 'm',
  m: 'm', // used as quality part in slash chords (e.g. m/E)
  7: '7',
  m7: 'm7',
  maj7: 'M7',
  m7b5: 'm7-5',
  dim: 'dim',
  dim7: 'dim7',
  aug: 'aug',
  sus2: 'sus2',
  sus4: 'sus4',
  sus: 'sus4',
  '7sus4': '7sus4',
  6: '6',
  m6: 'm6',
  mmaj7: 'mM7',
  9: '9',
  m9: 'm9',
  maj9: 'M9',
  add9: 'add9',
  69: '69',
  m69: 'm69',
  13: '13',
  maj13: 'M13',
  '7b5': '7-5',
  aug7: '7+5',
  maj7b5: 'M7-5',
  '7#9': '7#9',
  '7b9': '7b9',
  5: '5',
  // Skipped suffixes
  11: null,
  m11: null,
  maj11: null,
  'maj7#5': null,
  maj7sus2: null,
  sus2sus4: null,
  '9#11': null,
  '9b5': null,
  aug9: null,
  alt: null,
  add11: null,
  madd9: null,
  mmaj7b5: null,
  mmaj9: null,
  mmaj11: null,
};

const GITHUB_API_BASE =
  'https://api.github.com/repos/tombatossals/chords-db/contents/src/db/guitar/chords';
const GITHUB_RAW_BASE =
  'https://raw.githubusercontent.com/tombatossals/chords-db/refs/heads/master/src/db/guitar/chords';

const RATE_LIMIT_MS = 100;

// ============================================================
// Helpers
// ============================================================

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse a frets string from chords-db.
 * String is 6 chars from low E (6th string) to high E (1st string).
 * Project arrays are ordered [1st string (high E) ... 6th string (low E)].
 * So we reverse the string.
 *
 * Characters: 'x' → null, '0' → 0, '1'-'9' → 1-9, 'a' → 10, 'b' → 11, etc.
 */
function parseFrets(fretsStr) {
  const reversed = fretsStr.split('').reverse();
  return reversed.map((ch) => {
    if (ch === 'x') return null;
    if (ch >= '0' && ch <= '9') return parseInt(ch, 10);
    // 'a' = 10, 'b' = 11, 'c' = 12, ...
    return ch.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
  });
}

/**
 * Parse a fingers string from chords-db.
 * Same reversal. '0' → null, '1'-'4' → 1-4.
 */
function parseFingers(fingersStr) {
  const reversed = fingersStr.split('').reverse();
  return reversed.map((ch) => {
    if (ch === '0') return null;
    return parseInt(ch, 10);
  });
}

/**
 * Detect barre from frets array (already reversed/project-ordered) and barres value.
 * barreAt = barres value.
 * barreStrings = [firstIndex, lastIndex] where frets[index] === barreAt (0-indexed, 0 = 1st string).
 */
function detectBarre(frets, barresValue) {
  if (barresValue == null) {
    return { barreAt: null, barreStrings: null };
  }

  const barreAt = barresValue;
  let firstIdx = -1;
  let lastIdx = -1;

  for (let i = 0; i < frets.length; i++) {
    if (frets[i] === barreAt) {
      if (firstIdx === -1) firstIdx = i;
      lastIdx = i;
    }
  }

  if (firstIdx === -1 || firstIdx === lastIdx) {
    // No valid barre range found
    return { barreAt: null, barreStrings: null };
  }

  return { barreAt, barreStrings: [firstIdx, lastIdx] };
}

/**
 * Determine baseFret.
 */
function getBaseFret(barreAt) {
  return barreAt != null ? barreAt : 1;
}

/**
 * Generate muted array from frets.
 */
function getMuted(frets) {
  return frets.map((f) => f === null);
}

/**
 * Determine difficulty.
 */
function getDifficulty(barreAt, baseFret) {
  if (barreAt == null && baseFret === 1) return 'easy';
  if (barreAt != null && baseFret <= 5) return 'medium';
  if (barreAt != null && baseFret > 5) return 'hard';
  // No barre but baseFret > 1 (shouldn't happen with our logic, but just in case)
  return 'medium';
}

/**
 * Convert a note name using enharmonic mapping (for bass notes in slash chords).
 */
function convertNoteName(note) {
  return ROOT_NAME_MAP[note] ?? note;
}

/**
 * Determine if a suffix is a slash chord and extract components.
 * Returns { qualityPart, bassNote } or null if not a slash chord.
 *
 * Examples:
 *   '/E'   → { qualityPart: '', bassNote: 'E' }
 *   'm/E'  → { qualityPart: 'm', bassNote: 'E' }
 *   'm9/Bb' → { qualityPart: 'm9', bassNote: 'Bb' }
 */
function parseSlashSuffix(suffix) {
  const slashIdx = suffix.indexOf('/');
  if (slashIdx === -1) return null;

  const qualityPart = suffix.substring(0, slashIdx);
  const bassNote = suffix.substring(slashIdx + 1);

  return { qualityPart, bassNote };
}

/**
 * Map a suffix to a project quality string.
 * Returns the quality string, or null if this suffix should be skipped.
 */
function mapSuffix(suffix) {
  if (suffix in SUFFIX_MAP) {
    return SUFFIX_MAP[suffix];
  }
  return undefined; // not found
}

/**
 * Build the chord name from root, suffix.
 * Returns null if the chord should be skipped.
 */
function buildChordName(dbKey, suffix) {
  const root = convertNoteName(dbKey);

  // Check for slash chord
  const slashParts = parseSlashSuffix(suffix);

  if (slashParts) {
    const { qualityPart, bassNote } = slashParts;
    const convertedBass = convertNoteName(bassNote);

    // Map the quality part (empty string for major slash chords)
    let mappedQuality;
    if (qualityPart === '') {
      mappedQuality = '';
    } else {
      mappedQuality = mapSuffix(qualityPart);
      if (mappedQuality === undefined || mappedQuality === null) {
        return null; // Skip unmappable quality
      }
    }

    return `${root}${mappedQuality}/${convertedBass}`;
  }

  // Non-slash chord
  const quality = mapSuffix(suffix);
  if (quality === undefined || quality === null) {
    return null; // Skip
  }

  return `${root}${quality}`;
}

/**
 * Parse the JavaScript object from a chords-db .js file.
 * The files use `export default { ... };` syntax.
 * We strip the export/default and parse the object.
 */
function parseChordFile(jsContent) {
  // Remove `export default` and trailing semicolon
  let objStr = jsContent.replace(/^\s*export\s+default\s+/, '').replace(/;\s*$/, '');

  // The object uses unquoted keys and single-quoted strings.
  // We need to convert this to valid JSON.

  // Quote unquoted keys
  objStr = objStr.replace(/(\s)(\w+)\s*:/g, '$1"$2":');

  // Replace single-quoted strings with double-quoted
  objStr = objStr.replace(/'([^']*)'/g, '"$1"');

  // Replace `true` / `false` (already valid JSON, but ensure)
  // Remove trailing commas before } or ]
  objStr = objStr.replace(/,\s*([}\]])/g, '$1');

  try {
    return JSON.parse(objStr);
  } catch (e) {
    // Fallback: try eval-style parsing (safe because we control the source)
    // Actually, let's try a more robust approach
    try {
      // Use Function constructor to evaluate the object literal
      const fn = new Function(`return (${jsContent.replace(/^\s*export\s+default\s+/, '').replace(/;\s*$/, '')})`);
      return fn();
    } catch (e2) {
      throw new Error(`Failed to parse chord file: ${e.message} / ${e2.message}`);
    }
  }
}

/**
 * Convert a single position from chords-db format to ChordFingering.
 */
function convertPosition(position, chordName, positionIndex) {
  const frets = parseFrets(position.frets);
  const fingers = parseFingers(position.fingers);
  const { barreAt, barreStrings } = detectBarre(frets, position.barres);
  const baseFret = getBaseFret(barreAt);
  const muted = getMuted(frets);
  const difficulty = getDifficulty(barreAt, baseFret);

  // Generate a stable ID
  const idSafe = chordName.replace(/[/#]/g, '_');
  const id = `cdb-${idSafe}-${positionIndex}`;

  return {
    id,
    frets,
    fingers,
    barreAt,
    barreStrings,
    baseFret,
    muted,
    isDefault: false,
    difficulty,
  };
}

// ============================================================
// Fetching
// ============================================================

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'CaT4G-ChordFetcher/1.0',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'CaT4G-ChordFetcher/1.0',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

/**
 * Fetch the file list for a root from GitHub API.
 * Returns array of { name, download_url } for .js files (excluding index.js).
 */
async function fetchFileList(rootApiName) {
  const url = `${GITHUB_API_BASE}/${rootApiName}`;
  const files = await fetchJSON(url);
  return files
    .filter((f) => f.name.endsWith('.js') && f.name !== 'index.js')
    .map((f) => ({
      name: f.name,
      download_url: f.download_url,
    }));
}

/**
 * Fetch and parse a single chord file.
 */
async function fetchAndParseChord(downloadUrl) {
  const content = await fetchText(downloadUrl);
  return parseChordFile(content);
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('CaT4G chords-db Fetcher');
  console.log('========================');
  console.log('');

  // Collect all chords: Map<chordName, ChordFingering[]>
  const allChords = new Map();
  let totalPositions = 0;
  let skippedSuffixes = new Set();
  let errorCount = 0;

  for (const root of ROOTS) {
    const apiName = ROOT_API_NAMES[root];
    const displayRoot = root.replace('sharp', '#');
    console.log(`\n[${displayRoot}] Fetching file list...`);

    let files;
    try {
      files = await fetchFileList(apiName);
      console.log(`  Found ${files.length} chord files`);
    } catch (err) {
      console.error(`  ERROR fetching file list for ${displayRoot}: ${err.message}`);
      errorCount++;
      continue;
    }

    await delay(RATE_LIMIT_MS);

    for (const file of files) {
      try {
        const chordData = await fetchAndParseChord(file.download_url);
        const { key, suffix, positions } = chordData;

        const chordName = buildChordName(key, suffix);
        if (chordName === null) {
          skippedSuffixes.add(suffix);
          continue;
        }

        const existingCount = allChords.has(chordName) ? allChords.get(chordName).length : 0;
        const fingerings = positions.map((pos, idx) =>
          convertPosition(pos, chordName, existingCount + idx)
        );

        if (allChords.has(chordName)) {
          allChords.get(chordName).push(...fingerings);
        } else {
          allChords.set(chordName, fingerings);
        }

        totalPositions += fingerings.length;

        await delay(RATE_LIMIT_MS);
      } catch (err) {
        console.error(`  ERROR parsing ${file.name}: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`  Processed. Running total: ${allChords.size} chords, ${totalPositions} positions`);
  }

  console.log('\n========================');
  console.log(`Total chords: ${allChords.size}`);
  console.log(`Total positions: ${totalPositions}`);
  console.log(`Skipped suffixes: ${[...skippedSuffixes].join(', ') || '(none)'}`);
  console.log(`Errors: ${errorCount}`);

  // Sort chord names for consistent output
  const sortedChords = [...allChords.entries()].sort((a, b) => {
    // Sort by root note order, then by quality
    const rootOrder = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    const getRootIdx = (name) => {
      for (let i = rootOrder.length - 1; i >= 0; i--) {
        if (name.startsWith(rootOrder[i])) return i;
      }
      return -1;
    };
    const aRoot = getRootIdx(a[0]);
    const bRoot = getRootIdx(b[0]);
    if (aRoot !== bRoot) return aRoot - bRoot;
    return a[0].localeCompare(b[0]);
  });

  // Generate TypeScript
  console.log('\nGenerating TypeScript output...');
  const tsContent = generateTypeScript(sortedChords);

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, tsContent, 'utf-8');
  console.log(`Written to ${OUTPUT_PATH}`);
  console.log('Done!');
}

/**
 * Generate the TypeScript output file content.
 */
function generateTypeScript(sortedChords) {
  const lines = [];

  lines.push(`/**`);
  lines.push(` * CaT4G - chords-db データ`);
  lines.push(` * tombatossals/chords-db から自動生成`);
  lines.push(` * https://github.com/tombatossals/chords-db`);
  lines.push(` *`);
  lines.push(` * Generated: ${new Date().toISOString()}`);
  lines.push(` * DO NOT EDIT MANUALLY - regenerate with: node scripts/fetch-chordsdb.mjs`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`import type { ChordFingering } from './types';`);
  lines.push(``);
  lines.push(`const DATA: [string, ChordFingering[]][] = [`);

  for (const [chordName, fingerings] of sortedChords) {
    lines.push(`  [${JSON.stringify(chordName)}, [`);
    for (const f of fingerings) {
      const fretStr = serializeArray(f.frets);
      const fingerStr = serializeArray(f.fingers);
      const barreStringsStr =
        f.barreStrings != null ? `[${f.barreStrings[0]}, ${f.barreStrings[1]}]` : 'null';
      const mutedStr = `[${f.muted.map((m) => (m ? 'true' : 'false')).join(', ')}]`;

      lines.push(
        `    { id: ${JSON.stringify(f.id)}, frets: ${fretStr}, fingers: ${fingerStr}, barreAt: ${f.barreAt ?? 'null'}, barreStrings: ${barreStringsStr}, baseFret: ${f.baseFret}, muted: ${mutedStr}, isDefault: false, difficulty: ${JSON.stringify(f.difficulty)} },`
      );
    }
    lines.push(`  ]],`);
  }

  lines.push(`];`);
  lines.push(``);
  lines.push(`const CHORDS_DB = new Map<string, ChordFingering[]>(DATA);`);
  lines.push(``);
  lines.push(`export function getChordsDbFingerings(chordName: string): ChordFingering[] {`);
  lines.push(`  return CHORDS_DB.get(chordName) ?? [];`);
  lines.push(`}`);
  lines.push(``);

  return lines.join('\n');
}

/**
 * Serialize an array of (number | null) for TypeScript output.
 */
function serializeArray(arr) {
  const items = arr.map((v) => (v === null ? 'null' : String(v)));
  return `[${items.join(', ')}]`;
}

// Run
main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
