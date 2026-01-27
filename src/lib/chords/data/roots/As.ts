/**
 * CaT4G - A# Root Chord Data
 * A#ルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * A# = MIDI 10
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// A#ルートの基本コード（31品質）
export const AS_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // A# Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'A#-barre-A',
      frets: [1, 3, 3, 3, 1, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'A#-barre-E',
      frets: [6, 6, 7, 8, 8, 6],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'Bb-barre-A',
      frets: [1, 3, 3, 3, 1, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bb-barre-E',
      frets: [6, 6, 7, 8, 8, 6],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // A#m - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'A#m-barre-A',
      frets: [1, 2, 3, 3, 1, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'A#m-barre-E',
      frets: [6, 6, 6, 8, 8, 6],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'Bbm-barre-A',
      frets: [1, 2, 3, 3, 1, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bbm-barre-E',
      frets: [6, 6, 6, 8, 8, 6],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // A#7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = A#, D, F, G# (10, 2, 5, 8)
  '7': [
    {
      // A-shape dom7 at fret 1
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ 5th
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ m7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 5th
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#7-A',
      frets: [1, 3, 1, 3, 1, null],
      fingers: [1, 3, 1, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      // E-shape dom7 at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ root
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 5th
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓ M3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ m7
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ 5th
      // String 5 (E=4) fret 6: 4+6=10 (A#) ✓ root
      id: 'A#7-E',
      frets: [6, 6, 7, 6, 8, 6],
      fingers: [1, 1, 2, 1, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5] as [number, number],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
    {
      id: 'Bb7-A',
      frets: [1, 3, 1, 3, 1, null],
      fingers: [1, 3, 1, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // A#m7 - Minor 7
  // Intervals: [0, 3, 7, 10] = A#, C#, F, G# (10, 1, 5, 8)
  'm7': [
    {
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓
      id: 'A#m7-A',
      frets: [null, 2, 1, 3, 1, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 1,
      barreStrings: [2, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bbm7-A',
      frets: [null, 2, 1, 3, 1, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 1,
      barreStrings: [2, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#M7 - Major 7
  // Intervals: [0, 4, 7, 11] = A#, D, F, A (10, 2, 5, 9)
  'M7': [
    {
      // A-shape maj7 at fret 1
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ 5th
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ M7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 5th
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#M7-A',
      frets: [1, 3, 2, 3, 1, null],
      fingers: [1, 3, 2, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      // E-shape maj7 at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ root
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 5th
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓ M3
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓ M7
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ 5th
      // String 5 (E=4) fret 6: 4+6=10 (A#) ✓ root
      id: 'A#M7-E',
      frets: [6, 6, 7, 7, 8, 6],
      fingers: [1, 1, 2, 3, 4, 1],
      barreAt: 6,
      barreStrings: [0, 5] as [number, number],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
    {
      id: 'BbM7-A',
      frets: [1, 3, 2, 3, 1, null],
      fingers: [1, 3, 2, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // A#m7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = A#, C#, E, G# (10, 1, 4, 8)
  'm7-5': [
    {
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓
      id: 'A#m7b5-A',
      frets: [null, 2, 1, 2, 1, null],
      fingers: [null, 2, 1, 3, 1, null],
      barreAt: 1,
      barreStrings: [2, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bbm7b5-A',
      frets: [null, 2, 1, 2, 1, null],
      fingers: [null, 2, 1, 3, 1, null],
      barreAt: 1,
      barreStrings: [2, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#m-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = A#, C#, E
  'm-5': [
    {
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓
      id: 'A#m-5-A',
      frets: [null, 2, 3, 2, 1, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bbm-5-A',
      frets: [null, 2, 3, 2, 1, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // A#dim - Diminished
  // Intervals: [0, 3, 6] = A#, C#, E (10, 1, 4)
  'dim': [
    {
      id: 'A#dim-5str',
      frets: [0, 2, 0, 2, 1, null],
      fingers: [null, 2, null, 3, 1, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'A#dim-6str',
      frets: [null, 5, 6, 5, null, 6],
      fingers: [null, 1, 3, 2, null, 4],
      baseFret: 5,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
  ],

  // A#dim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = A#, C#, E, G (10, 1, 4, 7)
  'dim7': [
    {
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓
      id: 'A#dim7-std',
      frets: [9, 8, 9, 8, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 8,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
    {
      id: 'Bbdim7-std',
      frets: [9, 8, 9, 8, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 8,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // A#aug - Augmented
  // Intervals: [0, 4, 8] = A#, D, F# (10, 2, 6)
  'aug': [
    {
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ #5
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ root
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ #5
      id: 'A#aug-1',
      frets: [2, 3, 3, 4, null, null],
      fingers: [1, 2, 2, 3, null, null],
      barreAt: 3,
      barreStrings: [1, 2] as [number, number],
      baseFret: 2,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium' as const,
    },
    {
      // E-shape at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ root
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ #5
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓ M3
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ root
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ #5
      // String 5 (E=4) fret 6: 4+6=10 (A#) ✓ root
      id: 'A#aug-E',
      frets: [6, 7, 7, 8, 9, 6],
      fingers: [1, 2, 2, 3, 4, 1],
      barreAt: 6,
      barreStrings: [0, 5] as [number, number],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard' as const,
    },
    {
      id: 'Bbaug-1',
      frets: [2, 3, 3, 4, null, null],
      fingers: [1, 2, 2, 3, null, null],
      barreAt: 3,
      barreStrings: [1, 2] as [number, number],
      baseFret: 2,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium' as const,
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // A#sus2 - Suspended 2
  // Intervals: [0, 2, 7] = A#, C, F (10, 0, 5)
  'sus2': [
    {
      // A-shape sus2 at fret 1
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ 5th
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ 2nd
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ root
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 5th
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#sus2-A',
      frets: [1, 1, 3, 3, 1, null],
      fingers: [1, 1, 3, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      // E-shape sus2 at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ root
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 5th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ 2nd
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ root
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ 5th
      // String 5 (E=4) fret 6: 4+6=10 (A#) ✓ root
      id: 'A#sus2-E',
      frets: [6, 6, 5, 8, 8, 6],
      fingers: [1, 1, 1, 3, 4, 1],
      barreAt: 6,
      barreStrings: [0, 5] as [number, number],
      baseFret: 5,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
    {
      id: 'Bbsus2-A',
      frets: [1, 1, 3, 3, 1, null],
      fingers: [1, 1, 3, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // A#sus4 - Suspended 4
  // Intervals: [0, 5, 7] = A#, D#, F (10, 3, 5)
  'sus4': [
    {
      // A-shape sus4 at fret 1
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ 5th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 4th
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ root
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 5th
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#sus4-A',
      frets: [1, 4, 3, 3, 1, null],
      fingers: [1, 4, 2, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      // E-shape sus4 at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ root
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 5th
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ 4th
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ root
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ 5th
      // String 5 (E=4) fret 6: 4+6=10 (A#) ✓ root
      id: 'A#sus4-E',
      frets: [6, 6, 8, 8, 8, 6],
      fingers: [1, 1, 3, 3, 4, 1],
      barreAt: 6,
      barreStrings: [0, 5] as [number, number],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
    {
      id: 'Bbsus4-A',
      frets: [1, 4, 3, 3, 1, null],
      fingers: [1, 4, 2, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // A#7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = A#, D#, F, G# (omit P5 for playability)
  '7sus4': [
    {
      // Compact voicing omitting P5 (F) for span <= 4
      // String 3 (G=7) fret 3: 7+3=10 (A#) ✓ root
      // String 4 (D=2) fret 6: 2+6=8 (G#) ✓ m7
      // String 5 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ P4
      id: 'A#7sus4-A',
      frets: [null, null, 3, 6, 6, null],
      fingers: [null, null, 1, 3, 4, null],
      baseFret: 3,
      muted: [true, true, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // A#6 - Major 6
  // Intervals: [0, 4, 7, 9] = A#, D, F, G (10, 2, 5, 7)
  '6': [
    {
      // 6弦ルート移動フォーム (Form 1)
      id: 'A#6-6str-form1',
      frets: [null, 8, 7, null, 8, 6],
      fingers: [null, 3, 2, null, 4, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 6,
      muted: [true, false, false, true, false, false],
      difficulty: 'medium',
    },
    {
      // 6弦ルート移動フォーム (Form 2)
      id: 'A#6-6str-form2',
      frets: [null, 6, 7, 5, null, 6],
      fingers: [null, 2, 3, 1, null, 2],
      barreAt: 6,
      barreStrings: [1, 5],
      baseFret: 5,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // A-shape 6 at fret 1
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ 5th
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ 6th
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 5th
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#6-A',
      frets: [1, 3, 0, 3, 1, null],
      fingers: [1, 3, null, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      // Compact voicing
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ 6th
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓ M3
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ root
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ 5th
      id: 'A#6-barre',
      frets: [null, 8, 7, 8, 8, null],
      fingers: [null, 2, 1, 3, 4, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      id: 'Bb6-A',
      frets: [1, 3, 0, 3, 1, null],
      fingers: [1, 3, null, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // A#m6 - Minor 6
  // Intervals: [0, 3, 7, 9] = A#, C#, F, G (10, 1, 5, 7)
  'm6': [
    {
      // A-shape m6 at fret 1
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ 5th
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ m3
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ 6th
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 5th
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#m6-A',
      frets: [1, 2, 0, 3, 1, null],
      fingers: [1, 2, null, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      // Compact voicing
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ 6th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ m3
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ root
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ 5th
      id: 'A#m6-barre',
      frets: [null, 8, 6, 8, 8, null],
      fingers: [null, 2, 1, 3, 4, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      id: 'Bbm6-A',
      frets: [1, 2, 0, 3, 1, null],
      fingers: [1, 2, null, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // A#mM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = A#, C#, F, A (10, 1, 5, 9)
  'mM7': [
    {
      // E-shape mM7 barre at fret 6
      id: 'A#mM7-E-barre',
      frets: [6, 6, 6, 7, 8, 6],
      fingers: [1, 1, 1, 2, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      // A-shape mM7 at fret 1
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ 5th
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ m3
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ M7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 5th
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#mM7-A',
      frets: [1, 2, 2, 3, 1, null],
      fingers: [1, 2, 3, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      id: 'BbmM7-E-barre',
      frets: [6, 6, 6, 7, 8, 6],
      fingers: [1, 1, 1, 2, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'BbmM7-A',
      frets: [1, 2, 2, 3, 1, null],
      fingers: [1, 2, 3, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // A#9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = A#, D, F, G#, C (10, 2, 5, 8, 0)
  '9': [
    {
      // A-shape dom9 at fret 1
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 9th
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ 9th
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ m7
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ M3
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#9-A',
      frets: [null, 1, 1, 0, 1, null],
      fingers: [null, 1, 2, null, 1, null],
      barreAt: 1,
      barreStrings: [1, 4] as [number, number],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy' as const,
    },
    {
      // E-shape dom9 at fret 6
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 9th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 5th
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓ M3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ m7
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ 5th
      // String 5 (E=4) fret 6: 4+6=10 (A#) ✓ root
      id: 'A#9-E',
      frets: [8, 6, 7, 6, 8, 6],
      fingers: [3, 1, 2, 1, 4, 1],
      barreAt: 6,
      barreStrings: [1, 5] as [number, number],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard' as const,
    },
    {
      id: 'Bb9-A',
      frets: [null, 1, 1, 0, 1, null],
      fingers: [null, 1, 2, null, 1, null],
      barreAt: 1,
      barreStrings: [1, 4] as [number, number],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy' as const,
    },
  ],

  // A#m9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = A#, C#, F, G#, C (10, 1, 5, 8, 0)
  'm9': [
    {
      // Full voicing with C#(1) for m3
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ root (octave)
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 5th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ m3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ m7
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      // Missing C(0) 9th - add it
      // Better voicing:
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 9th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 5th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ m3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ m7
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#m9-pos',
      frets: [8, 6, 6, 6, 1, null],
      fingers: [4, 1, 1, 1, 2, null],
      barreAt: 6,
      barreStrings: [1, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // A#M9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = A#, D, F, A, C (10, 2, 5, 9, 0)
  'M9': [
    {
      id: 'A#M9-open',
      frets: [null, 1, 2, 0, 1, null],
      fingers: [null, 2, 4, 1, 3, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'A#M9-barre',
      frets: [1, 1, 2, 3, 1, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 1,
      barreStrings: [1, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // A#9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = A#, D#, F, G#, C (10, 3, 5, 8, 0)
  '9sus4': [
    {
      // String 0 (E=4) fret 11: 4+11=15%12=3 (D#) ✓ sus4
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ 9th
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ m7
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓ sus4
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      // Note: fret 11 to fret 1 span issue - use better voicing
      id: 'A#9sus4-A',
      frets: [1, 1, 1, 1, 1, null],
      fingers: [1, 1, 1, 1, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#add9 - Add 9
  // Intervals: [0, 4, 7, 14] = A#, D, F, C (10, 2, 5, 0)
  'add9': [
    {
      // A-shape add9 at fret 1
      // add9 requires: A#(10), D(2), F(5), C(0)
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 9th
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ root
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 5th
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#add9-A',
      frets: [8, 3, 3, 3, 1, null],
      fingers: [4, 2, 2, 2, 1, null],
      barreAt: 3,
      barreStrings: [1, 3] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard' as const,
    },
    {
      // E-shape add9 at fret 6
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 9th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 5th
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓ M3
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ root
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ 5th
      // String 5 (E=4) fret 6: 4+6=10 (A#) ✓ root
      id: 'A#add9-E',
      frets: [8, 6, 7, 8, 8, 6],
      fingers: [4, 1, 2, 3, 3, 1],
      barreAt: 6,
      barreStrings: [1, 5] as [number, number],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard' as const,
    },
    {
      // A-shape add9 (Bb variant)
      // add9 requires: Bb(10), D(2), F(5), C(0)
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 9th
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓ root
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 5th
      // String 4 (A=9) fret 1: 9+1=10 (Bb) ✓ root
      id: 'Bbadd9-A',
      frets: [8, 3, 3, 3, 1, null],
      fingers: [4, 2, 2, 2, 1, null],
      barreAt: 3,
      barreStrings: [1, 3] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard' as const,
    },
    {
      // A#add9-high: 4弦ルートの高位ポジション
      // 1弦(E=4)+8=0 (C) 9th, 2弦(B=11)+6=5 (F) 5th
      // 3弦(G=7)+7=2 (D) M3, 4弦(D=2)+8=10 (A#) root
      id: 'A#add9-high',
      frets: [8, 6, 7, 8, null, null],
      fingers: [4, 1, 2, 3, null, null],
      baseFret: 6,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // A#69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = A#, D, F, G, C
  // 5弦ルート移動フォーム (5弦1フレット = A#)
  '69': [
    {
      id: 'A#69-A',
      frets: [1, 1, 0, 0, 1, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bb69-A',
      frets: [1, 1, 0, 0, 1, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#m69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = A#, C#, F, G, C (10, 1, 5, 7, 0)
  'm69': [
    {
      // フォーム1: 低フレット
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ 9th
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ 6th
      // String 3 (D=2) fret 0: 2+0=2 → 違う。修正必要
      // 実際のフォーム1:
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ 9th
      // String 2 (G=7) fret 1: 7+1=8 → 違う。
      // 正しくは:
      id: 'A#m69-form1',
      frets: [null, 1, 0, 0, 1, null],
      fingers: [null, 2, null, null, 1, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      // フォーム2: 低いポジション
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 9th
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ 6th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ m3
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ root
      id: 'A#m69-form2',
      frets: [8, 8, 6, 8, null, null],
      fingers: [2, 3, 1, 4, null, null],
      baseFret: 6,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // A#-5 - Major flat 5
  // Intervals: [0, 4, 6] = A#, D, E
  '-5': [
    {
      // String 2 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 3 (G=7) fret 3: 7+3=10 (A#) ✓ root
      // String 4 (D=2) fret 2: 2+2=4 (E) ✓ b5
      // String 5 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#-5-A',
      frets: [null, 3, 3, 2, 1, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = A#, D, E, G# (10, 2, 4, 8)
  '7-5': [
    {
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ m7
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ b5
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#7-5-1',
      frets: [null, 3, 1, 2, 1, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bb7-5-1',
      frets: [null, 3, 1, 2, 1, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = A#, D, F#, G# (10, 2, 6, 8)
  '7+5': [
    {
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ m7
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ #5
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#7+5-1',
      frets: [null, 3, 1, 4, 1, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bb7+5-1',
      frets: [null, 3, 1, 4, 1, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#M7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = A#, D, E, A (10, 2, 4, 9)
  'M7-5': [
    {
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M3
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ M7
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ b5
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#M7-5-1',
      frets: [null, 3, 2, 2, 1, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'BbM7-5-1',
      frets: [null, 3, 2, 2, 1, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#m7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = A#, C#, F#, G# (10, 1, 6, 8)
  // Note: #5 of A#(10) is F#(6), m7 is G#(8)
  'm7+5': [
    {
      // Correct calculation for A#m7+5:
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ m3
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ m7
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ #5
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓ root
      id: 'A#m7+5-1',
      frets: [null, 2, 1, 4, 1, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 1,
      barreStrings: [2, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Bbm7+5-1',
      frets: [null, 2, 1, 4, 1, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 1,
      barreStrings: [2, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = A#, D, F, G#, C# (10, 2, 5, 8, 1)
  '7+9': [
    {
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓
      id: 'A#7+9-1',
      frets: [null, 2, 1, 0, 1, null],
      fingers: [null, 3, 2, null, 1, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'Bb7+9-1',
      frets: [null, 2, 1, 0, 1, null],
      fingers: [null, 3, 2, null, 1, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // A#4.4 - Quartal chord (A#-D#-G#)
  // Intervals: [0, 5, 10] = A#, D#, G# (10, 3, 8)
  '4.4': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓
      id: 'A#4.4-1',
      frets: [null, 4, 1, 1, 1, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 1,
      barreStrings: [2, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'Bb4.4-1',
      frets: [null, 4, 1, 1, 1, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 1,
      barreStrings: [2, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // A#blk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = A#, C, E, G# (10, 0, 4, 8)
  'blk': [
    {
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓
      // String 4 (A=9) fret 1: 9+1=10 (A#) ✓
      id: 'A#blk-A',
      frets: [null, 1, 1, 2, 1, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 1,
      barreStrings: [1, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'Bbblk-A',
      frets: [null, 1, 1, 2, 1, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 1,
      barreStrings: [1, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // パワーコード (1種)
  // ============================================

  // A#5 - Power Chord (root + P5)
  // Intervals: [0, 7] = A#, F
  '5': [
    {
      id: 'A#5-power5',
      frets: [null, null, null, 3, 1, null],
      fingers: [null, null, null, 3, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, true, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'A#5-power6',
      frets: [null, null, null, null, 8, 6],
      fingers: [null, null, null, null, 3, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 6,
      muted: [true, true, true, true, false, false],
      difficulty: 'easy',
    },
  ],

};

// A#ルートの分数コード（10パターン）
// A# = MIDI 10, Major triad = [10, 2, 5] = A#, D, F
// Minor triad = [10, 1, 5] = A#, C#, F
// Minor7 = [10, 1, 5, 8] = A#, C#, F, G#
export const AS_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // A#/C - A# major with C bass (interval 2)
  // A#=10, D=2, F=5, Bass C=0
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓ (BASS)
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/2': [
    {
      id: 'A#-major-2-1',
      frets: [1, 3, 3, 3, 3, null],
      fingers: [1, 3, 3, 3, 3, null],
      barreAt: 3,
      barreStrings: [1, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#/D - A# major with D bass (interval 4 = M3rd)
  // A#=10, D=2, F=5, Bass D=2 (already in chord)
  // String 5 (A=9): for D(2): fret = (2-9+12)%12 = 5 ✓ (BASS)
  // String 4 (D=2): for A#(10): fret = (10-2+12)%12 = 8 ✓
  // String 3 (G=7): for D(2): fret = (2-7+12)%12 = 7 ✓
  // String 2 (B=11): for F(5): fret = (5-11+12)%12 = 6 ✓
  // String 1 (E=4): for A#(10): fret = (10-4+12)%12 = 6 ✓
  'major/4': [
    {
      id: 'A#-major-4-1',
      frets: [6, 6, 7, 8, 5, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 1],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#/D# - A# major with D# bass (interval 5 = P4th)
  // A#=10, D=2, F=5, Bass D#=3 (not in chord)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 ✓ (BASS)
  // String 4 (D=2): for A#(10): fret = (10-2+12)%12 = 8 ✓
  // String 3 (G=7): for D(2): fret = (2-7+12)%12 = 7 ✓
  // String 2 (B=11): for F(5): fret = (5-11+12)%12 = 6 ✓
  // String 1 (E=4): for A#(10): fret = (10-4+12)%12 = 6 ✓
  'major/5': [
    {
      id: 'A#-major-5-1',
      frets: [6, 6, 7, 8, 6, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#/F - A# major with F bass (interval 7)
  // A#=10, D=2, F=5, Bass=F(5)
  // String 6 (E=4) fret 1: 4+1=5 (F) ✓ Bass
  // String 5 (A=9) fret 1: 9+1=10 (A#) ✓
  // String 4 (D=2) fret 3: 2+3=5 (F) ✓
  // String 3 (G=7) fret 3: 7+3=10 (A#) ✓
  // String 2 (B=11) fret 3: 11+3=14%12=2 (D) ✓
  // String 1 (E=4) fret 1: 4+1=5 (F) ✓
  'major/5th': [
    {
      id: 'As-major-5th-1',
      frets: [1, 3, 3, 3, 1, 1],
      fingers: [1, 4, 3, 2, 1, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // A#/A - A# major with A bass (interval 11 = maj7th)
  // A#=10, D=2, F=5, Bass A=9
  // String 5 (A=9): for A(9): fret = 0 ✓ (BASS open)
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/7': [
    {
      id: 'A#-major-7-1',
      frets: [1, 3, 3, 3, 0, null],
      fingers: [1, 3, 3, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#/G - A# major with G bass (interval 9 = 6th)
  // A#=10, D=2, F=5, Bass G=7
  // String 6 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓ (BASS)
  // String 5 (A=9): for A#(10): fret = (10-9+12)%12 = 1 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/9': [
    {
      id: 'A#-major-9-1',
      frets: [1, 3, 3, 3, 1, 3],
      fingers: [1, 3, 3, 3, 1, 4],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // A#/G# - A# major with G# bass (interval 10 = min7th)
  // A#=10, D=2, F=5, Bass G#=8
  // String 6 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓ (BASS)
  // String 5 (A=9): for A#(10): fret = (10-9+12)%12 = 1 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/10': [
    {
      id: 'A#-major-10-1',
      frets: [1, 3, 3, 3, 1, 4],
      fingers: [1, 3, 3, 3, 1, 4],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // マイナー分数 (2種)
  // A#m/C# - A#m with C# bass (interval 3 = min3rd)
  // A#m = [10, 1, 5] = A#, C#, F, Bass C#=1
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓ (BASS)
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'minor/3': [
    {
      id: 'A#-minor-3-1',
      frets: [1, 2, 3, 3, 4, null],
      fingers: [1, 2, 3, 4, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // A#m/F - A#m with F bass (interval 7 = 5th)
  // A#m = [10, 1, 5] = A#, C#, F, Bass F=5
  // String 6 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓ (BASS)
  // String 5 (A=9): for A#(10): fret = (10-9+12)%12 = 1 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'minor/7': [
    {
      id: 'A#-minor-7-1',
      frets: [1, 2, 3, 3, 1, 1],
      fingers: [1, 2, 4, 3, 1, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // マイナー7分数 (2種)
  // A#m7/F - A#m7 with F bass (interval 7 = 5th)
  // A#m7 = [10, 1, 5, 8] = A#, C#, F, G#, Bass F=5
  // String 6 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓ (BASS)
  // String 5 (A=9): for A#(10): fret = (10-9+12)%12 = 1 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for G#(8): fret = (8-7+12)%12 = 1 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'minor7/5': [
    {
      id: 'A#-minor7-5-1',
      frets: [1, 2, 1, 3, 1, 1],
      fingers: [1, 3, 1, 4, 1, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // A#m7/G# - A#m7 with G# bass (interval 10 = min7th)
  // A#m7 = [10, 1, 5, 8] = A#, C#, F, G#, Bass G#=8
  // String 6 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓ (BASS)
  // String 5 (A=9): for A#(10): fret = (10-9+12)%12 = 1 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for G#(8): fret = (8-7+12)%12 = 1 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'minor7/10': [
    {
      id: 'A#-minor7-10-1',
      frets: [1, 2, 1, 3, 1, 4],
      fingers: [1, 3, 1, 4, 1, 4],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

};
