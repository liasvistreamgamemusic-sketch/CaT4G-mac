/**
 * CaT4G - G# Root Chord Data
 * G#ルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * G# = MIDI 8
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// G#ルートの基本コード（31品質）
export const GS_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // G# Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'G#-barre-E',
      frets: [4, 4, 5, 6, 6, 4],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'G#-barre-A',
      frets: [11, 13, 13, 13, 11, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 11,
      barreStrings: [0, 4],
      baseFret: 11,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      id: 'Ab-barre-E',
      frets: [4, 4, 5, 6, 6, 4],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // G#m - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'G#m-barre-E',
      frets: [4, 4, 4, 6, 6, 4],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'Abm-barre-E',
      frets: [4, 4, 4, 6, 6, 4],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // G#7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = G#, C, D#, F# (8, 0, 3, 6)
  '7': [
    {
      // E-shape barre at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ root
      // String 1 (B=11) fret 6: 11+6=17%12=5 - wrong, use fret 7: 11+7=18%12=6 (F#) ✓ m7
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      // String 5 (E=4) fret 4: 4+4=8 (G#) ✓ root
      id: 'G#7-E',
      frets: [4, 4, 5, 4, 6, 4],
      fingers: [1, 1, 2, 1, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
    {
      id: 'Ab7-E',
      frets: [4, 4, 5, 4, 6, 4],
      fingers: [1, 1, 2, 1, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
  ],

  // G#m7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C, D#, G, A#
  'm7': [
    {
      id: 'G#m7-barre',
      frets: [4, 4, 4, 4, 6, 4],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'Abm7-barre',
      frets: [4, 4, 4, 4, 6, 4],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // G#M7 - Major 7
  // Intervals: [0, 4, 7, 11] = G#, C, D#, G (8, 0, 3, 7)
  'M7': [
    {
      // E-shape barre at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ root
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 5th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M3
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓ M7
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      // String 5 (E=4) fret 4: 4+4=8 (G#) ✓ root
      id: 'G#M7-E',
      frets: [4, 4, 5, 5, 6, 4],
      fingers: [1, 1, 2, 3, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
    {
      id: 'AbM7-E',
      frets: [4, 4, 5, 5, 6, 4],
      fingers: [1, 1, 2, 3, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // G#m7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = G#, B, D, F# (8, 11, 2, 6)
  'm7-5': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓
      id: 'G#m7b5-A',
      frets: [null, 7, 7, 9, 11, null],
      fingers: [null, 1, 1, 2, 4, null],
      barreAt: 7,
      barreStrings: [1, 2],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      id: 'Abm7b5-A',
      frets: [null, 7, 7, 9, 11, null],
      fingers: [null, 1, 1, 2, 4, null],
      barreAt: 7,
      barreStrings: [1, 2],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#m-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = G#, B, D
  'm-5': [
    {
      // String 0 (E=4) fret 7: 4+7=11 (B) ✓
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓
      id: 'G#m-5-open',
      frets: [7, 3, 1, null, null, null],
      fingers: [4, 2, 1, null, null, null],
      baseFret: 1,
      muted: [false, false, false, true, true, true],
      difficulty: 'hard',
    },
    {
      id: 'Abm-5-open',
      frets: [7, 3, 1, null, null, null],
      fingers: [4, 2, 1, null, null, null],
      baseFret: 1,
      muted: [false, false, false, true, true, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // G#dim - Diminished
  // Intervals: [0, 3, 6] = G#, B, D (8, 11, 2)
  'dim': [
    {
      id: 'G#dim-5str',
      frets: [10, 12, 10, 12, 11, null],
      fingers: [1, 3, 1, 4, 2, null],
      barreAt: 10,
      barreStrings: [0, 2],
      baseFret: 10,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'G#dim-6str',
      frets: [null, 3, 4, 3, null, 4],
      fingers: [null, 1, 3, 2, null, 4],
      baseFret: 3,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
  ],

  // G#dim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = G#, B, D, F (8, 11, 2, 5)
  'dim7': [
    {
      // String 0 (E=4) fret 7: 4+7=11 (B) ✓
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓
      id: 'G#dim7-std',
      frets: [7, 6, 7, 6, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 6,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
    {
      id: 'Abdim7-std',
      frets: [7, 6, 7, 6, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 6,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // G#aug - Augmented
  // Intervals: [0, 4, 8] = G#, C, E (8, 0, 4)
  'aug': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓ #5
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ M3
      // String 2 (G=7) fret 1: 7+1=8 (G#) ✓ root
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ #5
      id: 'G#aug-1',
      frets: [0, 1, 1, 2, null, null],
      fingers: [null, 1, 1, 2, null, null],
      barreAt: 1,
      barreStrings: [1, 2] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy' as const,
    },
    {
      // E-shape augmented at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ root
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓ #5
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓ #5
      // String 5 (E=4) fret 4: 4+4=8 (G#) ✓ root
      id: 'G#aug-E',
      frets: [4, 5, 5, 6, 7, 4],
      fingers: [1, 2, 2, 3, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard' as const,
    },
    {
      id: 'Abaug-1',
      frets: [0, 1, 1, 2, null, null],
      fingers: [null, 1, 1, 2, null, null],
      barreAt: 1,
      barreStrings: [1, 2] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy' as const,
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // G#sus2 - Suspended 2
  // Intervals: [0, 2, 7] = G#, A#, D# (8, 10, 3)
  'sus2': [
    {
      // E-shape sus2 at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ root
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 5th
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ 2nd
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      // String 5 (E=4) fret 4: 4+4=8 (G#) ✓ root
      id: 'G#sus2-E',
      frets: [4, 4, 3, 6, 6, 4],
      fingers: [1, 1, 1, 3, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
    {
      id: 'Absus2-E',
      frets: [4, 4, 3, 6, 6, 4],
      fingers: [1, 1, 1, 3, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
  ],

  // G#sus4 - Suspended 4
  // Intervals: [0, 5, 7] = G#, C#, D# (8, 1, 3)
  'sus4': [
    {
      // E-shape sus4 at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ root
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 5th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ 4th
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      // String 5 (E=4) fret 4: 4+4=8 (G#) ✓ root
      id: 'G#sus4-E',
      frets: [4, 4, 6, 6, 6, 4],
      fingers: [1, 1, 3, 3, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
    {
      id: 'Absus4-E',
      frets: [4, 4, 6, 6, 6, 4],
      fingers: [1, 1, 3, 3, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
  ],

  // G#7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = G#, C#, D#, F# (omit P5 for playability)
  '7sus4': [
    {
      // Compact voicing omitting P5 (D#) for span <= 4
      // String 3 (G=7) fret 1: 7+1=8 (G#) ✓ root
      // String 4 (D=2) fret 4: 2+4=6 (F#) ✓ m7
      // String 5 (A=9) fret 4: 9+4=13%12=1 (C#) ✓ P4
      id: 'G#7sus4-A',
      frets: [null, null, 1, 4, 4, null],
      fingers: [null, null, 1, 3, 4, null],
      baseFret: 1,
      muted: [true, true, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // G#6 - Major 6
  // Intervals: [0, 4, 7, 9] = G#, C, D#, F (8, 0, 3, 5)
  '6': [
    {
      // 6弦ルート移動フォーム (Form 1)
      id: 'G#6-6str-form1',
      frets: [null, 6, 5, null, 6, 4],
      fingers: [null, 3, 2, null, 4, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 4,
      muted: [true, false, false, true, false, false],
      difficulty: 'medium',
    },
    {
      // 6弦ルート移動フォーム (Form 2)
      id: 'G#6-6str-form2',
      frets: [null, 4, 5, 3, null, 4],
      fingers: [null, 2, 3, 1, null, 2],
      barreAt: 4,
      barreStrings: [1, 5],
      baseFret: 3,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // E-shape 6 at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ root
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 6th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M3
      // String 3 (D=2) fret 5: 2+5=7 - wrong. fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      // String 5 (E=4) fret 4: 4+4=8 (G#) ✓ root
      id: 'G#6-E',
      frets: [4, 6, 5, 6, 6, 4],
      fingers: [1, 3, 2, 4, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard' as const,
    },
    {
      // Compact voicing
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 6th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      id: 'G#6-A',
      frets: [null, 6, 5, 6, 6, null],
      fingers: [null, 2, 1, 3, 4, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      id: 'Ab6-A',
      frets: [null, 6, 5, 6, 6, null],
      fingers: [null, 2, 1, 3, 4, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // G#m6 - Minor 6
  // Intervals: [0, 3, 7, 9] = G#, B, D#, F (8, 11, 3, 5)
  'm6': [
    {
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 6th
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ m3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      id: 'G#m6-A',
      frets: [null, 6, 4, 6, 6, null],
      fingers: [null, 2, 1, 3, 4, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      // E-shape at fret 4
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ root
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 6th
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ m3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      // String 5 (E=4) fret 4: 4+4=8 (G#) ✓ root
      id: 'G#m6-E',
      frets: [4, 6, 4, 6, 6, 4],
      fingers: [1, 3, 1, 4, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard' as const,
    },
    {
      id: 'Abm6-A',
      frets: [null, 6, 4, 6, 6, null],
      fingers: [null, 2, 1, 3, 4, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // G#mM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = G#, B, D#, G (8, 11, 3, 7)
  'mM7': [
    {
      // E-shape mM7 barre at fret 4
      id: 'G#mM7-E-barre',
      frets: [4, 4, 4, 5, 6, 4],
      fingers: [1, 1, 1, 2, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      // Compact voicing with root
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 5th
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ m3
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓ M7
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓ root
      id: 'G#mM7-A',
      frets: [null, 4, 4, 5, 11, null],
      fingers: [null, 1, 1, 2, 4, null],
      barreAt: 4,
      barreStrings: [1, 2] as [number, number],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard' as const,
    },
    {
      id: 'AbmM7-E-barre',
      frets: [4, 4, 4, 5, 6, 4],
      fingers: [1, 1, 1, 2, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // G#9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = G#, C, D#, F#, A# (8, 0, 3, 6, 10)
  '9': [
    {
      // Compact dom9 voicing (omit 5th)
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 9th
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ m7
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M3
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ m7
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      // Better:
      // String 1 (B=11) fret 6: 11+6=17%12=5 - wrong
      // Use A-shape root
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ 9th
      // String 2 (G=7) fret 10: 7+10=17%12=5 - wrong, fret 11: 7+11=18%12=6 (F#) ✓ m7
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓ M3
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓ root
      id: 'G#9-A',
      frets: [null, 11, 11, 10, 11, null],
      fingers: [null, 2, 3, 1, 4, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard' as const,
    },
    {
      // More practical voicing at lower frets
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 9th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 5th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M3
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ m7
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      // String 5 (E=4) fret 4: 4+4=8 (G#) ✓ root
      id: 'G#9-E',
      frets: [6, 4, 5, 4, 6, 4],
      fingers: [3, 1, 2, 1, 4, 1],
      barreAt: 4,
      barreStrings: [1, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard' as const,
    },
    {
      id: 'Ab9-A',
      frets: [null, 11, 11, 10, 11, null],
      fingers: [null, 2, 3, 1, 4, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard' as const,
    },
  ],

  // G#m9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = G#, B, D#, F#, A# (8, 11, 3, 6, 10)
  'm9': [
    {
      // String 0 (E=4) fret 11: 4+11=15%12=3 (D#) ✓ 5th
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ 9th
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ m7
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓ m3
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓ root
      id: 'G#m9-A',
      frets: [11, 11, 11, 9, 11, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 11,
      barreStrings: [0, 4],
      baseFret: 9,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#M9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = G#, C, D#, G, A# (8, 0, 3, 7, 10)
  'M9': [
    {
      id: 'G#M9-open',
      frets: [null, 11, 12, 10, 11, null],
      fingers: [null, 2, 4, 1, 3, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'G#M9-barre',
      frets: [11, 11, 12, 13, 11, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 11,
      barreStrings: [1, 5],
      baseFret: 11,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = G#, C#, D#, F#, A# (8, 1, 3, 6, 10)
  '9sus4': [
    {
      // String 0 (E=4) fret 9: 4+9=13%12=1 (C#) ✓ sus4
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ 9th
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ m7
      // String 3 (D=2) fret 11: 2+11=13%12=1 (C#) ✓ sus4
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓ root
      id: 'G#9sus4-A',
      frets: [9, 11, 11, 11, 11, null],
      fingers: [1, 2, 3, 4, 2, null],
      barreAt: 11,
      barreStrings: [1, 4],
      baseFret: 9,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#add9 - Add 9
  // Intervals: [0, 4, 7, 14] = G#, C, D#, A# (8, 0, 3, 10)
  'add9': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 9th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 5th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      // String 5 (E=4) fret 4: 4+4=8 (G#) ✓ root
      id: 'G#add9-E',
      frets: [6, 4, 5, 6, 6, 4],
      fingers: [4, 1, 2, 3, 3, 1],
      barreAt: 4,
      barreStrings: [1, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard' as const,
    },
    {
      // Compact A-shape add9
      // add9 requires: G#(8), C(0), D#(3), A#(10)
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 9th
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ 5th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ M3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ 5th
      id: 'G#add9-A',
      frets: [6, 4, 5, 6, 6, null],
      fingers: [4, 1, 2, 3, 3, null],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      id: 'Abadd9-E',
      frets: [6, 4, 5, 6, 6, 4],
      fingers: [4, 1, 2, 3, 3, 1],
      barreAt: 4,
      barreStrings: [1, 5] as [number, number],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard' as const,
    },
    {
      // G#add9-high: 4弦ルートの高位ポジション
      // 1弦(E=4)+6=10 (A#) 9th, 2弦(B=11)+4=3 (D#) 5th
      // 3弦(G=7)+5=0 (C) M3, 4弦(D=2)+6=8 (G#) root
      id: 'G#add9-high',
      frets: [6, 4, 5, 6, null, null],
      fingers: [4, 1, 2, 3, null, null],
      baseFret: 4,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // G#69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = G#, C, D#, F, A#
  // 5弦ルート移動フォーム (5弦11フレット = G#)
  '69': [
    {
      id: 'G#69-A',
      frets: [11, 11, 10, 10, 11, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 10,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ab69-A',
      frets: [11, 11, 10, 10, 11, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 10,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // G#m69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = G#, B, D#, F, A#
  'm69': [
    {
      // フォーム1: 低フレット
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓ 9th
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓ 6th
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓ m3
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓ root
      id: 'G#m69-form1',
      frets: [null, 11, 10, 9, 11, null],
      fingers: [null, 3, 2, 1, 4, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // フォーム2: 低いポジション
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 9th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 6th
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ m3
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ root
      id: 'G#m69-form2',
      frets: [6, 6, 4, 6, null, null],
      fingers: [2, 3, 1, 4, null, null],
      baseFret: 4,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // G#-5 - Major flat 5
  // Intervals: [0, 4, 6] = G#, C, D
  '-5': [
    {
      // Compact voicing using lower frets
      // String 2 (B=11) fret 1: 11+1=12%12=0 (C) ✓ M3
      // String 3 (G=7) fret 1: 7+1=8 (G#) ✓ root
      // String 4 (D=2) fret 0: 2+0=2 (D) ✓ b5
      id: 'G#-5-A',
      frets: [null, 1, 1, 0, null, null],
      fingers: [null, 1, 2, null, null, null],
      baseFret: 1,
      muted: [true, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // G#7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = G#, C, D, F# (8, 0, 2, 6)
  '7-5': [
    {
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ M3
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ m7
      // String 3 (D=2) fret 12: 2+12=14%12=2 (D) ✓ b5
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓ root
      id: 'G#7-5-1',
      frets: [null, 1, 11, 12, 11, null],
      fingers: [null, 1, 2, 4, 3, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      id: 'Ab7-5-1',
      frets: [null, 1, 11, 12, 11, null],
      fingers: [null, 1, 2, 4, 3, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = G#, C, E, F# (8, 0, 4, 6)
  '7+5': [
    {
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ M3
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ m7
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ #5
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓ root
      id: 'G#7+5-1',
      frets: [null, 1, 11, 2, 11, null],
      fingers: [null, 1, 3, 2, 4, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      id: 'Ab7+5-1',
      frets: [null, 1, 11, 2, 11, null],
      fingers: [null, 1, 3, 2, 4, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#M7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = G#, C, D, G (8, 0, 2, 7)
  'M7-5': [
    {
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ M3
      // String 2 (G=7) fret 12: 7+12=19%12=7 (G) ✓ M7
      // String 3 (D=2) fret 12: 2+12=14%12=2 (D) ✓ b5
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓ root
      id: 'G#M7-5-1',
      frets: [null, 1, 12, 12, 11, null],
      fingers: [null, 1, 3, 4, 2, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      id: 'AbM7-5-1',
      frets: [null, 1, 12, 12, 11, null],
      fingers: [null, 1, 3, 4, 2, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#m7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = G#, B, E, F# (8, 11, 4, 6)
  'm7+5': [
    {
      // String 1 (B=11) fret 12: 11+12=23%12=11 (B) ✓
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓
      // String 3 (D=2) fret 14: 2+14=16%12=4 (E) ✓
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓
      id: 'G#m7+5-1',
      frets: [null, 12, 11, 14, 11, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 11,
      barreStrings: [2, 4],
      baseFret: 11,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Abm7+5-1',
      frets: [null, 12, 11, 14, 11, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 11,
      barreStrings: [2, 4],
      baseFret: 11,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // G#7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = G#, C, D#, F#, B# (8, 0, 3, 6, 11)
  '7+9': [
    {
      // String 1 (B=11) fret 12: 11+12=23%12=11 (B#) ✓
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓
      id: 'G#7+9-1',
      frets: [null, 12, 11, 10, 11, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ab7+9-1',
      frets: [null, 12, 11, 10, 11, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // G#4.4 - Quartal chord (G#-C#-F#)
  // Intervals: [0, 5, 10] = G#, C#, F# (8, 1, 6)
  '4.4': [
    {
      // String 1 (B=11) fret 14: 11+14=25%12=1 (C#) ✓
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓
      // String 3 (D=2) fret 11: 2+11=13%12=1 (C#) ✓
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓
      id: 'G#4.4-1',
      frets: [null, 14, 11, 11, 11, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 11,
      barreStrings: [2, 4],
      baseFret: 11,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ab4.4-1',
      frets: [null, 14, 11, 11, 11, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 11,
      barreStrings: [2, 4],
      baseFret: 11,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // G#blk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = G#, A#, D, F# (8, 10, 2, 6)
  'blk': [
    {
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓
      // String 4 (A=9) fret 11: 9+11=20%12=8 (G#) ✓
      id: 'G#blk-A',
      frets: [null, 11, 7, 4, 11, null],
      fingers: [null, 2, 1, 1, 3, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      id: 'Abblk-A',
      frets: [null, 11, 7, 4, 11, null],
      fingers: [null, 2, 1, 1, 3, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // パワーコード (1種)
  // ============================================

  // G#5 - Power Chord (root + P5)
  // Intervals: [0, 7] = G#, D#
  '5': [
    {
      id: 'G#5-power5',
      frets: [null, null, null, 13, 11, null],
      fingers: [null, null, null, 3, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 11,
      muted: [true, true, true, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'G#5-power6',
      frets: [null, null, null, null, 6, 4],
      fingers: [null, null, null, null, 3, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 4,
      muted: [true, true, true, true, false, false],
      difficulty: 'easy',
    },
  ],

};

// G#ルートの分数コード（10パターン）
// G# = MIDI 8, Major triad = [8, 0, 3] = G#, C, D#
// Minor triad = [8, 11, 3] = G#, B, D#
// Minor7 = [8, 11, 3, 6] = G#, B, D#, F#
export const GS_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // G#/A# - G# major with A# bass (interval 2)
  // G#=8, C=0, D#=3, Bass A#=10
  // String 5 (A=9): for A#(10): fret = (10-9+12)%12 = 1 ✓ (BASS)
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for D#(3): fret = (3-7+12)%12 = 8 → span too big
  // Better: barre at 4
  // String 6 (E=4): for A#(10): fret = (10-4+12)%12 = 6 ✓ (BASS)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 ✓
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for C(0): fret = (0-7+12)%12 = 5 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'major/2': [
    {
      id: 'G#-major-2-1',
      frets: [4, 4, 5, 6, 6, 6],
      fingers: [1, 1, 2, 3, 3, 4],
      barreAt: 4,
      barreStrings: [0, 1],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // G#/C - G# major with C bass (interval 4 = M3rd)
  // G#=8, C=0, D#=3, Bass C=0 (already in chord)
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓ (BASS)
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for C(0): fret = (0-7+12)%12 = 5 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'major/4': [
    {
      id: 'G#-major-4-1',
      frets: [4, 4, 5, 6, 3, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 1],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // G#/C# - G# major with C# bass (interval 5 = P4th)
  // G#=8, C=0, D#=3, Bass C#=1 (not in chord)
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓ (BASS)
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for C(0): fret = (0-7+12)%12 = 5 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'major/5': [
    {
      id: 'G#-major-5-1',
      frets: [4, 4, 5, 6, 4, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // G#/D# - G# major with D# bass (interval 7)
  // G#=8, C=0, D#=3, Bass=D#(3)
  // String 6 (E=4) fret 4: 4+4=8 (G#) ✓
  // String 5 (A=9) fret 3: 9+3=12%12=0 (C) ✓
  // String 4 (D=2) fret 1: 2+1=3 (D#) ✓ Bass
  // String 3 (G=7) fret 1: 7+1=8 (G#) ✓
  // String 2 (B=11) fret 1: 11+1=12%12=0 (C) ✓
  // String 1 (E=4) fret 4: 4+4=8 (G#) ✓
  'major/5th': [
    {
      id: 'Gs-major-5th-1',
      frets: [4, 1, 1, 1, 3, 4],
      fingers: [4, 1, 1, 1, 3, 4],
      barreAt: 1,
      barreStrings: [1, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // G#/G - G# major with G bass (interval 11 = maj7th)
  // G#=8, C=0, D#=3, Bass G=7
  // String 6 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓ (BASS)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 ✓
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for C(0): fret = (0-7+12)%12 = 5 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'major/7': [
    {
      id: 'G#-major-7-1',
      frets: [4, 4, 5, 6, 6, 3],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 1],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // G#/F - G# major with F bass (interval 9 = 6th)
  // G#=8, C=0, D#=3, Bass F=5
  // String 6 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓ (BASS)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 → span too big
  // Better: use string 5 as bass
  // String 5 (A=9): for F(5): fret = (5-9+12)%12 = 8 ✓ (BASS)
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for C(0): fret = (0-7+12)%12 = 5 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 → span=4
  // Alternative: higher voicing
  // String 5 (A=9): for F(5): fret = 8 ✓ (BASS)
  // String 4 (D=2): for C(0): fret = (0-2+12)%12 = 10 → span too big
  // Try E-shape at fret 4:
  // String 6 (E=4): for F(5): fret = 1 ✓ (BASS)
  // String 5 muted, String 4 (D=2): G#(8): fret 6
  // String 3 (G=7): C(0): fret 5
  // String 2 (B=11): D#(3): fret 4
  // String 1 (E=4): G#(8): fret 4 → span from 1-6 is 5, too big
  // Better: compact
  // String 5 (A=9): F(5): fret 8 ✓ (BASS)
  // String 4 (D=2): G#(8): fret 6 ✓
  // String 3 (G=7): D#(3): fret 8 ✓
  // String 2 (B=11): G#(8): fret 9 ✓ span=3
  // String 1 (E=4): C(0): fret 8 ✓
  'major/9': [
    {
      id: 'G#-major-9-1',
      frets: [8, 9, 8, 6, 8, null],
      fingers: [2, 4, 2, 1, 3, null],
      barreAt: 8,
      barreStrings: [0, 2],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#/F# - G# major with F# bass (interval 10 = min7th)
  // G#=8, C=0, D#=3, Bass F#=6
  // String 6 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓ (BASS)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 → span=4
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for C(0): fret = (0-7+12)%12 = 5 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'major/10': [
    {
      id: 'G#-major-10-1',
      frets: [4, 4, 5, 6, 6, 2],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 1],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // マイナー分数 (2種)
  // G#m/B - G#m with B bass (interval 3 = min3rd)
  // G#m = [8, 11, 3] = G#, B, D#, Bass B=11
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓ (BASS)
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for D#(3): fret = (3-7+12)%12 = 8 → span too big
  // Better voicing:
  // String 5 (A=9): for B(11): fret = 2 ✓ (BASS)
  // String 4 (D=2): for D#(3): fret = (3-2+12)%12 = 1 ✓
  // String 3 (G=7): for G#(8): fret = (8-7+12)%12 = 1 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'minor/3': [
    {
      id: 'G#-minor-3-1',
      frets: [4, 4, 1, 1, 2, null],
      fingers: [3, 4, 1, 1, 2, null],
      barreAt: 1,
      barreStrings: [2, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // G#m/D# - G#m with D# bass (interval 7 = 5th)
  // G#m = [8, 11, 3] = G#, B, D#, Bass D#=3
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 ✓ (BASS)
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'minor/7': [
    {
      id: 'G#-minor-7-1',
      frets: [4, 4, 4, 6, 6, null],
      fingers: [1, 1, 1, 4, 3, null],
      barreAt: 4,
      barreStrings: [0, 2],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // マイナー7分数 (2種)
  // G#m7/D# - G#m7 with D# bass (interval 7 = 5th)
  // G#m7 = [8, 11, 3, 6] = G#, B, D#, F#, Bass D#=3
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 ✓ (BASS)
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for F#(6): fret = (6-11+12)%12 = 7 → span=3
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'minor7/5': [
    {
      id: 'G#-minor7-5-1',
      frets: [4, 7, 4, 6, 6, null],
      fingers: [1, 4, 1, 3, 2, null],
      barreAt: 4,
      barreStrings: [0, 2],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#m7/F# - G#m7 with F# bass (interval 10 = min7th)
  // G#m7 = [8, 11, 3, 6] = G#, B, D#, F#, Bass F#=6
  // String 6 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓ (BASS)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 → span=4, ok
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'minor7/10': [
    {
      id: 'G#-minor7-10-1',
      frets: [4, 4, 4, 6, 6, 2],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 2],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

};
