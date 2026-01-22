/**
 * Chord Fingering Issue Detection Script
 *
 * Detects:
 * 1. More than 4 fingers used (fingers array has 5+ values of 1,2,3,4)
 * 2. Fret range exceeds 4 frets (frets outside baseFret range)
 * 3. Invalid finger values (anything other than 1-4 and null)
 */

import * as fs from 'fs';
import * as path from 'path';

interface ChordIssue {
  file: string;
  chordId: string;
  issueType: 'too_many_fingers' | 'fret_range_exceeded' | 'invalid_finger_value';
  details: string;
  frets?: (number | null)[];
  fingers?: (number | null)[];
  baseFret?: number;
}

interface FingeringData {
  id?: string;
  frets: (number | null)[];
  fingers: (number | null)[];
  baseFret: number;
}

function extractFingeringsFromFile(filePath: string): { fileName: string; fingerings: FingeringData[] } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const fingerings: FingeringData[] = [];

  // Match fingering objects - look for patterns like:
  // { id: '...', frets: [...], fingers: [...], baseFret: N, ... }
  const fingeringRegex = /\{\s*(?:id:\s*['"`]([^'"`]+)['"`],?\s*)?[^{}]*?frets:\s*\[([^\]]+)\][^{}]*?fingers:\s*\[([^\]]+)\][^{}]*?baseFret:\s*(\d+)/gs;

  let match;
  while ((match = fingeringRegex.exec(content)) !== null) {
    const id = match[1] || 'unknown';
    const fretsStr = match[2];
    const fingersStr = match[3];
    const baseFret = parseInt(match[4], 10);

    // Parse frets array
    const frets = fretsStr.split(',').map(s => {
      const trimmed = s.trim();
      if (trimmed === 'null' || trimmed === '') return null;
      const num = parseInt(trimmed, 10);
      return isNaN(num) ? null : num;
    });

    // Parse fingers array
    const fingers = fingersStr.split(',').map(s => {
      const trimmed = s.trim();
      if (trimmed === 'null' || trimmed === '') return null;
      const num = parseInt(trimmed, 10);
      return isNaN(num) ? null : num;
    });

    fingerings.push({ id, frets, fingers, baseFret });
  }

  return { fileName, fingerings };
}

function detectIssues(fileName: string, fingering: FingeringData): ChordIssue[] {
  const issues: ChordIssue[] = [];
  const { id, frets, fingers, baseFret } = fingering;

  // Issue 1: Too many fingers (more than 4 unique finger values 1-4)
  const uniqueFingers = new Set(fingers.filter(f => f !== null && f >= 1 && f <= 4));
  const fingerCount = fingers.filter(f => f !== null && f >= 1 && f <= 4).length;

  if (fingerCount > 4) {
    issues.push({
      file: fileName,
      chordId: id || 'unknown',
      issueType: 'too_many_fingers',
      details: `${fingerCount} finger positions used (fingers: [${fingers.join(', ')}])`,
      frets,
      fingers,
      baseFret
    });
  }

  // Issue 2: Fret range exceeds 4 frets
  const pressedFrets = frets.filter(f => f !== null && f > 0) as number[];
  if (pressedFrets.length > 0) {
    const minFret = Math.min(...pressedFrets);
    const maxFret = Math.max(...pressedFrets);

    // Check if any fret is outside baseFret to baseFret+3 range (4 frets total)
    const outsideRange = pressedFrets.filter(f => f < baseFret || f > baseFret + 3);

    if (outsideRange.length > 0 || (maxFret - minFret >= 4)) {
      issues.push({
        file: fileName,
        chordId: id || 'unknown',
        issueType: 'fret_range_exceeded',
        details: `Frets span ${maxFret - minFret + 1} frets (min: ${minFret}, max: ${maxFret}, baseFret: ${baseFret}). Frets outside range: [${outsideRange.join(', ')}]`,
        frets,
        fingers,
        baseFret
      });
    }
  }

  // Issue 3: Invalid finger values (not 1-4 or null)
  const invalidFingers = fingers.filter(f => f !== null && (f < 1 || f > 4));
  if (invalidFingers.length > 0) {
    issues.push({
      file: fileName,
      chordId: id || 'unknown',
      issueType: 'invalid_finger_value',
      details: `Invalid finger values: [${invalidFingers.join(', ')}] (valid: 1-4 or null)`,
      frets,
      fingers,
      baseFret
    });
  }

  return issues;
}

function main() {
  const targetFiles = [
    '/Users/nitandatomoya/repository/claude-solo/cat4g/src/lib/chords/standardChords.ts',
    '/Users/nitandatomoya/repository/claude-solo/cat4g/src/lib/chords/extendedChords.ts',
    '/Users/nitandatomoya/repository/claude-solo/cat4g/src/lib/chords/cagedChords.ts',
    '/Users/nitandatomoya/repository/claude-solo/cat4g/src/lib/chords/database.ts',
  ];

  const allIssues: ChordIssue[] = [];
  let totalFingerings = 0;

  for (const filePath of targetFiles) {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }

    const { fileName, fingerings } = extractFingeringsFromFile(filePath);
    totalFingerings += fingerings.length;

    console.log(`\n=== ${fileName} ===`);
    console.log(`Found ${fingerings.length} fingerings`);

    for (const fingering of fingerings) {
      const issues = detectIssues(fileName, fingering);
      allIssues.push(...issues);
    }
  }

  // Output results
  console.log('\n========================================');
  console.log('DETECTION RESULTS');
  console.log('========================================\n');
  console.log(`Total fingerings analyzed: ${totalFingerings}`);
  console.log(`Total issues found: ${allIssues.length}\n`);

  // Group by issue type
  const byType: Record<string, ChordIssue[]> = {
    'too_many_fingers': [],
    'fret_range_exceeded': [],
    'invalid_finger_value': [],
  };

  for (const issue of allIssues) {
    byType[issue.issueType].push(issue);
  }

  // Output by type
  console.log('--- Issue Type 1: Too Many Fingers (5+ finger positions) ---\n');
  if (byType['too_many_fingers'].length === 0) {
    console.log('No issues found.\n');
  } else {
    for (const issue of byType['too_many_fingers']) {
      console.log(`[${issue.file}] ${issue.chordId}`);
      console.log(`  ${issue.details}`);
      console.log(`  frets: [${issue.frets?.join(', ')}]`);
      console.log(`  baseFret: ${issue.baseFret}\n`);
    }
  }

  console.log('--- Issue Type 2: Fret Range Exceeded (4+ frets span) ---\n');
  if (byType['fret_range_exceeded'].length === 0) {
    console.log('No issues found.\n');
  } else {
    for (const issue of byType['fret_range_exceeded']) {
      console.log(`[${issue.file}] ${issue.chordId}`);
      console.log(`  ${issue.details}`);
      console.log(`  frets: [${issue.frets?.join(', ')}]`);
      console.log(`  baseFret: ${issue.baseFret}\n`);
    }
  }

  console.log('--- Issue Type 3: Invalid Finger Values ---\n');
  if (byType['invalid_finger_value'].length === 0) {
    console.log('No issues found.\n');
  } else {
    for (const issue of byType['invalid_finger_value']) {
      console.log(`[${issue.file}] ${issue.chordId}`);
      console.log(`  ${issue.details}`);
      console.log(`  fingers: [${issue.fingers?.join(', ')}]\n`);
    }
  }

  console.log('========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log(`Too Many Fingers: ${byType['too_many_fingers'].length}`);
  console.log(`Fret Range Exceeded: ${byType['fret_range_exceeded'].length}`);
  console.log(`Invalid Finger Values: ${byType['invalid_finger_value'].length}`);
  console.log(`Total Issues: ${allIssues.length}`);
}

main();
