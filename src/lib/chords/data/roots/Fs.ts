/**
 * CaT4G - F# Root Chord Data
 * F#ルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * F# = MIDI 6
 */

import type { Fingering, RootChordData, SlashChordPattern } from '../types';

// F#ルートの基本コード（31品質）
export const FS_BASIC: RootChordData = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // F# Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'F#-barre-E',
      frets: [2, 2, 3, 4, 4, 2],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'F#-barre-A',
      frets: [9, 11, 11, 11, 9, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 9,
      barreStrings: [0, 4],
      baseFret: 9,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gb-barre-E',
      frets: [2, 2, 3, 4, 4, 2],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // F#m - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'F#m-barre-E',
      frets: [2, 2, 2, 4, 4, 2],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'F#m-barre-A',
      frets: [9, 10, 11, 11, 9, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 9,
      barreStrings: [0, 4],
      baseFret: 9,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gbm-barre-E',
      frets: [2, 2, 2, 4, 4, 2],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // F#7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = C, E, G, A#
  '7': [
    {
      id: 'F#7-barre',
      frets: [2, 2, 3, 2, 4, 2],
      fingers: [1, 1, 2, 1, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'Gb7-barre',
      frets: [2, 2, 3, 2, 4, 2],
      fingers: [1, 1, 2, 1, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // F#m7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C, D#, G, A#
  'm7': [
    {
      id: 'F#m7-barre',
      frets: [2, 2, 2, 2, 4, 2],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'Gbm7-barre',
      frets: [2, 2, 2, 2, 4, 2],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // F#M7 - Major 7
  // Intervals: [0, 4, 7, 11] = C, E, G, B
  'M7': [
    {
      id: 'F#M7-barre',
      frets: [2, 2, 3, 3, 4, 2],
      fingers: [1, 1, 2, 3, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'GbM7-barre',
      frets: [2, 2, 3, 3, 4, 2],
      fingers: [1, 1, 2, 3, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // F#m7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = F#, A, C, E (F#=6, A=9, C=0, E=4)
  'm7-5': [
    {
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓
      id: 'F#m7b5-A',
      frets: [null, 10, 9, 10, 9, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gbm7b5-A',
      frets: [null, 10, 9, 10, 9, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#m-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = F#, A, C
  'm-5': [
    {
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓
      id: 'F#m-5-A',
      frets: [null, 10, 11, 10, 9, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gbm-5-A',
      frets: [null, 10, 11, 10, 9, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // F#dim - Diminished
  // Intervals: [0, 3, 6] = F#, A, C (6, 9, 0)
  'dim': [
    {
      id: 'F#dim-5str',
      frets: [8, 10, 8, 10, 9, null],
      fingers: [1, 3, 1, 4, 2, null],
      barreAt: 8,
      barreStrings: [0, 2],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'F#dim-6str',
      frets: [null, 1, 2, 1, null, 2],
      fingers: [null, 1, 3, 2, null, 4],
      baseFret: 1,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
  ],

  // F#dim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = F#, A, C, Eb (F#=6, A=9, C=0, Eb=3)
  'dim7': [
    {
      // String 0 (E=4) fret 5: 4+5=9 (A) ✓
      // String 1 (B=11) fret 4: 11+4=15%12=3 (Eb) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓
      id: 'F#dim7-std',
      frets: [5, 4, 5, 4, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 4,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
    {
      id: 'Gbdim7-std',
      frets: [5, 4, 5, 4, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 4,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // F#aug - Augmented
  // Intervals: [0, 4, 8] = F#, A#, D (6, 10, 2)
  'aug': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ M3
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ aug5
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ M3
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ root
      id: 'F#aug-std',
      frets: [6, 3, 3, 4, null, null],
      fingers: [4, 1, 2, 3, null, null],
      baseFret: 3,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
    {
      id: 'Gbaug-std',
      frets: [6, 3, 3, 4, null, null],
      fingers: [4, 1, 2, 3, null, null],
      baseFret: 3,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // F#sus2 - Suspended 2
  // Intervals: [0, 2, 7] = F#, G#, C# (6, 8, 1)
  'sus2': [
    {
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ root
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ 5th
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ 2nd
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ root
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ 5th
      // String 5 (E=4) fret 2: 4+2=6 (F#) ✓ root
      id: 'F#sus2-barre',
      frets: [2, 2, 1, 4, 4, 2],
      fingers: [1, 1, 1, 3, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'Gbsus2-barre',
      frets: [2, 2, 1, 4, 4, 2],
      fingers: [1, 1, 1, 3, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // F#sus4 - Suspended 4
  // Intervals: [0, 5, 7] = F#, B, C# (6, 11, 1)
  'sus4': [
    {
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ root
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ 5th
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ 4th
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ root
      // String 4 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ 5th
      // String 5 (E=4) fret 2: 4+2=6 (F#) ✓ root
      id: 'F#sus4-barre',
      frets: [2, 2, 4, 4, 4, 2],
      fingers: [1, 1, 3, 3, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'Gbsus4-barre',
      frets: [2, 2, 4, 4, 4, 2],
      fingers: [1, 1, 3, 3, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // F#7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = F#, B, C#, E
  '7sus4': [
    {
      // String 1 (E=4) fret 7: 4+7=11 (B) ✓ P4
      // String 2 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ root
      // String 3 (G=7) fret 9: 7+9=16%12=4 (E) ✓ m7
      // String 4 (D=2) fret 11: 2+11=13%12=1 (C#) ✓ P5
      // String 5 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#7sus4-A',
      frets: [7, 7, 9, 11, 9, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 7,
      barreStrings: [0, 1],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // F#6 - Major 6
  // Intervals: [0, 4, 7, 9] = F#, A#, C#, D# (6, 10, 1, 3)
  '6': [
    {
      // 6弦ルート移動フォーム (Form 1) - F#: X=2
      // 5弦使用: [null, X+2, X+1, null, X+2, X] = [null, 4, 3, null, 4, 2]
      id: 'F#6-6str-form1',
      frets: [null, 4, 3, null, 4, 2],
      fingers: [null, 3, 2, null, 4, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 2,
      muted: [true, false, false, true, false, false],
      difficulty: 'medium',
    },
    {
      // 6弦ルート移動フォーム (Form 2) - F#: X=2
      // 4弦使用 (high): [null, X, X+1, X-1, null, X] = [null, 2, 3, 1, null, 2]
      id: 'F#6-6str-form2',
      frets: [null, 2, 3, 1, null, 2],
      fingers: [null, 2, 3, 1, null, 2],
      barreAt: 2,
      barreStrings: [1, 5],
      baseFret: 1,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ root
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 6th
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ M3
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ root
      // String 5 (E=4) fret 2: 4+2=6 (F#) ✓ root
      id: 'F#6-barre',
      frets: [2, 4, 3, 4, null, 2],
      fingers: [1, 3, 2, 4, null, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, true, false],
      difficulty: 'hard',
    },
    {
      id: 'Gb6-barre',
      frets: [2, 4, 3, 4, null, 2],
      fingers: [1, 3, 2, 4, null, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, true, false],
      difficulty: 'hard',
    },
  ],

  // F#m6 - Minor 6
  // Intervals: [0, 3, 7, 9] = C, D#, G, A
  'm6': [
    {
      id: 'F#m6-barre',
      frets: [2, 4, 2, 4, 4, 2],
      fingers: [1, 3, 1, 4, 2, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'Gbm6-barre',
      frets: [2, 4, 2, 4, 4, 2],
      fingers: [1, 3, 1, 4, 2, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // F#mM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = F#, A, C#, E# (F#=6, A=9, C#=1, F=5)
  'mM7': [
    {
      // E-shape mM7 barre at fret 2
      id: 'F#mM7-E-barre',
      frets: [2, 2, 2, 3, 4, 2],
      fingers: [1, 1, 1, 2, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      // String 0 (E=4) fret 5: 4+5=9 (A) ✓
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F/E#) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓
      id: 'F#mM7-std',
      frets: [5, 6, 6, 4, null, null],
      fingers: [2, 3, 4, 1, null, null],
      baseFret: 4,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // F#9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = F#, A#, C#, E, G# (6, 10, 1, 4, 8)
  '9': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ M3
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓ 9th
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓ m7
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ M3
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#9-A',
      frets: [6, 9, 9, 8, 9, null],
      fingers: [1, 3, 4, 2, 3, null],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gb9-A',
      frets: [6, 9, 9, 8, 9, null],
      fingers: [1, 3, 4, 2, 3, null],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#m9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = F#, A, C#, E, G# (6, 9, 1, 4, 8)
  'm9': [
    {
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓ 5th
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓ 9th
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓ m7
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓ m3
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#m9-A',
      frets: [9, 9, 9, 7, 9, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 9,
      barreStrings: [0, 4],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#M9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = F#, A#, C#, E#, G# (6, 10, 1, 5, 8)
  'M9': [
    {
      id: 'F#M9-open',
      frets: [null, 9, 10, 8, 9, null],
      fingers: [null, 2, 4, 1, 3, null],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'F#M9-barre',
      frets: [9, 9, 10, 11, 9, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 9,
      barreStrings: [1, 5],
      baseFret: 9,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // F#9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = F#, B, C#, E, G# (6, 11, 1, 4, 8)
  '9sus4': [
    {
      // String 0 (E=4) fret 7: 4+7=11 (B) ✓ sus4
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓ 9th
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓ m7
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓ sus4
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#9sus4-A',
      frets: [7, 9, 9, 9, 9, null],
      fingers: [1, 2, 3, 4, 2, null],
      barreAt: 9,
      barreStrings: [1, 4],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#add9 - Add 9
  // Intervals: [0, 4, 7, 14] = F#, A#, C#, G# (6, 10, 1, 8)
  'add9': [
    {
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓ 5th
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ M3
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ root
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ 9th
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#add9-A',
      frets: [9, 11, 11, 6, 9, null],
      fingers: [2, 3, 4, 1, 2, null],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gbadd9-A',
      frets: [9, 11, 11, 6, 9, null],
      fingers: [2, 3, 4, 1, 2, null],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // F#add9-high: 4弦ルートの高位ポジション
      // 1弦(E=4)+4=8 (G#) 9th, 2弦(B=11)+2=1 (C#) 5th
      // 3弦(G=7)+3=10 (A#) M3, 4弦(D=2)+4=6 (F#) root
      id: 'F#add9-high',
      frets: [4, 2, 3, 4, null, null],
      fingers: [4, 1, 2, 3, null, null],
      baseFret: 2,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // F#69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = F#, A#, C#, D#, G#
  // 5弦ルート移動フォーム (5弦9フレット = F#)
  '69': [
    {
      id: 'F#69-A',
      frets: [9, 9, 8, 8, 9, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gb69-A',
      frets: [9, 9, 8, 8, 9, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#m69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = F#, A, C#, D#, G#
  'm69': [
    {
      // フォーム1: 低フレット
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓ 9th
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ 6th
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓ m3
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#m69-form1',
      frets: [null, 9, 8, 7, 9, null],
      fingers: [null, 3, 2, 1, 4, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // フォーム2: 低いポジション
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ 9th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 6th
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ m3
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ root
      id: 'F#m69-form2',
      frets: [4, 4, 2, 4, null, null],
      fingers: [2, 3, 1, 4, null, null],
      baseFret: 2,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // F#-5 - Major flat 5
  // Intervals: [0, 4, 6] = F#, A#, C
  '-5': [
    {
      // String 2 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ M3
      // String 3 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ root
      // String 4 (D=2) fret 10: 2+10=12%12=0 (C) ✓ b5
      // String 5 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#-5-A',
      frets: [null, 11, 11, 10, 9, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = F#, A#, C, E (6, 10, 0, 4)
  '7-5': [
    {
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ M3
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓ m7
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓ b5
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#7-5-1',
      frets: [null, 11, 9, 10, 9, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gb7-5-1',
      frets: [null, 11, 9, 10, 9, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = F#, A#, D, E (6, 10, 2, 4)
  '7+5': [
    {
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ M3
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓ m7
      // String 3 (D=2) fret 12: 2+12=14%12=2 (D) ✓ #5
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#7+5-1',
      frets: [null, 11, 9, 12, 9, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gb7+5-1',
      frets: [null, 11, 9, 12, 9, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#M7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = F#, A#, C, F (6, 10, 0, 5)
  'M7-5': [
    {
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ M3
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓ M7
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓ b5
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ root
      id: 'F#M7-5-1',
      frets: [null, 11, 10, 10, 9, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'GbM7-5-1',
      frets: [null, 11, 10, 10, 9, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#m7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = F#, A, D, E (6, 9, 2, 4)
  'm7+5': [
    {
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓
      // String 3 (D=2) fret 12: 2+12=14%12=2 (D) ✓
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓
      id: 'F#m7+5-1',
      frets: [null, 10, 9, 12, 9, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 9,
      barreStrings: [2, 4],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gbm7+5-1',
      frets: [null, 10, 9, 12, 9, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 9,
      barreStrings: [2, 4],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = F#, A#, C#, E, G## (6, 10, 1, 4, 9)
  '7+9': [
    {
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A=G##) ✓
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓
      id: 'F#7+9-1',
      frets: [null, 10, 9, 8, 9, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gb7+9-1',
      frets: [null, 10, 9, 8, 9, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // F#4.4 - Quartal chord (F#-B-E)
  // Intervals: [0, 5, 10] = F#, B, E (6, 11, 4)
  '4.4': [
    {
      // String 1 (B=11) fret 12: 11+12=23%12=11 (B) ✓
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓
      id: 'F#4.4-1',
      frets: [null, 12, 9, 9, 9, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 9,
      barreStrings: [2, 4],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Gb4.4-1',
      frets: [null, 12, 9, 9, 9, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 9,
      barreStrings: [2, 4],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#blk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = F#, G#, C, E (F#=6, G#=8, C=0, E=4)
  'blk': [
    {
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓
      id: 'F#blk-A',
      frets: [null, 9, 9, 10, 9, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 9,
      barreStrings: [1, 4],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      id: 'Gbblk-A',
      frets: [null, 9, 9, 10, 9, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 9,
      barreStrings: [1, 4],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // パワーコード (1種)
  // ============================================

  // F#5 - Power Chord (root + P5)
  // Intervals: [0, 7] = F#, C#
  '5': [
    {
      id: 'F#5-power5',
      frets: [null, null, null, 11, 9, null],
      fingers: [null, null, null, 3, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 9,
      muted: [true, true, true, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'F#5-power6',
      frets: [null, null, null, null, 4, 2],
      fingers: [null, null, null, null, 3, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 2,
      muted: [true, true, true, true, false, false],
      difficulty: 'easy',
    },
  ],

};

// F#ルートの分数コード（10パターン）
// F# = MIDI 6, Major triad = [6, 10, 1] = F#, A#, C#
export const FS_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // F#/G# - F# major with G# bass (interval 2)
  // F#=6, A#=10, C#=1, Bass=G#(8)
  // String 6 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓ (BASS)
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/2': [
    {
      id: 'Fs-major-2-1',
      frets: [2, 2, 3, 4, 4, 4],
      fingers: [1, 1, 2, 3, 3, 3],
      barreAt: 2,
      barreStrings: [0, 1],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // F#/A# - F# major with A# bass (interval 4)
  // F#=6, A#=10, C#=1, Bass=A#(10)
  // String 5 (A=9): for A#(10): fret = (10-9+12)%12 = 1 ✓ (BASS)
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/4': [
    {
      id: 'Fs-major-4-1',
      frets: [2, 2, 3, 4, 1, null],
      fingers: [2, 2, 3, 4, 1, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#/B - F# major with B bass (interval 5)
  // F#=6, A#=10, C#=1, Bass=B(11)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓ (BASS)
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/5': [
    {
      id: 'Fs-major-5-1',
      frets: [2, 2, 3, 4, 2, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#/C# - F# major with C# bass (interval 7)
  // F#=6, A#=10, C#=1, Bass=C#(1)
  // String 5 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ Bass
  // String 4 (D=2) fret 4: 2+4=6 (F#) ✓
  // String 3 (G=7) fret 3: 7+3=10 (A#) ✓
  // String 2 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
  // String 1 (E=4) fret 2: 4+2=6 (F#) ✓
  'major/5th': [
    {
      id: 'Fs-major-5th-1',
      frets: [2, 2, 3, 4, 4, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 2,
      barreStrings: [0, 1],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#/F - F# major with F bass (interval 11 from F# = 6+11=17%12=5)
  // F#=6, A#=10, C#=1, Bass=F(5)
  // String 6 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓ (BASS)
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/7': [
    {
      id: 'Fs-major-7-1',
      frets: [2, 2, 3, 4, 4, 1],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 2,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // F#/D# - F# major with D# bass (interval 9 from F# = 6+9=15%12=3)
  // F#=6, A#=10, C#=1, Bass=D#(3)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 ✓ (BASS)
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/9': [
    {
      id: 'Fs-major-9-1',
      frets: [2, 2, 3, 4, 6, null],
      fingers: [1, 1, 2, 3, 4, null],
      barreAt: 2,
      barreStrings: [0, 1],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#/E - F# major with E bass (interval 10 from F# = 6+10=16%12=4)
  // F#=6, A#=10, C#=1, Bass=E(4)
  // String 6 (E=4): for E(4): fret = (4-4+12)%12 = 0 ✓ (open! BASS)
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/10': [
    {
      id: 'Fs-major-10-1',
      frets: [2, 2, 3, 4, 4, 0],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 2,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // マイナー分数 (2種)
  // F#m/A - Minor with bass on minor 3rd (interval 3)
  // F#m = F#(6), A(9), C#(1), Bass = A(9)
  'minor/3': [
    {
      // Position 1: Open A string as bass
      // String 2 (B=11): for A(9): fret = (9-11+12)%12 = 10 ✓
      // String 3 (G=7): for F#(6): fret = (6-7+12)%12 = 11 ✓
      // String 4 (D=2): for C#(1): fret = (1-2+12)%12 = 11 ✓
      // String 5 (A=9): for A(9): fret = (9-9+12)%12 = 0 ✓ open BASS
      // Alternative simpler voicing with lower position
      // String 2 (B=11): for C#(1): fret = (1-11+12)%12 = 2 ✓
      // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
      // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
      // String 5 (A=9): for A(9): fret = 0 ✓ open BASS
      id: 'Fs-minor-3-1',
      frets: [null, 2, 2, 4, 0, null],
      fingers: [null, 1, 1, 3, null, null],
      barreAt: 2,
      barreStrings: [1, 2],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'Gb-minor-3-1',
      frets: [null, 2, 2, 4, 0, null],
      fingers: [null, 1, 1, 3, null, null],
      barreAt: 2,
      barreStrings: [1, 2],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],
  // F#m/C# - Minor with bass on 5th (interval 7)
  // F#m = F#(6), A(9), C#(1), Bass = C#(1)
  'minor/7': [
    {
      // Position 1: E-shape based with C# bass
      // String 1 (E=4): for C#(1): fret = (1-4+12)%12 = 9 ✓
      // String 2 (B=11): for A(9): fret = (9-11+12)%12 = 10 ✓
      // String 3 (G=7): for F#(6): fret = (6-7+12)%12 = 11 ✓
      // String 4 (D=2): for C#(1): fret = (1-2+12)%12 = 11 ✓
      // String 5 (A=9): for F#(6): fret = (6-9+12)%12 = 9 ✓
      // String 6 (E=4): for C#(1): fret = (1-4+12)%12 = 9 ✓ BASS
      id: 'Fs-minor-7-1',
      frets: [9, 10, 11, 11, 9, 9],
      fingers: [1, 2, 4, 3, 1, 1],
      barreAt: 9,
      barreStrings: [0, 5],
      baseFret: 9,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'Gb-minor-7-1',
      frets: [9, 10, 11, 11, 9, 9],
      fingers: [1, 2, 4, 3, 1, 1],
      barreAt: 9,
      barreStrings: [0, 5],
      baseFret: 9,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // マイナー7分数 (2種)
  // F#m7/C# - F#m7 with C# bass (interval 7 = 5th)
  // F#m7 = F#(6), A(9), C#(1), E(4)
  'minor7/5': [
    {
      // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓ 5th (BASS)
      // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓ root
      // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓ m3
      // String 2 (B=11): for E(4): fret = (4-11+12)%12 = 5 ✓ m7
      // String 1 (E=4): for A(9): fret = (9-4+12)%12 = 5 ✓ m3
      id: 'Fs-minor7-5-1',
      frets: [5, 5, 2, 4, 4, null],
      fingers: [3, 4, 1, 2, 2, null],
      barreAt: 4,
      barreStrings: [3, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F#m7/E - F#m7 with E(m7) in bass
  // F#m7 = F#(6), A(9), C#(1), E(4)
  'minor7/10': [
    {
      // String 6 (E=4): fret 0 → 4+0=4 (E) ✓ m7 (BASS open)
      // String 5 (A=9): fret 0 → 9+0=9 (A) ✓ m3
      // String 4 (D=2): fret 4 → 2+4=6 (F#) ✓ root
      // String 3 (G=7): fret 2 → 7+2=9 (A) ✓ m3
      // String 2 (B=11): fret 2 → 11+2=13%12=1 (C#) ✓ 5th
      // String 1 (E=4): fret 2 → 4+2=6 (F#) ✓ root
      id: 'Fs-minor7-10-1',
      frets: [2, 2, 2, 4, 0, 0],
      fingers: [1, 1, 1, 3, null, null],
      barreAt: 2,
      barreStrings: [0, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

};
