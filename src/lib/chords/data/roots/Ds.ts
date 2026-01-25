/**
 * CaT4G - D# Root Chord Data
 * D#ルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * D# = MIDI 3
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// D#ルートの基本コード（31品質）
export const DS_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // D# Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'D#-barre-A',
      frets: [6, 8, 8, 8, 6, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Eb-barre-A',
      frets: [6, 8, 8, 8, 6, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#m - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'D#m-barre-A',
      frets: [6, 7, 8, 8, 6, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebm-barre-A',
      frets: [6, 7, 8, 8, 6, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = D#, G, A#, C# (3, 7, 10, 1)
  '7': [
    {
      // A-shape barre at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 5th
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ M3
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ m7
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ 5th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#7-barre-A',
      frets: [6, 8, 6, 8, 6, null],
      fingers: [1, 3, 1, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Eb7-barre-A',
      frets: [6, 8, 6, 8, 6, null],
      fingers: [1, 3, 1, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#m7 - Minor 7
  // Intervals: [0, 3, 7, 10] = D#, F#, A#, C# (3, 6, 10, 1)
  // Verification: [6,7,6,8,6,x] → A#(10),F#(6),C#(1),A#(10),D#(3) ✓
  'm7': [
    {
      id: 'D#m7-barre',
      frets: [6, 7, 6, 8, 6, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebm7-barre',
      frets: [6, 7, 6, 8, 6, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#M7 - Major 7
  // Intervals: [0, 4, 7, 11] = D#, G, A#, D (3, 7, 10, 2)
  'M7': [
    {
      // A-shape at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 5th
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ M3
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓ M7
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ 5th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#M7-barre-A',
      frets: [6, 8, 7, 8, 6, null],
      fingers: [1, 3, 2, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'EbM7-barre-A',
      frets: [6, 8, 7, 8, 6, null],
      fingers: [1, 3, 2, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // D#m7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = D#, F#, A, C# (D#=3, F#=6, A=9, C#=1)
  'm7-5': [
    {
      // Open-ish position
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓
      id: 'D#m7b5-open',
      frets: [2, 2, 2, 1, null, null],
      fingers: [2, 3, 4, 1, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#m7b5-A',
      frets: [null, 7, 6, 7, 6, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // Enharmonic: Ebm7b5
      id: 'Ebm7b5-A',
      frets: [null, 7, 6, 7, 6, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#m-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = D#, F#, A
  'm-5': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#m-5-A',
      frets: [null, 7, 8, 7, 6, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebm-5-A',
      frets: [null, 7, 8, 7, 6, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // D#dim - Diminished
  // Intervals: [0, 3, 6] = D#, F#, A (3, 6, 9)
  'dim': [
    {
      // Open-ish position
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ m3
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) - skip, use another
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ b5
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓ root
      id: 'D#dim-open',
      frets: [2, null, 2, 1, null, null],
      fingers: [2, null, 3, 1, null, null],
      baseFret: 1,
      muted: [false, true, false, false, true, true],
      difficulty: 'easy',
    },
    {
      // A-shape at fret 6
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ m3
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ root
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓ b5
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#dim-A',
      frets: [null, 7, 8, 7, 6, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebdim-A',
      frets: [null, 7, 8, 7, 6, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#dim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = D#, F#, A, C (D#=3, F#=6, A=9, C=0)
  'dim7': [
    {
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓
      id: 'D#dim7-open',
      frets: [2, 1, 2, 1, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
    {
      id: 'Ebdim7-open',
      frets: [2, 1, 2, 1, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // D#aug - Augmented
  // Intervals: [0, 4, 8] = D#, G, B (3, 7, 11)
  'aug': [
    {
      // Open position
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓ M3
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓ #5
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ M3
      // String 3 (D=2) fret 1: 2+1=3 (D#) ✓ root
      id: 'D#aug-open',
      frets: [3, 0, 0, 1, null, null],
      fingers: [4, 0, 0, 1, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
    {
      // A-shape at fret 3
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓ M3
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ root
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓ #5
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓ M3
      id: 'D#aug-A',
      frets: [3, 4, 4, 5, null, null],
      fingers: [1, 2, 3, 4, null, null],
      baseFret: 3,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
    {
      id: 'Ebaug-A',
      frets: [3, 4, 4, 5, null, null],
      fingers: [1, 2, 3, 4, null, null],
      baseFret: 3,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // D#sus2 - Suspended 2
  // Intervals: [0, 2, 7] = D#, F, A# (3, 5, 10)
  'sus2': [
    {
      // A-shape at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 5th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 2nd
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ root
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ 5th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#sus2-barre-A',
      frets: [6, 6, 8, 8, 6, null],
      fingers: [1, 1, 3, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebsus2-barre-A',
      frets: [6, 6, 8, 8, 6, null],
      fingers: [1, 1, 3, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#sus4 - Suspended 4
  // Intervals: [0, 5, 7] = D#, G#, A# (3, 8, 10)
  'sus4': [
    {
      // A-shape at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 5th
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓ 4th
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ root
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ 5th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#sus4-barre-A',
      frets: [6, 9, 8, 8, 6, null],
      fingers: [1, 4, 2, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebsus4-barre-A',
      frets: [6, 9, 8, 8, 6, null],
      fingers: [1, 4, 2, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = D#, G#, A#, C#
  '7sus4': [
    {
      // String 1 (E=4) fret 4: 4+4=8 (G#) ✓ P4
      // String 2 (B=11) fret 4: 11+4=15%12=3 (D#) ✓ root
      // String 3 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ m7
      // String 4 (D=2) fret 8: 2+8=10 (A#) ✓ P5
      // String 5 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#7sus4-A',
      frets: [4, 4, 6, 8, 6, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 4,
      barreStrings: [0, 1],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // D#6 - Major 6
  // Intervals: [0, 4, 7, 9] = D#, G, A#, C (3, 7, 10, 0)
  '6': [
    {
      // A-shape at fret 6
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 6th
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ M3
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ root
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ 5th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#6-barre-A',
      frets: [8, 8, 8, 8, 6, null],
      fingers: [2, 2, 2, 2, 1, null],
      barreAt: 8,
      barreStrings: [0, 3],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Eb6-barre-A',
      frets: [8, 8, 8, 8, 6, null],
      fingers: [2, 2, 2, 2, 1, null],
      barreAt: 8,
      barreStrings: [0, 3],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#m6 - Minor 6
  // Intervals: [0, 3, 7, 9] = D#, F#, A#, C (3, 6, 10, 0)
  'm6': [
    {
      // A-shape at fret 6
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 6th
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ m3
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ root
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ 5th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#m6-barre-A',
      frets: [8, 7, 8, 8, 6, null],
      fingers: [3, 2, 3, 3, 1, null],
      barreAt: 8,
      barreStrings: [0, 3],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebm6-barre-A',
      frets: [8, 7, 8, 8, 6, null],
      fingers: [3, 2, 3, 3, 1, null],
      barreAt: 8,
      barreStrings: [0, 3],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // D#mM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = D#, F#, A#, D (3, 6, 10, 2)
  'mM7': [
    {
      // A-shape at fret 6
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 5th
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ m3
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓ M7
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ 5th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#mM7-barre-A',
      frets: [6, 7, 7, 8, 6, null],
      fingers: [1, 2, 3, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'EbmM7-barre-A',
      frets: [6, 7, 7, 8, 6, null],
      fingers: [1, 2, 3, 4, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // D#9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = D#, G, A#, C#, F (3, 7, 10, 1, 5)
  '9': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 5th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓ 9th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ m7
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓ M3
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#9-A',
      frets: [6, 6, 6, 5, 6, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Eb9-A',
      frets: [6, 6, 6, 5, 6, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#m9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = D#, F#, A#, C#, E# (3, 6, 10, 1, 5)
  'm9': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 5th
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F/E#) ✓ 9th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ m7
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ m3
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#m9-A',
      frets: [6, 6, 6, 4, 6, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#M9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = D#, G, A#, D, E# (3, 7, 10, 2, 5)
  'M9': [
    {
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓ M3
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ M7
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓ 5th
      // String 3 (D=2) fret 3: 2+3=5 (F/E#) ✓ 9th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#M9-A',
      frets: [3, 3, 3, 3, 6, null],
      fingers: [1, 1, 1, 1, 4, null],
      barreAt: 3,
      barreStrings: [0, 3],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = D#, G#, A#, C#, E# (3, 8, 10, 1, 5)
  '9sus4': [
    {
      // String 0 (E=4) fret 4: 4+4=8 (G#) ✓ sus4
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F/E#) ✓ 9th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ m7
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓ sus4
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#9sus4-A',
      frets: [4, 6, 6, 6, 6, null],
      fingers: [1, 2, 3, 4, 2, null],
      barreAt: 6,
      barreStrings: [1, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#add9 - Add 9
  // Intervals: [0, 4, 7, 14] = D#, G, A#, F (3, 7, 10, 5)
  'add9': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 5th
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ M3
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ root
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ 9th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#add9-A',
      frets: [6, 8, 8, 3, 6, null],
      fingers: [2, 3, 4, 1, 2, null],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebadd9-A',
      frets: [6, 8, 8, 3, 6, null],
      fingers: [2, 3, 4, 1, 2, null],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // D#69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = D#, G, A#, C, F
  '69': [
    {
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#69-A',
      frets: [3, 6, 5, 5, 6, null],
      fingers: [1, 3, 2, 2, 4, null],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Eb69-A',
      frets: [3, 6, 5, 5, 6, null],
      fingers: [1, 3, 2, 2, 4, null],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#m69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = D#, F#, A#, C, F
  'm69': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#m69-A',
      frets: [null, 7, 5, 3, 6, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebm69-A',
      frets: [null, 7, 5, 3, 6, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // D#-5 - Major flat 5
  // Intervals: [0, 4, 6] = D#, G, A
  '-5': [
    {
      // String 2 (B=11) fret 8: 11+8=19%12=7 (G) ✓ M3
      // String 3 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ root
      // String 4 (D=2) fret 7: 2+7=9 (A) ✓ b5
      // String 5 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      id: 'D#-5-A',
      frets: [null, 8, 8, 7, 6, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = D#, G, A, C# (D#=3, G=7, A=9, C#=1)
  '7-5': [
    {
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#7-5-1',
      frets: [null, 8, 6, 7, 6, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = D#, G, B, C# (D#=3, G=7, B=11, C#=1)
  '7+5': [
    {
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#7+5-1',
      frets: [null, 8, 6, 9, 6, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#M7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = D#, G, A, D (D#=3, G=7, A=9, D=2)
  'M7-5': [
    {
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#M7-5-1',
      frets: [null, 8, 7, 7, 6, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#m7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = D#, F#, B, C# (3, 6, 11, 1)
  'm7+5': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#m7+5-1',
      frets: [null, 7, 6, 9, 6, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 6,
      barreStrings: [2, 4],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = D#, G, A#, C#, F## (3, 7, 10, 1, 6)
  '7+9': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F##=G) - need 6
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F##) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#7+9-1',
      frets: [null, 7, 6, 5, 6, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // D#4.4 - Quartal chord (D#-G#-C#)
  // Intervals: [0, 5, 10] = D#, G#, C# (3, 8, 1)
  '4.4': [
    {
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#4.4-1',
      frets: [null, 9, 6, 6, 6, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 6,
      barreStrings: [2, 4],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#blk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = D#, F, A, C# (D#=3, F=5, A=9, C#=1)
  'blk': [
    {
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      id: 'D#blk-A',
      frets: [null, 6, 6, 7, 6, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 6,
      barreStrings: [1, 4],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Ebblk-A',
      frets: [null, 6, 6, 7, 6, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 6,
      barreStrings: [1, 4],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

};

// D#ルートの分数コード（10パターン）
// D# = MIDI 3, Major triad = [3, 7, 10] = D#, G, A#
export const DS_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // D#/F - D# major with F bass (interval 2)
  // D#=3, G=7, A#=10, Bass F=5
  'major/2': [
    {
      // Barre chord at fret 8
      // String 1 (E=4) fret 6: 4+6=10 (A#) ✓
      // String 2 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 3 (G=7) fret 8: 7+8=15%12=3 (D#) ✓
      // String 4 (D=2) fret 8: 2+8=10 (A#) ✓
      // String 5 (A=9) fret 8: 9+8=17%12=5 (F) ✓ Bass
      id: 'Ds-major-2-1',
      frets: [6, 8, 8, 8, 8, null],
      fingers: [1, 3, 3, 3, 3, null],
      barreAt: 8,
      barreStrings: [1, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],
  // D#/G - D# major with G bass (interval 4)
  // D#=3, G=7, A#=10, Bass G=7
  'major/4': [
    {
      // G bass on string 6 fret 3
      // String 1 (E=4) fret 3: 4+3=7 (G) ✓
      // String 2 (B=11) fret 4: 11+4=15%12=3 (D#) ✓
      // String 3 (G=7) fret 3: 7+3=10 (A#) ✓
      // String 4 (D=2) fret 5: 2+5=7 (G) ✓
      // String 5 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      // String 6 (E=4) fret 3: 4+3=7 (G) ✓ Bass
      id: 'Ds-major-4-1',
      frets: [3, 4, 3, 5, 6, 3],
      fingers: [1, 2, 1, 3, 4, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],
  // D#/G# - D# major with G# bass (interval 5)
  // D#=3, G=7, A#=10, Bass G#=8
  'major/5': [
    {
      // G# bass on string 6 fret 4
      // String 1 (E=4) fret 3: 4+3=7 (G) ✓
      // String 2 (B=11) fret 4: 11+4=15%12=3 (D#) ✓
      // String 3 (G=7) fret 3: 7+3=10 (A#) ✓
      // String 4 (D=2) fret 5: 2+5=7 (G) ✓
      // String 5 (A=9) fret 6: 9+6=15%12=3 (D#) ✓
      // String 6 (E=4) fret 4: 4+4=8 (G#) ✓ Bass
      id: 'Ds-major-5-1',
      frets: [3, 4, 3, 5, 6, 4],
      fingers: [1, 2, 1, 3, 4, 2],
      barreAt: 3,
      barreStrings: [0, 2],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // D#/A# - D# major with A# bass (interval 7)
  // D#=3, G=7, A#=10, Bass=A#(10)
  // String 5 (A=9) fret 1: 9+1=10 (A#) ✓ Bass
  // String 4 (D=2) fret 1: 2+1=3 (D#) ✓
  // String 3 (G=7) fret 3: 7+3=10 (A#) ✓
  // String 2 (B=11) fret 4: 11+4=15%12=3 (D#) ✓
  // String 1 (E=4) fret 3: 4+3=7 (G) ✓
  'major/5th': [
    {
      id: 'Ds-major-5th-1',
      frets: [3, 4, 3, 1, 1, null],
      fingers: [2, 4, 3, 1, 1, null],
      barreAt: 1,
      barreStrings: [3, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#/D - D# major with D bass (interval 11 from D# = 3+11=14%12=2)
  // D#=3, G=7, A#=10, Bass=D(2)
  // String 5 (A=9): for D(2): fret = (2-9+12)%12 = 5 ✓
  // String 4 (D=2): for G(7): fret = (7-2+12)%12 = 5 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓
  'major/7': [
    {
      id: 'Ds-major-7-1',
      frets: [3, 4, 3, 5, 5, null],
      fingers: [1, 2, 1, 3, 4, null],
      barreAt: 3,
      barreStrings: [0, 2],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#/C - D# major with C bass (interval 9 from D# = 3+9=12%12=0)
  // D#=3, G=7, A#=10, Bass=C(0)
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓
  // String 4 (D=2): for G(7): fret = (7-2+12)%12 = 5 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓
  'major/9': [
    {
      id: 'Ds-major-9-1',
      frets: [3, 4, 3, 5, 3, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#/C# - D# major with C# bass (interval 10 from D# = 3+10=13%12=1)
  // D#=3, G=7, A#=10, Bass=C#(1)
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓
  // String 4 (D=2): for G(7): fret = (7-2+12)%12 = 5 ✓
  // String 3 (G=7): for A#(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for D#(3): fret = (3-11+12)%12 = 4 ✓
  // String 1 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓
  'major/10': [
    {
      id: 'Ds-major-10-1',
      frets: [3, 4, 3, 5, 4, null],
      fingers: [1, 2, 1, 4, 3, null],
      barreAt: 3,
      barreStrings: [0, 2],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // マイナー分数 (2種)
  // D#m/F# - Minor with bass on minor 3rd (interval 3)
  // D#m = D#(3), F#(6), A#(10), Bass = F#(6)
  'minor/3': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ m3
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ root
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ 5th
      // String 4 (A=9) fret 9: 9+9=18%12=6 (F#) ✓ BASS
      id: 'Ds-minor-3-1',
      frets: [null, 7, 8, 8, 9, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Eb-minor-3-1',
      frets: [null, 7, 8, 8, 9, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],
  // D#m/A# - Minor with bass on 5th (interval 7)
  // D#m = D#(3), F#(6), A#(10), Bass = A#(10)
  'minor/7': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (A#) ✓ 5th
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ m3
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓ root
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓ 5th
      // String 4 (A=9) fret 6: 9+6=15%12=3 (D#) ✓ root
      // String 5 (E=4) fret 6: 4+6=10 (A#) ✓ BASS
      id: 'Ds-minor-7-1',
      frets: [6, 7, 8, 8, 6, 6],
      fingers: [1, 2, 4, 3, 1, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'Eb-minor-7-1',
      frets: [6, 7, 8, 8, 6, 6],
      fingers: [1, 2, 4, 3, 1, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // マイナー7分数 (2種)
  // D#m7/A# - D#m7 with A#(5th) in bass
  // D#m7 = D#(3), F#(6), A#(10), C#(1)
  'minor7/5': [
    {
      // String 6 (E=4): fret 6 → 4+6=10 (A#) ✓ 5th (BASS)
      // String 5 (A=9): fret 6 → 9+6=15%12=3 (D#) ✓ root
      // String 4 (D=2): fret 4 → 2+4=6 (F#) ✓ m3
      // String 3 (G=7): fret 6 → 7+6=13%12=1 (C#) ✓ m7
      // String 2 (B=11): fret 7 → 11+7=18%12=6 (F#) ✓ m3
      id: 'Ds-minor7-5-1',
      frets: [null, 7, 6, 4, 6, 6],
      fingers: [null, 4, 2, 1, 3, 3],
      barreAt: 6,
      barreStrings: [4, 5],
      baseFret: 4,
      muted: [true, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // D#m7/C# - D#m7 with C#(m7) in bass
  // D#m7 = D#(3), F#(6), A#(10), C#(1)
  'minor7/10': [
    {
      // String 5 (A=9): fret 4 → 9+4=13%12=1 (C#) ✓ m7 (BASS)
      // String 4 (D=2): fret 1 → 2+1=3 (D#) ✓ root
      // String 3 (G=7): fret 3 → 7+3=10 (A#) ✓ 5th
      // String 2 (B=11): fret 2 → 11+2=13%12=1 (C#) ✓ m7
      // String 1 (E=4): fret 2 → 4+2=6 (F#) ✓ m3
      id: 'Ds-minor7-10-1',
      frets: [2, 2, 3, 1, 4, null],
      fingers: [1, 1, 3, 1, 4, null],
      barreAt: 1,
      barreStrings: [0, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

};
