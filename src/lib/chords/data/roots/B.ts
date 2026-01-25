/**
 * CaT4G - B Root Chord Data
 * Bルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * B = MIDI 11
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// Bルートの基本コード（31品質）
export const B_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // B Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'B-barre-A',
      frets: [2, 4, 4, 4, 2, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'B-barre-E',
      frets: [7, 7, 8, 9, 9, 7],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 7,
      barreStrings: [0, 5],
      baseFret: 7,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Bm - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'Bm-barre-A',
      frets: [2, 3, 4, 4, 2, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bm-barre-E',
      frets: [7, 7, 7, 9, 9, 7],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 7,
      barreStrings: [0, 5],
      baseFret: 7,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // B7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = C, E, G, A#
  '7': [
    {
      id: 'B7-open',
      frets: [2, 0, 2, 1, 2, null],
      fingers: [2, null, 4, 1, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Bm7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C, D#, G, A#
  'm7': [
    {
      id: 'Bm7-barre',
      frets: [2, 3, 2, 4, 2, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // BM7 - Major 7
  // Intervals: [0, 4, 7, 11] = C, E, G, B
  'M7': [
    {
      id: 'BM7-barre',
      frets: [2, 4, 3, 4, 2, null],
      fingers: [1, 3, 2, 4, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // Bm7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = B, D, F, A (11, 2, 5, 9)
  'm7-5': [
    {
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓
      id: 'Bm7b5-A',
      frets: [null, 3, 2, 3, 2, null],
      fingers: [null, 2, 1, 3, 1, null],
      barreAt: 2,
      barreStrings: [2, 4],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Bm-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = B, D, F
  'm-5': [
    {
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓
      id: 'Bm-5-A',
      frets: [null, 3, 4, 3, 2, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // Bdim - Diminished
  // Intervals: [0, 3, 6] = B, D, F (11, 2, 5)
  'dim': [
    {
      // String 0 (E=4) fret 10: 4+10=14%12=2 (D) ✓
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      id: 'Bdim-std',
      frets: [10, 6, 4, null, null, null],
      fingers: [4, 2, 1, null, null, null],
      baseFret: 4,
      muted: [false, false, false, true, true, true],
      difficulty: 'medium',
    },
  ],

  // Bdim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = B, D, F, G# (11, 2, 5, 8)
  'dim7': [
    {
      // String 0 (E=4) fret 10: 4+10=14%12=2 (D) ✓
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      id: 'Bdim7-std',
      frets: [10, 9, 10, 9, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 9,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // Baug - Augmented
  // Intervals: [0, 4, 8] = B, D#, G (11, 3, 7)
  'aug': [
    {
      // String 0 (E=4) fret 11: 4+11=15%12=3 (D#) ✓
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      id: 'Baug-std',
      frets: [11, 8, 4, null, null, null],
      fingers: [4, 2, 1, null, null, null],
      baseFret: 4,
      muted: [false, false, false, true, true, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // Bsus2 - Suspended 2
  // Intervals: [0, 2, 7] = B, C#, F# (11, 1, 6)
  'sus2': [
    {
      // String 0 (E=4) fret 7: 4+7=11 (B) ✓ root
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ 5th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ 2nd
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓ root
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ 5th
      // String 5 (E=4) fret 7: 4+7=11 (B) ✓ root
      id: 'Bsus2-barre',
      frets: [7, 7, 6, 9, 9, 7],
      fingers: [1, 1, 1, 3, 4, 1],
      barreAt: 7,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      // Simpler A-shape voicing
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ 5th
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ 2nd
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ root
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ 5th
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'Bsus2-A',
      frets: [2, 2, 4, 4, 2, null],
      fingers: [1, 1, 3, 4, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Bsus4 - Suspended 4
  // Intervals: [0, 5, 7] = C, F, G
  'sus4': [
    {
      id: 'Bsus4-barre',
      frets: [2, 5, 4, 4, 2, null],
      fingers: [1, 4, 3, 2, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // B7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = B, E, F#, A (omit P5 for playability)
  '7sus4': [
    {
      // Compact voicing omitting P5 (F#) for span <= 4
      // String 3 (G=7) fret 4: 7+4=11 (B) ✓ root
      // String 4 (D=2) fret 2: 2+2=4 (E) ✓ P4
      // String 5 (A=9) fret 0: 9+0=9 (A) ✓ m7 (open)
      id: 'B7sus4-A',
      frets: [null, null, 4, 2, 0, null],
      fingers: [null, null, 3, 2, null, null],
      baseFret: 1,
      muted: [true, true, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // B6 - Major 6
  // Intervals: [0, 4, 7, 9] = B, D#, F#, G# (11, 3, 6, 8)
  '6': [
    {
      // String 0 (E=4) fret 7: 4+7=11 (B) ✓ root
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓ 6th
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ M3
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓ root
      // String 5 (E=4) fret 7: 4+7=11 (B) ✓ root
      id: 'B6-barre',
      frets: [7, 9, 8, 9, null, 7],
      fingers: [1, 3, 2, 4, null, 1],
      barreAt: 7,
      barreStrings: [0, 5],
      baseFret: 7,
      muted: [false, false, false, false, true, false],
      difficulty: 'hard',
    },
    {
      // A-shape voicing
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ M3
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ 6th
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ 5th
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'B6-A',
      frets: [null, 4, 1, 4, 2, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Bm6 - Minor 6
  // Intervals: [0, 3, 7, 9] = B, D, F#, G# (11, 2, 6, 8)
  'm6': [
    {
      // String 0 (E=4) fret 10: 4+10=14%12=2 (D) ✓
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      id: 'Bm6-std',
      frets: [10, 9, 11, 9, null, null],
      fingers: [2, 1, 4, 1, null, null],
      baseFret: 9,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // BmM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = C, D#, G, B
  'mM7': [
    {
      id: 'BmM7-barre',
      frets: [2, 3, 3, 4, 2, null],
      fingers: [1, 2, 2, 3, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // B9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = B, D#, F#, A, C# (11, 3, 6, 9, 1)
  '9': [
    {
      // String 0 (E=4) fret 7: 4+7=11 (B) ✓ root
      // String 1 (B=11) fret 9: 11+9=20%12=8 → wrong, need C#(1)
      // Better voicing:
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓ 9th
      // String 1 (B=11) fret 9: 11+9=20%12=8 → still wrong
      // Use partial voicing:
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ 9th
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ m7
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓ M3
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'B9-open',
      frets: [null, 2, 2, 1, 2, null],
      fingers: [null, 2, 3, 1, 4, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      // Higher position voicing
      // String 0 (E=4) fret 11: 4+11=15%12=3 (D#) ✓ M3
      // String 1 (B=11) fret 14: 11+14=25%12=1 (C#) ✓ 9th
      // String 2 (G=7) fret 14: 7+14=21%12=9 (A) ✓ m7
      // String 3 (D=2) fret 13: 2+13=15%12=3 (D#) ✓ M3
      // String 4 (A=9) fret 14: 9+14=23%12=11 (B) ✓ root
      id: 'B9-A',
      frets: [11, 14, 14, 13, 14, null],
      fingers: [1, 3, 4, 2, 3, null],
      baseFret: 11,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // Bm9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = B, D, F#, A, C# (11, 2, 6, 9, 1)
  'm9': [
    {
      // Full voicing with C#(1) for 9th
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓ 9th
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ m3
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ m7
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ 5th
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'Bm9-A',
      frets: [9, 3, 2, 4, 2, null],
      fingers: [4, 2, 1, 3, 1, null],
      barreAt: 2,
      barreStrings: [2, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // BM9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = B, D#, F#, A#, C# (11, 3, 6, 10, 1)
  'M9': [
    {
      // Full voicing with C#(1) for 9th
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓ 9th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ M3
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ M7
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ 5th
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'BM9-A',
      frets: [9, 4, 3, 4, 2, null],
      fingers: [4, 2, 1, 3, 1, null],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // B9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = B, E, F#, A, C# (11, 4, 6, 9, 1)
  '9sus4': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓
      id: 'B9sus4-A',
      frets: [0, 2, 2, 4, 2, null],
      fingers: [null, 1, 1, 3, 1, null],
      barreAt: 2,
      barreStrings: [1, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Badd9 - Add 9
  // Intervals: [0, 4, 7, 14] = B, D#, F#, C# (11, 3, 6, 1)
  'add9': [
    {
      // add9 requires: B(11), D#(3), F#(6), C#(1)
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓ 9th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ M3
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ root
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ 5th
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'Badd9-A',
      frets: [9, 4, 4, 4, 2, null],
      fingers: [4, 2, 2, 3, 1, null],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      // With D# note included and proper 9th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ M3
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ 9th
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ 5th
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'Badd9-alt',
      frets: [null, 4, 6, 4, 2, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // B69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = B, D#, F#, G#, C#
  '69': [
    {
      // String 0 (E=4) fret 11: 4+11=15%12=3 (D#) ✓
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓
      id: 'B69-open',
      frets: [null, 2, 1, 1, 2, null],
      fingers: [null, 2, 1, 1, 3, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // Bm69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = B, D, F#, G#, C# (11, 2, 6, 8, 1)
  'm69': [
    {
      // Full voicing with C#(1) for 9th
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓ 9th
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ m3
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ 6th
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ 5th
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'Bm69-A',
      frets: [9, 3, 1, 4, 2, null],
      fingers: [4, 2, 1, 3, 1, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // B-5 - Major flat 5
  // Intervals: [0, 4, 6] = B, D#, F
  '-5': [
    {
      // String 2 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ M3
      // String 3 (G=7) fret 4: 7+4=11 (B) ✓ root
      // String 4 (D=2) fret 3: 2+3=5 (F) ✓ b5
      // String 5 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'B-5-A',
      frets: [null, 4, 4, 3, 2, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // B7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = B, D#, F, A (11, 3, 5, 9)
  '7-5': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ M3
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ m7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ b5
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'B7-5-1',
      frets: [null, 4, 2, 3, 2, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // B7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = B, D#, G, A (11, 3, 7, 9)
  '7+5': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ M3
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ m7
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓ #5
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'B7+5-1',
      frets: [null, 4, 2, 5, 2, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // BM7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = B, D#, F, A# (11, 3, 5, 10)
  'M7-5': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ M3
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ M7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ b5
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ root
      id: 'BM7-5-1',
      frets: [null, 4, 3, 3, 2, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Bm7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = B, D, G, A (11, 2, 7, 9)
  'm7+5': [
    {
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓
      id: 'Bm7+5-1',
      frets: [null, 3, 2, 5, 2, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 2,
      barreStrings: [2, 4],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // B7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = B, D#, F#, A, C## (11, 3, 6, 9, 2)
  '7+9': [
    {
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D=C##) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓
      id: 'B7+9-1',
      frets: [null, 3, 2, 1, 2, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // B4.4 - Quartal chord (B-E-A)
  // Intervals: [0, 5, 10] = B, E, A (11, 4, 9)
  '4.4': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓
      id: 'B4.4-1',
      frets: [null, 5, 2, 2, 2, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 2,
      barreStrings: [2, 4],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Bblk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = B, C#, F, A (11, 1, 5, 9)
  'blk': [
    {
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓
      id: 'Bblk-A',
      frets: [null, 2, 2, 3, 2, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 2,
      barreStrings: [1, 4],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

};

// Bルートの分数コード（10パターン）
// B = MIDI 11, Major triad = [11, 3, 6] = B, D#, F#
// Minor triad = [11, 2, 6] = B, D, F#
// Minor7 = [11, 2, 6, 9] = B, D, F#, A
export const B_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // B/C# - B major with C# bass (interval 2)
  // B=11, D#=3, F#=6, Bass C#=1
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓ (BASS)
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/2': [
    {
      id: 'B-major-2-1',
      frets: [2, 4, 4, 4, 4, null],
      fingers: [1, 3, 3, 3, 3, null],
      barreAt: 4,
      barreStrings: [1, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // B/D# - B major with D# bass (interval 4 = M3rd)
  // B=11, D#=3, F#=6, Bass D#=3 (already in chord)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 ✓ (BASS)
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/4': [
    {
      id: 'B-major-4-1',
      frets: [2, 4, 4, 4, 6, null],
      fingers: [1, 2, 3, 4, 4, null],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // B/E - B major with E bass (interval 5 = P4th)
  // B=11, D#=3, F#=6, Bass E=4 (not in chord)
  // String 6 (E=4): for E(4): fret = 0 ✓ (BASS open)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/5': [
    {
      id: 'B-major-5-1',
      frets: [2, 4, 4, 4, 2, 0],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // B/F# - B major with F# bass (interval 7)
  // B=11, D#=3, F#=6, Bass=F#(6)
  // String 6 (E=4) fret 2: 4+2=6 (F#) ✓ Bass
  // String 5 (A=9) fret 2: 9+2=11 (B) ✓
  // String 4 (D=2) fret 4: 2+4=6 (F#) ✓
  // String 3 (G=7) fret 4: 7+4=11 (B) ✓
  // String 2 (B=11) fret 4: 11+4=15%12=3 (D#) ✓
  // String 1 (E=4) fret 2: 4+2=6 (F#) ✓
  'major/5th': [
    {
      id: 'B-major-5th-1',
      frets: [2, 4, 4, 4, 2, 2],
      fingers: [1, 4, 3, 2, 1, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // B/A# - B major with A# bass (interval 11 = maj7th)
  // B=11, D#=3, F#=6, Bass A#=10
  // String 5 (A=9): for A#(10): fret = (10-9+12)%12 = 1 ✓ (BASS)
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/7': [
    {
      id: 'B-major-7-1',
      frets: [2, 4, 4, 4, 1, null],
      fingers: [1, 3, 3, 3, 1, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // B/G# - B major with G# bass (interval 9 = 6th)
  // B=11, D#=3, F#=6, Bass G#=8
  // String 6 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓ (BASS)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/9': [
    {
      id: 'B-major-9-1',
      frets: [2, 4, 4, 4, 2, 4],
      fingers: [1, 3, 3, 3, 1, 4],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // B/A - B major with A bass (interval 10 = min7th)
  // B=11, D#=3, F#=6, Bass A=9
  // String 5 (A=9): for A(9): fret = 0 ✓ (BASS open)
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/10': [
    {
      id: 'B-major-10-1',
      frets: [2, 4, 4, 4, 0, null],
      fingers: [1, 3, 3, 3, null, null],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // マイナー分数 (2種)
  // Bm/D - Bm with D bass (interval 3 = min3rd)
  // Bm = [11, 2, 6] = B, D, F#, Bass D=2
  // String 4 (D=2): for D(2): fret = 0 ✓ (BASS open)
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'minor/3': [
    {
      id: 'B-minor-3-1',
      frets: [2, 3, 4, 0, null, null],
      fingers: [1, 2, 4, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // Bm/F# - Bm with F# bass (interval 7 = 5th)
  // Bm = [11, 2, 6] = B, D, F#, Bass F#=6
  // String 6 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓ (BASS)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'minor/7': [
    {
      id: 'B-minor-7-1',
      frets: [2, 3, 4, 4, 2, 2],
      fingers: [1, 2, 4, 3, 1, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // マイナー7分数 (2種)
  // Bm7/F# - Bm7 with F# bass (interval 7 = 5th)
  // Bm7 = [11, 2, 6, 9] = B, D, F#, A, Bass F#=6
  // String 6 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓ (BASS)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'minor7/5': [
    {
      id: 'B-minor7-5-1',
      frets: [2, 3, 2, 4, 2, 2],
      fingers: [1, 3, 1, 4, 1, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Bm7/A - Bm7 with A bass (interval 10 = min7th)
  // Bm7 = B(11), D(2), F#(6), A(9), Bass A=9
  // String 5 (A=9): for A(9): fret = 0 ✓ (BASS open)
  // String 4 (D=2): for D(2): fret = 0 ✓ open
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓ root
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓ m3
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓ 5th
  'minor7/10': [
    {
      id: 'B-minor7-10-1',
      frets: [2, 3, 4, 0, 0, null],
      fingers: [1, 2, 3, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

};
