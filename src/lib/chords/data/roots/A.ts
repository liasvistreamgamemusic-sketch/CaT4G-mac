/**
 * CaT4G - A Root Chord Data
 * Aルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * A = MIDI 9
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// Aルートの基本コード（31品質）
export const A_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // A Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'A-open',
      frets: [0, 2, 2, 2, 0, null],
      fingers: [null, 1, 2, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'A-barre-E',
      frets: [5, 5, 6, 7, 7, 5],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 5,
      barreStrings: [0, 5],
      baseFret: 5,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Am - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'Am-open',
      frets: [0, 1, 2, 2, 0, null],
      fingers: [null, 1, 2, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'Am-barre-E',
      frets: [5, 5, 5, 7, 7, 5],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 5,
      barreStrings: [0, 5],
      baseFret: 5,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // A7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = C, E, G, A#
  '7': [
    {
      id: 'A7-open',
      frets: [0, 2, 0, 2, 0, null],
      fingers: [null, 2, null, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // Am7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C, D#, G, A#
  'm7': [
    {
      id: 'Am7-open',
      frets: [0, 1, 0, 2, 0, null],
      fingers: [null, 1, null, 2, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // AM7 - Major 7
  // Intervals: [0, 4, 7, 11] = C, E, G, B
  'M7': [
    {
      id: 'AM7-open',
      frets: [0, 2, 1, 2, 0, null],
      fingers: [null, 3, 1, 2, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // Am7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = A, C, Eb, G (9, 0, 3, 7)
  'm7-5': [
    {
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      // String 3 (D=2) fret 1: 2+1=3 (Eb) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      id: 'Am7b5-open',
      frets: [null, 1, 0, 1, 0, null],
      fingers: [null, 1, null, 2, null, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      // Using strings 1-4 position
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) - need G instead
      // Better: all in one position
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      id: 'Am7b5-A',
      frets: [null, 8, 8, 10, 0, null],
      fingers: [null, 1, 1, 3, null, null],
      barreAt: 8,
      barreStrings: [1, 2],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Am-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = A, C, Eb
  'm-5': [
    {
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓
      // String 1 (B=11) fret 4: 11+4=15%12=3 (Eb) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      id: 'Am-5-open',
      frets: [8, 4, 2, null, null, null],
      fingers: [4, 2, 1, null, null, null],
      baseFret: 2,
      muted: [false, false, false, true, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // Adim - Diminished
  // Intervals: [0, 3, 6] = A, C, Eb (9, 0, 3)
  'dim': [
    {
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓
      // String 1 (B=11) fret 4: 11+4=15%12=3 (Eb) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      id: 'Adim-std',
      frets: [8, 4, 2, null, null, null],
      fingers: [4, 2, 1, null, null, null],
      baseFret: 2,
      muted: [false, false, false, true, true, true],
      difficulty: 'medium',
    },
  ],

  // Adim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = A, C, Eb, F# (9, 0, 3, 6)
  'dim7': [
    {
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      id: 'Adim7-std',
      frets: [8, 7, 8, 7, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 7,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // Aaug - Augmented
  // Intervals: [0, 4, 8] = A, C#, F (9, 1, 5)
  'aug': [
    {
      // String 0 (E=4) fret 5: 4+5=9 (A) ✓
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      id: 'Aaug-std',
      frets: [5, 6, 6, null, null, null],
      fingers: [1, 2, 3, null, null, null],
      baseFret: 5,
      muted: [false, false, false, true, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // Asus2 - Suspended 2
  // Intervals: [0, 2, 7] = C, D, G
  'sus2': [
    {
      id: 'Asus2-open',
      frets: [0, 0, 2, 2, 0, null],
      fingers: [null, null, 2, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // Asus4 - Suspended 4
  // Intervals: [0, 5, 7] = C, F, G
  'sus4': [
    {
      id: 'Asus4-open',
      frets: [0, 3, 2, 2, 0, null],
      fingers: [null, 4, 2, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // A7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = A, D, E, G (omit P5 for playability)
  '7sus4': [
    {
      // Compact voicing omitting P5 (E) for span <= 4
      // String 3 (G=7) fret 2: 7+2=9 (A) ✓ root
      // String 4 (D=2) fret 5: 2+5=7 (G) ✓ m7
      // String 5 (A=9) fret 5: 9+5=14%12=2 (D) ✓ P4
      id: 'A7sus4-A',
      frets: [null, null, 2, 5, 5, null],
      fingers: [null, null, 1, 3, 4, null],
      baseFret: 2,
      muted: [true, true, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // A6 - Major 6
  // Intervals: [0, 4, 7, 9] = C, E, G, A
  '6': [
    {
      id: 'A6-open',
      frets: [2, 2, 2, 2, 0, null],
      fingers: [1, 2, 3, 4, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Am6 - Minor 6
  // Intervals: [0, 3, 7, 9] = A, C, E, F# (9, 0, 4, 6)
  'm6': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ - too far
      // Better voicing:
      // String 0 (E=4) fret 5: 4+5=9 (A) ✓
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓
      id: 'Am6-std',
      frets: [5, 7, 5, 2, null, null],
      fingers: [1, 4, 2, 1, null, null],
      baseFret: 2,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // AmM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = C, D#, G, B
  'mM7': [
    {
      id: 'AmM7-open',
      frets: [0, 1, 1, 2, 0, null],
      fingers: [null, 1, 2, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // A9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = A, C#, E, G, B (9, 1, 4, 7, 11)
  '9': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      // String 3 (D=2) fret 0: 2+0=2 (invalid - need B=11)
      // Better voicing using fret 2 for B
      // String 0 (E=4) fret 5: 4+5=9 (A) ✓
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      id: 'A9-std',
      frets: [5, 0, 6, 5, 0, null],
      fingers: [2, null, 4, 3, null, null],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Am9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = A, C, E, G, B (9, 0, 4, 7, 11)
  'm9': [
    {
      // Open position - includes C(0) for complete chord
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓ 5th
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ m3
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ m7
      // String 3 (D=2) fret 0: 2+0=2 - wrong, need B=11 for 9th
      // Better voicing with C:
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓ 5th
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ m3
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ m7
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ 5th
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ root
      // Missing B(11) 9th - use position voicing
      // Full voicing at position:
      // String 0 (E=4) fret 5: 4+5=9 (A) ✓ root (octave)
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓ 5th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ m3
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓ m7
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ root
      // Still missing B - try different voicing
      // String 0 (E=4) fret 7: 4+7=11 (B) ✓ 9th
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓ 5th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ m3
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓ m7
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ root
      id: 'Am9-pos',
      frets: [7, 5, 5, 5, 0, null],
      fingers: [4, 1, 1, 1, null, null],
      barreAt: 5,
      barreStrings: [1, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // AM9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = A, C#, E, G#, B (9, 1, 4, 8, 11)
  'M9': [
    {
      // Position voicing - includes C#(1) for complete chord
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓ 5th
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓ 9th
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ M7
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ 5th - need C#(1) instead
      // Better: include C# for M3
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓ M3
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓ 9th
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ M7
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ 5th
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ root
      // Span 0-9 frets is hard, try compact voicing:
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ M7
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ M3
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ 9th
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ 5th
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ root
      id: 'AM9-pos',
      frets: [4, 2, 4, 2, 0, null],
      fingers: [2, 1, 3, 1, null, null],
      barreAt: 2,
      barreStrings: [1, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = A, D, E, G, B (9, 2, 4, 7, 11)
  '9sus4': [
    {
      // Open position
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓ 5th
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓ 9th
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ m7
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ sus4
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ root
      id: 'A9sus4-open',
      frets: [0, 0, 0, 0, 0, null],
      fingers: [null, null, null, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // Aadd9 - Add 9
  // Intervals: [0, 4, 7, 14] = A, C#, E, B (9, 1, 4, 11)
  'add9': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      id: 'Aadd9-open',
      frets: [0, 0, 6, 2, 0, null],
      fingers: [null, null, 4, 1, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // A69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = A, C#, E, F#, B
  '69': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ - too far
      // Better voicing:
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ - still far
      // Use position voicing:
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      id: 'A69-open',
      frets: [0, 2, 4, 4, 0, null],
      fingers: [null, 1, 3, 4, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Am69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = A, C, E, F#, B
  'm69': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      id: 'Am69-open',
      frets: [0, 1, 4, 4, 0, null],
      fingers: [null, 1, 3, 4, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // A-5 - Major flat 5
  // Intervals: [0, 4, 6] = A, C#, D#
  '-5': [
    {
      // Compact voicing using lower frets
      // String 2 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ M3
      // String 3 (G=7) fret 2: 7+2=9 (A) ✓ root
      // String 4 (D=2) fret 1: 2+1=3 (D#) ✓ b5
      // String 5 (A=9) fret 0: 9+0=9 (A) ✓ root (open)
      id: 'A-5-A',
      frets: [null, 2, 2, 1, 0, null],
      fingers: [null, 2, 3, 1, null, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // A7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = A, C#, Eb, G (9, 1, 3, 7)
  '7-5': [
    {
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ M3
      // String 2 (G=7) fret 12: 7+12=19%12=7 (G) ✓ m7
      // String 3 (D=2) fret 1: 2+1=3 (Eb) ✓ b5
      // String 4 (A=9) fret 12: 9+12=21%12=9 (A) ✓ root
      id: 'A7-5-1',
      frets: [null, 2, 12, 1, 12, null],
      fingers: [null, 2, 4, 1, 3, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // A7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = A, C#, F, G (9, 1, 5, 7)
  '7+5': [
    {
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ M3
      // String 2 (G=7) fret 12: 7+12=19%12=7 (G) ✓ m7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ #5
      // String 4 (A=9) fret 12: 9+12=21%12=9 (A) ✓ root
      id: 'A7+5-1',
      frets: [null, 2, 12, 3, 12, null],
      fingers: [null, 1, 3, 2, 4, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // AM7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = A, C#, Eb, G# (9, 1, 3, 8)
  'M7-5': [
    {
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ M3
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ M7
      // String 3 (D=2) fret 1: 2+1=3 (Eb) ✓ b5
      // String 4 (A=9) fret 12: 9+12=21%12=9 (A) ✓ root
      id: 'AM7-5-1',
      frets: [null, 2, 1, 1, 12, null],
      fingers: [null, 3, 1, 2, 4, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // Am7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = A, C, E#, G (9, 0, 5, 7)
  'm7+5': [
    {
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      // String 3 (D=2) fret 3: 2+3=5 (F=E#) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      id: 'Am7+5-1',
      frets: [null, 1, 0, 3, 0, null],
      fingers: [null, 1, null, 3, null, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // A7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = A, C#, E, G, B# (9, 1, 4, 7, 0)
  '7+9': [
    {
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C=B#) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      // String 3 (D=2) fret 11: 2+11=13%12=1 (C#) - too far from 0
      // Use higher position:
      // String 1 (B=11) fret 13: 11+13=24%12=0 (B#) ✓
      // String 2 (G=7) fret 12: 7+12=19%12=7 (G) ✓
      // String 3 (D=2) fret 11: 2+11=13%12=1 (C#) ✓
      // String 4 (A=9) fret 12: 9+12=21%12=9 (A) ✓
      id: 'A7+9-1',
      frets: [null, 13, 12, 11, 12, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 11,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // A4.4 - Quartal chord (A-D-G)
  // Intervals: [0, 5, 10] = A, D, G (9, 2, 7)
  '4.4': [
    {
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      id: 'A4.4-1',
      frets: [null, 3, 0, 0, 0, null],
      fingers: [null, 4, null, null, null, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // Ablk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = A, B, Eb, G (9, 11, 3, 7)
  'blk': [
    {
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      // String 3 (D=2) fret 1: 2+1=3 (Eb) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      id: 'Ablk-open',
      frets: [null, 0, 0, 1, 0, null],
      fingers: [null, null, null, 1, null, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

};

// Aルートの分数コード（10パターン）
// A = MIDI 9, Major triad = [9, 1, 4] = A, C#, E
// Minor triad = [9, 0, 4] = A, C, E
// Minor7 = [9, 0, 4, 7] = A, C, E, G
export const A_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // A/B - A major with B bass (interval 2)
  // A=9, C#=1, E=4, Bass B=11
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓ (BASS)
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for E(4): fret = (4-4+12)%12 = 0 ✓
  'major/2': [
    {
      id: 'A-major-2-1',
      frets: [0, 2, 2, 2, 2, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // A/C# - A major with C# bass (interval 4 = M3rd)
  // A=9, C#=1, E=4, Bass C#=1 (already in chord)
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓ (BASS)
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for E(4): fret = 0 ✓
  'major/4': [
    {
      id: 'A-major-4-1',
      frets: [0, 2, 2, 2, 4, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A/D - A major with D bass (interval 5 = P4th)
  // A=9, C#=1, E=4, Bass D=2 (not in chord)
  // String 4 (D=2): for D(2): fret = 0 ✓ (BASS open)
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for E(4): fret = 0 ✓
  'major/5': [
    {
      id: 'A-major-5-1',
      frets: [0, 2, 2, 0, null, null],
      fingers: [null, 1, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // A/E - A major with E bass (interval 7)
  // A=9, C#=1, E=4, Bass=E(4)
  // String 6 (E=4) open: E(4) ✓ Bass
  // String 5 (A=9) open: A(9) ✓
  // String 4 (D=2) fret 2: 2+2=4 (E) ✓
  // String 3 (G=7) fret 2: 7+2=9 (A) ✓
  // String 2 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
  // String 1 (E=4) open: E(4) ✓
  'major/5th': [
    {
      id: 'A-major-5th-1',
      frets: [0, 2, 2, 2, 0, 0],
      fingers: [null, 3, 2, 1, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // A/G# - A major with G# bass (interval 11 = maj7th)
  // A=9, C#=1, E=4, Bass G#=8
  // String 6 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓ (BASS)
  // String 5 (A=9): for A(9): fret = 0 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for E(4): fret = 0 ✓
  'major/7': [
    {
      id: 'A-major-7-1',
      frets: [0, 2, 2, 2, 0, 4],
      fingers: [null, 1, 2, 3, null, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // A/F# - A major with F# bass (interval 9 = 6th)
  // A=9, C#=1, E=4, Bass F#=6
  // String 6 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓ (BASS)
  // String 5 (A=9): for A(9): fret = 0 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for E(4): fret = 0 ✓
  'major/9': [
    {
      id: 'A-major-9-1',
      frets: [0, 2, 2, 2, 0, 2],
      fingers: [null, 2, 3, 4, null, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // A/G - A major with G bass (interval 10 = min7th)
  // A=9, C#=1, E=4, Bass G=7
  // String 6 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓ (BASS)
  // String 5 (A=9): for A(9): fret = 0 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for E(4): fret = 0 ✓
  'major/10': [
    {
      id: 'A-major-10-1',
      frets: [0, 2, 2, 2, 0, 3],
      fingers: [null, 1, 2, 3, null, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // マイナー分数 (2種)
  // Am/C - Am with C bass (interval 3 = min3rd)
  // Am = [9, 0, 4] = A, C, E, Bass C=0
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓ (BASS)
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for E(4): fret = 0 ✓
  'minor/3': [
    {
      id: 'A-minor-3-1',
      frets: [0, 1, 2, 2, 3, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Am/E - Am with E bass (interval 7 = 5th)
  // Am = [9, 0, 4] = A, C, E, Bass E=4
  // String 6 (E=4): for E(4): fret = 0 ✓ (BASS open)
  // String 5 (A=9): for A(9): fret = 0 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for E(4): fret = 0 ✓
  'minor/7': [
    {
      id: 'A-minor-7-1',
      frets: [0, 1, 2, 2, 0, 0],
      fingers: [null, 1, 2, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // マイナー7分数 (2種)
  // Am7/E - Am7 with E bass (interval 7 = 5th)
  // Am7 = [9, 0, 4, 7] = A, C, E, G, Bass E=4
  // String 6 (E=4): for E(4): fret = 0 ✓ (BASS open)
  // String 5 (A=9): for A(9): fret = 0 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for G(7): fret = 0 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for E(4): fret = 0 ✓
  'minor7/5': [
    {
      id: 'A-minor7-5-1',
      frets: [0, 1, 0, 2, 0, 0],
      fingers: [null, 1, null, 2, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Am7/G - Am7 with G bass (interval 10 = min7th)
  // Am7 = [9, 0, 4, 7] = A, C, E, G, Bass G=7
  // String 6 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓ (BASS)
  // String 5 (A=9): for A(9): fret = 0 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for G(7): fret = 0 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for E(4): fret = 0 ✓
  'minor7/10': [
    {
      id: 'A-minor7-10-1',
      frets: [0, 1, 0, 2, 0, 3],
      fingers: [null, 1, null, 2, null, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

};
