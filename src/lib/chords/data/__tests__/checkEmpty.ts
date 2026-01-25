import { ALL_CHORD_DATA, ALL_QUALITIES } from '../index';
import type { ChordQuality, SlashChordPattern, RootNote } from '../types';

const roots: RootNote[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// All 31 basic qualities from types.ts
const basicQualities: ChordQuality[] = ALL_QUALITIES;

// All 10 slash patterns from types.ts
const slashPatterns: SlashChordPattern[] = [
  'major/2', 'major/4', 'major/5', 'major/7', 'major/9', 'major/10',
  'minor/3', 'minor/7',
  'minor7/5', 'minor7/10'
];

console.log('=== Empty Chord Check ===\n');

const totalExpectedBasic = basicQualities.length * 12;
const totalExpectedSlash = slashPatterns.length * 12;
let totalWithFingeringsBasic = 0;
let totalWithFingeringsSlash = 0;
let totalFingeringsBasic = 0;
let totalFingeringsSlash = 0;
const emptyBasicByQuality: Record<string, string[]> = {};
const emptySlashByPattern: Record<string, string[]> = {};

for (const root of roots) {
  const chordData = ALL_CHORD_DATA[root];
  const basicData = chordData.basic;
  const slashData = chordData.slash;

  const emptyBasic: string[] = [];
  const emptySlash: string[] = [];

  // Check basic qualities
  for (const q of basicQualities) {
    const fingerings = basicData[q];
    if (!fingerings || fingerings.length === 0) {
      const displayKey = q === '' ? '(major)' : q;
      emptyBasic.push(displayKey);
      if (!emptyBasicByQuality[displayKey]) {
        emptyBasicByQuality[displayKey] = [];
      }
      emptyBasicByQuality[displayKey].push(root);
    } else {
      totalWithFingeringsBasic++;
      totalFingeringsBasic += fingerings.length;
    }
  }

  // Check slash patterns
  for (const p of slashPatterns) {
    const fingerings = slashData[p];
    if (!fingerings || fingerings.length === 0) {
      emptySlash.push(p);
      if (!emptySlashByPattern[p]) {
        emptySlashByPattern[p] = [];
      }
      emptySlashByPattern[p].push(root);
    } else {
      totalWithFingeringsSlash++;
      totalFingeringsSlash += fingerings.length;
    }
  }

  if (emptyBasic.length > 0 || emptySlash.length > 0) {
    console.log('Root ' + root + ':');
    if (emptyBasic.length > 0) {
      console.log('  Basic empty: [' + emptyBasic.join(', ') + ']');
    }
    if (emptySlash.length > 0) {
      console.log('  Slash empty: [' + emptySlash.join(', ') + ']');
    }
  }
}

console.log('\n=== Empty Qualities Summary ===\n');

// Group by status: completely empty, partially empty, or complete
const completelyEmptyBasic: string[] = [];
const partiallyEmptyBasic: { quality: string; emptyRoots: string[]; hasRoots: string[] }[] = [];
const completeBasic: string[] = [];

for (const q of basicQualities) {
  const displayKey = q === '' ? '(major)' : q;
  const emptyRoots = emptyBasicByQuality[displayKey] || [];
  if (emptyRoots.length === 12) {
    completelyEmptyBasic.push(displayKey);
  } else if (emptyRoots.length > 0) {
    const hasRoots = roots.filter(r => !emptyRoots.includes(r));
    partiallyEmptyBasic.push({ quality: displayKey, emptyRoots, hasRoots });
  } else {
    completeBasic.push(displayKey);
  }
}

console.log('=== BASIC CHORDS ===\n');

console.log('COMPLETELY EMPTY (0/12 roots have data):');
if (completelyEmptyBasic.length > 0) {
  console.log('  ' + completelyEmptyBasic.join(', '));
} else {
  console.log('  (none)');
}

console.log('\nPARTIALLY FILLED:');
if (partiallyEmptyBasic.length > 0) {
  for (const item of partiallyEmptyBasic) {
    console.log('  ' + item.quality + ': has data for [' + item.hasRoots.join(', ') + '] (' + item.hasRoots.length + '/12)');
  }
} else {
  console.log('  (none)');
}

console.log('\nCOMPLETE (12/12 roots have data):');
if (completeBasic.length > 0) {
  console.log('  ' + completeBasic.join(', '));
} else {
  console.log('  (none)');
}

// Same for slash
const completelyEmptySlash: string[] = [];
const partiallyEmptySlash: { pattern: string; emptyRoots: string[]; hasRoots: string[] }[] = [];
const completeSlash: string[] = [];

for (const p of slashPatterns) {
  const emptyRoots = emptySlashByPattern[p] || [];
  if (emptyRoots.length === 12) {
    completelyEmptySlash.push(p);
  } else if (emptyRoots.length > 0) {
    const hasRoots = roots.filter(r => !emptyRoots.includes(r));
    partiallyEmptySlash.push({ pattern: p, emptyRoots, hasRoots });
  } else {
    completeSlash.push(p);
  }
}

console.log('\n=== SLASH CHORDS ===\n');

console.log('COMPLETELY EMPTY (0/12 roots have data):');
if (completelyEmptySlash.length > 0) {
  console.log('  ' + completelyEmptySlash.join(', '));
} else {
  console.log('  (none)');
}

console.log('\nPARTIALLY FILLED:');
if (partiallyEmptySlash.length > 0) {
  for (const item of partiallyEmptySlash) {
    console.log('  ' + item.pattern + ': has data for [' + item.hasRoots.join(', ') + '] (' + item.hasRoots.length + '/12)');
  }
} else {
  console.log('  (none)');
}

console.log('\nCOMPLETE (12/12 roots have data):');
if (completeSlash.length > 0) {
  console.log('  ' + completeSlash.join(', '));
} else {
  console.log('  (none)');
}

const totalExpected = totalExpectedBasic + totalExpectedSlash;
const totalWithFingerings = totalWithFingeringsBasic + totalWithFingeringsSlash;
const totalFingerings = totalFingeringsBasic + totalFingeringsSlash;
const emptyCount = totalExpected - totalWithFingerings;

console.log('\n=== Summary ===');
console.log('Total expected: ' + totalExpected + ' (' + basicQualities.length + ' basic + ' + slashPatterns.length + ' slash) x 12 roots');
console.log('  Basic: ' + totalExpectedBasic + ' expected, ' + totalWithFingeringsBasic + ' have fingerings, ' + (totalExpectedBasic - totalWithFingeringsBasic) + ' empty');
console.log('  Slash: ' + totalExpectedSlash + ' expected, ' + totalWithFingeringsSlash + ' have fingerings, ' + (totalExpectedSlash - totalWithFingeringsSlash) + ' empty');
console.log('Total with fingerings: ' + totalWithFingerings);
console.log('Empty arrays: ' + emptyCount);
console.log('Coverage: ' + ((totalWithFingerings / totalExpected) * 100).toFixed(1) + '%');
console.log('\n=== Fingering Count ===');
console.log('Total basic fingerings: ' + totalFingeringsBasic);
console.log('Total slash fingerings: ' + totalFingeringsSlash);
console.log('Grand total fingerings: ' + totalFingerings);
