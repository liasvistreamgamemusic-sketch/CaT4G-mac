/**
 * CaT4G - C# Root Chord Data
 * C#ルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * C# = MIDI 1
 */

import type { Fingering, RootChordData, SlashChordPattern } from '../types';

// C#ルートの基本コード（31品質）
export const CS_BASIC: RootChordData = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // C# Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'C#-barre-A',
      frets: [4, 6, 6, 6, 4, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'C#-barre-E',
      frets: [9, 9, 10, 11, 11, 9],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 9,
      barreStrings: [0, 5],
      baseFret: 9,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'Db-barre-A',
      frets: [4, 6, 6, 6, 4, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#m - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'C#m-barre-A',
      frets: [4, 5, 6, 6, 4, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'C#m-barre-E',
      frets: [9, 9, 9, 11, 11, 9],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 9,
      barreStrings: [0, 5],
      baseFret: 9,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'Dbm-barre-A',
      frets: [4, 5, 6, 6, 4, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = C#, F, G#, B (1, 5, 8, 11)
  '7': [
    {
      // A-shape barre at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ 5th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ M3
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ m7
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ 5th
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#7-barre-A',
      frets: [4, 6, 4, 6, 4, null],
      fingers: [1, 3, 1, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Db7-barre-A',
      frets: [4, 6, 4, 6, 4, null],
      fingers: [1, 3, 1, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#m7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C#, E, G#, B (1, 4, 8, 11)
  // Verification: [4,5,4,6,4,x] → G#(8),E(4),B(11),G#(8),C#(1) ✓
  'm7': [
    {
      id: 'C#m7-barre',
      frets: [4, 5, 4, 6, 4, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Dbm7-barre',
      frets: [4, 5, 4, 6, 4, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#M7 - Major 7
  // Intervals: [0, 4, 7, 11] = C#, F, G#, C (1, 5, 8, 0)
  'M7': [
    {
      // A-shape at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ 5th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ M3
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M7
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ 5th
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#M7-barre-A',
      frets: [4, 6, 5, 6, 4, null],
      fingers: [1, 3, 2, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'DbM7-barre-A',
      frets: [4, 6, 5, 6, 4, null],
      fingers: [1, 3, 2, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // C#m7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = C#, E, G, B (C#=1, E=4, G=7, B=11)
  'm7-5': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      id: 'C#m7b5-A',
      frets: [null, 5, 4, 5, 4, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // Enharmonic: Dbm7b5
      id: 'Dbm7b5-A',
      frets: [null, 5, 4, 5, 4, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#m-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = C#, E, G
  'm-5': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      id: 'C#m-5-A',
      frets: [null, 5, 6, 5, 4, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Dbm-5-A',
      frets: [null, 5, 6, 5, 4, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // C#dim - Diminished
  // Intervals: [0, 3, 6] = C#, E, G (1, 4, 7)
  'dim': [
    {
      id: 'C#dim-5str',
      frets: [3, 5, 3, 5, 4, null],
      fingers: [1, 3, 1, 4, 2, null],
      barreAt: 3,
      barreStrings: [0, 2],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'C#dim-6str',
      frets: [null, 8, 9, 8, null, 9],
      fingers: [null, 1, 3, 2, null, 4],
      baseFret: 8,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
  ],

  // C#dim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = C#, E, G, Bb (C#=1, E=4, G=7, Bb=10)
  'dim7': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      id: 'C#dim7-std',
      frets: [null, 5, 3, 5, 4, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Dbdim7-std',
      frets: [null, 5, 3, 5, 4, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#aug - Augmented
  // Intervals: [0, 4, 8] = C#, F, A (1, 5, 9)
  'aug': [
    {
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ M3
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ root
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ #5
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ M3
      id: 'C#aug-open',
      frets: [1, 2, 2, 3, null, null],
      fingers: [1, 2, 3, 4, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
    {
      id: 'Dbaug-open',
      frets: [1, 2, 2, 3, null, null],
      fingers: [1, 2, 3, 4, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // C#sus2 - Suspended 2
  // Intervals: [0, 2, 7] = C#, D#, G# (1, 3, 8)
  'sus2': [
    {
      // A-shape at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ 5th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 2nd
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ root
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ 5th
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#sus2-barre-A',
      frets: [4, 4, 6, 6, 4, null],
      fingers: [1, 1, 3, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Dbsus2-barre-A',
      frets: [4, 4, 6, 6, 4, null],
      fingers: [1, 1, 3, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#sus4 - Suspended 4
  // Intervals: [0, 5, 7] = C#, F#, G# (1, 6, 8)
  'sus4': [
    {
      // A-shape at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ 5th
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ 4th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ root
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ 5th
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#sus4-barre-A',
      frets: [4, 7, 6, 6, 4, null],
      fingers: [1, 4, 2, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Dbsus4-barre-A',
      frets: [4, 7, 6, 6, 4, null],
      fingers: [1, 4, 2, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = C#, F#, G#, B
  '7sus4': [
    {
      // String 1 (E=4) fret 2: 4+2=6 (F#) ✓ P4
      // String 2 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ root
      // String 3 (G=7) fret 4: 7+4=11 (B) ✓ m7
      // String 4 (D=2) fret 6: 2+6=8 (G#) ✓ P5
      // String 5 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#7sus4-A',
      frets: [2, 2, 4, 6, 4, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 2,
      barreStrings: [0, 1],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // C#6 - Major 6
  // Intervals: [0, 4, 7, 9] = C#, F, G#, A# (1, 5, 8, 10)
  '6': [
    {
      // 6弦ルート移動フォーム (Form 1)
      id: 'C#6-6str-form1',
      frets: [null, 11, 10, null, 11, 9],
      fingers: [null, 3, 2, null, 4, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 9,
      muted: [true, false, false, true, false, false],
      difficulty: 'medium',
    },
    {
      // 6弦ルート移動フォーム (Form 2)
      id: 'C#6-6str-form2',
      frets: [null, 9, 10, 8, null, 9],
      fingers: [null, 2, 3, 1, null, 2],
      barreAt: 9,
      barreStrings: [1, 5],
      baseFret: 8,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // A-shape at fret 4
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 6th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ M3
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ root
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ 5th
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#6-barre-A',
      frets: [6, 6, 6, 6, 4, null],
      fingers: [2, 2, 2, 2, 1, null],
      barreAt: 6,
      barreStrings: [0, 3],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Db6-barre-A',
      frets: [6, 6, 6, 6, 4, null],
      fingers: [2, 2, 2, 2, 1, null],
      barreAt: 6,
      barreStrings: [0, 3],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#m6 - Minor 6
  // Intervals: [0, 3, 7, 9] = C#, E, G#, A# (1, 4, 8, 10)
  'm6': [
    {
      // A-shape at fret 4
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 6th
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓ m3
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ root
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ 5th
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#m6-barre-A',
      frets: [6, 5, 6, 6, 4, null],
      fingers: [3, 2, 3, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 3],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Dbm6-barre-A',
      frets: [6, 5, 6, 6, 4, null],
      fingers: [3, 2, 3, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 3],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // C#mM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = C#, E, G#, C (1, 4, 8, 0)
  'mM7': [
    {
      // E-shape mM7 barre at fret 9
      id: 'C#mM7-E-barre',
      frets: [9, 9, 9, 10, 11, 9],
      fingers: [1, 1, 1, 2, 3, 1],
      barreAt: 9,
      barreStrings: [0, 5],
      baseFret: 9,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      // A-shape at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ 5th
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓ m3
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M7
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ 5th
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#mM7-barre-A',
      frets: [4, 5, 5, 6, 4, null],
      fingers: [1, 2, 3, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'DbmM7-barre-A',
      frets: [4, 5, 5, 6, 4, null],
      fingers: [1, 2, 3, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // C#9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = C#, F, G#, B, D# (1, 5, 8, 11, 3)
  '9': [
    {
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ 5th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 9th
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ m7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ M3
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#9-A',
      frets: [4, 4, 4, 3, 4, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Db9-A',
      frets: [4, 4, 4, 3, 4, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#m9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = C#, E, G#, B, D# (1, 4, 8, 11, 3)
  'm9': [
    {
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ 5th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 9th
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ m7
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ m3
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#m9-A',
      frets: [4, 4, 4, 2, 4, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#M9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = C#, E#/F, G#, B#/C, D# (1, 5, 8, 0, 3)
  'M9': [
    {
      id: 'C#M9-open',
      frets: [null, 4, 5, 3, 4, null],
      fingers: [null, 2, 4, 1, 3, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'C#M9-barre',
      frets: [4, 4, 5, 6, 4, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 4,
      barreStrings: [1, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // C#9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = C#, F#, G#, B, D# (1, 6, 8, 11, 3)
  '9sus4': [
    {
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ sus4
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 9th
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ m7
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ sus4
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#9sus4-A',
      frets: [2, 4, 4, 4, 4, null],
      fingers: [1, 2, 3, 4, 2, null],
      barreAt: 4,
      barreStrings: [1, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#add9 - Add 9
  // Intervals: [0, 4, 7, 14] = C#, F, G#, D# (1, 5, 8, 3)
  'add9': [
    {
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ 5th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ M3
      // String 2 (G=7) fret 4: 7+4=11%12=11 → wrong, use fret 6: 7+6=13%12=1 (C#) ✓ root
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓ 9th
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#add9-A',
      frets: [4, 6, 6, 1, 4, null],
      fingers: [1, 3, 4, 1, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Dbadd9-A',
      frets: [4, 6, 6, 1, 4, null],
      fingers: [1, 3, 4, 1, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // C#add9-high: 4弦ルートの高位ポジション
      // 1弦(E=4)+11=3 (D#) 9th, 2弦(B=11)+9=8 (G#) 5th
      // 3弦(G=7)+10=5 (F) M3, 4弦(D=2)+11=1 (C#) root
      id: 'C#add9-high',
      frets: [11, 9, 10, 11, null, null],
      fingers: [4, 1, 2, 3, null, null],
      baseFret: 9,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // C#69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = C#, F, G#, A#, D#
  // 5弦ルート移動フォーム (5弦4フレット = C#)
  '69': [
    {
      id: 'C#69-A',
      frets: [4, 4, 3, 3, 4, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Db69-A',
      frets: [4, 4, 3, 3, 4, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#m69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = C#, E, G#, A#, D#
  'm69': [
    {
      // フォーム1: 低フレット
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 9th
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ 6th
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ m3
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#m69-form1',
      frets: [null, 4, 3, 2, 4, null],
      fingers: [null, 3, 2, 1, 4, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // フォーム2: 高フレット
      // String 0 (E=4) fret 11: 4+11=15%12=3 (D#) ✓ 9th
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ 6th
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓ m3
      // String 3 (D=2) fret 11: 2+11=13%12=1 (C#) ✓ root
      id: 'C#m69-form2',
      frets: [11, 11, 9, 11, null, null],
      fingers: [2, 3, 1, 4, null, null],
      baseFret: 9,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // C#-5 - Major flat 5
  // Intervals: [0, 4, 6] = C#, F, G
  '-5': [
    {
      // String 2 (B=11) fret 6: 11+6=17%12=5 (F) ✓ M3
      // String 3 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ root
      // String 4 (D=2) fret 5: 2+5=7 (G) ✓ b5
      // String 5 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#-5-A',
      frets: [null, 6, 6, 5, 4, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = C#, F, G, B (C#=1, F=5, G=7, B=11)
  '7-5': [
    {
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      id: 'C#7-5-1',
      frets: [null, 6, 4, 5, 4, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = C#, F, A, B (C#=1, F=5, A=9, B=11)
  '7+5': [
    {
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      id: 'C#7+5-1',
      frets: [null, 6, 4, 7, 4, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#M7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = C#, F, G, C (C#=1, F=5, G=7, C=0)
  'M7-5': [
    {
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      id: 'C#M7-5-1',
      frets: [null, 6, 5, 5, 4, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#m7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = C#, E, A, B (1, 4, 9, 11)
  'm7+5': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      id: 'C#m7+5-1',
      frets: [null, 5, 4, 7, 4, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 4,
      barreStrings: [2, 4],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = C#, F, G#, B, E# (1, 5, 8, 11, 4)
  '7+9': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E#/F) ✓ #9
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ m7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ M3
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ root
      id: 'C#7+9-1',
      frets: [null, 5, 4, 3, 4, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // C#4.4 - Quartal chord (C#-F#-B)
  // Intervals: [0, 5, 10] = C#, F#, B (1, 6, 11)
  '4.4': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      id: 'C#4.4-1',
      frets: [null, 7, 4, 4, 4, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 4,
      barreStrings: [2, 4],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#blk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = C#, D#, G, B (C#=1, D#=3, G=7, B=11)
  'blk': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      id: 'C#blk-A',
      frets: [null, 4, 4, 5, 4, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 4,
      barreStrings: [1, 4],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Dbblk-A',
      frets: [null, 4, 4, 5, 4, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 4,
      barreStrings: [1, 4],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // パワーコード (1種)
  // ============================================

  // C#5 - Power Chord (root + P5)
  // Intervals: [0, 7] = C#, G#
  '5': [
    {
      id: 'C#5-power5',
      frets: [null, null, null, 6, 4, null],
      fingers: [null, null, null, 3, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 4,
      muted: [true, true, true, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'C#5-power6',
      frets: [null, null, null, null, 11, 9],
      fingers: [null, null, null, null, 3, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 9,
      muted: [true, true, true, true, false, false],
      difficulty: 'easy',
    },
  ],

};

// C#ルートの分数コード（10パターン）
// C# = MIDI 1, Major triad = [1, 5, 8] = C#, F, G#
export const CS_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // C#/D# - C# major with D# bass (interval 2)
  // C#=1, F=5, G#=8, Bass D#=3
  'major/2': [
    {
      // Barre chord at fret 6
      // String 1 (E=4) fret 4: 4+4=8 (G#) ✓
      // String 2 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 3 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 4 (D=2) fret 6: 2+6=8 (G#) ✓
      // String 5 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ Bass
      id: 'Cs-major-2-1',
      frets: [4, 6, 6, 6, 6, null],
      fingers: [1, 3, 3, 3, 3, null],
      barreAt: 6,
      barreStrings: [1, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],
  // C#/F - C# major with F bass (interval 4)
  // C#=1, F=5, G#=8, Bass F=5
  'major/4': [
    {
      // Barre chord at fret 1 (F bass on string 6)
      // String 1 (E=4) fret 1: 4+1=5 (F) ✓
      // String 2 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 3 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 4 (D=2) fret 3: 2+3=5 (F) ✓
      // String 5 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      // String 6 (E=4) fret 1: 4+1=5 (F) ✓ Bass
      id: 'Cs-major-4-1',
      frets: [1, 2, 1, 3, 4, 1],
      fingers: [1, 2, 1, 3, 4, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],
  // C#/F# - C# major with F# bass (interval 5)
  // C#=1, F=5, G#=8, Bass F#=6
  'major/5': [
    {
      // F# bass on string 6 fret 2
      // String 1 (E=4) fret 1: 4+1=5 (F) ✓
      // String 2 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 3 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 4 (D=2) fret 3: 2+3=5 (F) ✓
      // String 5 (A=9) fret 4: 9+4=13%12=1 (C#) ✓
      // String 6 (E=4) fret 2: 4+2=6 (F#) ✓ Bass
      id: 'Cs-major-5-1',
      frets: [1, 2, 1, 3, 4, 2],
      fingers: [1, 2, 1, 3, 4, 2],
      barreAt: 1,
      barreStrings: [0, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // C#/G# - C# major with G# bass (interval 7)
  // C#=1, F=5, G#=8, Bass=G#(8)
  // String 6 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓ Bass
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for G#(8): fret = (8-7+12)%12 = 1 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/5th': [
    {
      id: 'Cs-major-5th-1',
      frets: [1, 2, 1, 3, 4, 4],
      fingers: [1, 2, 1, 3, 4, 4],
      barreAt: 1,
      barreStrings: [0, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // C#/C - C# major with C bass (interval 11 from C# = 1+11=12%12=0)
  // C#=1, F=5, G#=8, Bass=C(0)
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for G#(8): fret = (8-7+12)%12 = 1 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/7': [
    {
      id: 'Cs-major-7-1',
      frets: [1, 2, 1, 3, 3, null],
      fingers: [1, 2, 1, 3, 4, null],
      barreAt: 1,
      barreStrings: [0, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#/A# - C# major with A# bass (interval 9 from C# = 1+9=10)
  // C#=1, F=5, G#=8, Bass=A#(10)
  // String 5 (A=9): for A#(10): fret = (10-9+12)%12 = 1 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for G#(8): fret = (8-7+12)%12 = 1 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/9': [
    {
      id: 'Cs-major-9-1',
      frets: [1, 2, 1, 3, 1, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#/B - C# major with B bass (interval 10 from C# = 1+10=11)
  // C#=1, F=5, G#=8, Bass=B(11)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for G#(8): fret = (8-7+12)%12 = 1 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/10': [
    {
      id: 'Cs-major-10-1',
      frets: [1, 2, 1, 3, 2, null],
      fingers: [1, 2, 1, 4, 3, null],
      barreAt: 1,
      barreStrings: [0, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // マイナー分数 (2種)
  // C#m/E - Minor with bass on minor 3rd (interval 3)
  // C#m = C#(1), E(4), G#(8), Bass = E(4)
  'minor/3': [
    {
      // Position 1: A-shape based
      // String 2 (B=11): for E(4): fret = (4-11+12)%12 = 5 ✓
      // String 3 (G=7): for C#(1): fret = (1-7+12)%12 = 6 ✓
      // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
      // String 5 (A=9): for E(4): fret = (4-9+12)%12 = 7 ✓ BASS
      id: 'Cs-minor-3-1',
      frets: [null, 5, 6, 6, 7, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Db-minor-3-1',
      frets: [null, 5, 6, 6, 7, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],
  // C#m/G# - Minor with bass on 5th (interval 7)
  // C#m = C#(1), E(4), G#(8), Bass = G#(8)
  'minor/7': [
    {
      // Position 1: E-shape based with G# bass
      // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
      // String 2 (B=11): for E(4): fret = (4-11+12)%12 = 5 ✓
      // String 3 (G=7): for C#(1): fret = (1-7+12)%12 = 6 ✓
      // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
      // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓
      // String 6 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓ BASS
      id: 'Cs-minor-7-1',
      frets: [4, 5, 6, 6, 4, 4],
      fingers: [1, 2, 4, 3, 1, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'Db-minor-7-1',
      frets: [4, 5, 6, 6, 4, 4],
      fingers: [1, 2, 4, 3, 1, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // マイナー7分数 (2種)
  // C#m7/G# - C#m7 with G#(5th) in bass
  // C#m7 = C#(1), E(4), G#(8), B(11)
  'minor7/5': [
    {
      // String 6 (E=4): fret 4 → 4+4=8 (G#) ✓ 5th (BASS)
      // String 5 (A=9): fret 4 → 9+4=13%12=1 (C#) ✓ root
      // String 4 (D=2): fret 2 → 2+2=4 (E) ✓ m3
      // String 3 (G=7): fret 4 → 7+4=11 (B) ✓ m7
      // String 2 (B=11): fret 5 → 11+5=16%12=4 (E) ✓ m3
      id: 'Cs-minor7-5-1',
      frets: [null, 5, 4, 2, 4, 4],
      fingers: [null, 4, 2, 1, 3, 3],
      barreAt: 4,
      barreStrings: [4, 5],
      baseFret: 2,
      muted: [true, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // C#m7/B - C#m7 with B(m7) in bass
  // C#m7 = C#(1), E(4), G#(8), B(11)
  'minor7/10': [
    {
      // String 5 (A=9): fret 2 → 9+2=11 (B) ✓ m7 (BASS)
      // String 4 (D=2): fret 2 → 2+2=4 (E) ✓ m3
      // String 3 (G=7): fret 1 → 7+1=8 (G#) ✓ 5th
      // String 2 (B=11): fret 2 → 11+2=13%12=1 (C#) ✓ root
      // String 1 (E=4): fret 4 → 4+4=8 (G#) ✓ 5th
      id: 'Cs-minor7-10-1',
      frets: [4, 2, 1, 2, 2, null],
      fingers: [4, 1, 1, 2, 1, null],
      barreAt: 2,
      barreStrings: [1, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

};
