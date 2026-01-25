/**
 * CaT4G - D Root Chord Data
 * Dルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * D = MIDI 2
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// Dルートの基本コード（31品質）
export const D_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // D Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'D-open',
      frets: [2, 3, 2, 0, null, null],
      fingers: [1, 3, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
    {
      id: 'D-barre-A',
      frets: [5, 7, 7, 7, 5, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 5,
      barreStrings: [0, 4],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'D-barre-E',
      frets: [10, 10, 11, 12, 12, 10],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 10,
      barreStrings: [0, 5],
      baseFret: 10,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // Dm - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'Dm-open',
      frets: [1, 3, 2, 0, null, null],
      fingers: [1, 3, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
    {
      id: 'Dm-barre-A',
      frets: [5, 6, 7, 7, 5, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 5,
      barreStrings: [0, 4],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Dm-barre-E',
      frets: [10, 10, 10, 12, 12, 10],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 10,
      barreStrings: [0, 5],
      baseFret: 10,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // D7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = C, E, G, A#
  '7': [
    {
      id: 'D7-open',
      frets: [2, 1, 2, 0, null, null],
      fingers: [3, 1, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // Dm7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C, D#, G, A#
  'm7': [
    {
      id: 'Dm7-open',
      frets: [1, 1, 2, 0, null, null],
      fingers: [1, 1, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // DM7 - Major 7
  // Intervals: [0, 4, 7, 11] = C, E, G, B
  'M7': [
    {
      id: 'DM7-open',
      frets: [2, 2, 2, 0, null, null],
      fingers: [1, 2, 3, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // Dm7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = D, F, Ab, C (D=2, F=5, Ab=8, C=0)
  'm7-5': [
    {
      // Open position
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 2 (G=7) fret 1: 7+1=8 (Ab) ✓
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓
      id: 'Dm7b5-open',
      frets: [1, 1, 1, 0, null, null],
      fingers: [1, 1, 1, null, null, null],
      barreAt: 1,
      barreStrings: [0, 2],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
    {
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 6: 2+6=8 (Ab) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'Dm7b5-A',
      frets: [null, 6, 5, 6, 5, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Dm-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = D, F, Ab
  'm-5': [
    {
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓
      // String 1 (B=11) fret 1: 11+1=12%12=0 - wait, need Ab=8
      // Better voicing:
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 6: 2+6=8 (Ab) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'Dm-5-A',
      frets: [null, 6, 7, 6, 5, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // Ddim - Diminished
  // Intervals: [0, 3, 6] = C, D#, F#
  'dim': [
    {
      id: 'Ddim-open',
      frets: [1, 3, 1, null, null, null],
      fingers: [1, 3, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, true, true, true],
      difficulty: 'easy',
    },
  ],

  // Ddim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = D, F, Ab, B (D=2, F=5, Ab=8, B=11)
  'dim7': [
    {
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓
      // String 2 (G=7) fret 1: 7+1=8 (Ab) ✓
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓
      id: 'Ddim7-open',
      frets: [1, 0, 1, 0, null, null],
      fingers: [1, null, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // Daug - Augmented
  // Intervals: [0, 4, 8] = C, E, G#
  'aug': [
    {
      id: 'Daug-open',
      frets: [2, 3, 3, 0, null, null],
      fingers: [1, 2, 3, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // Dsus2 - Suspended 2
  // Intervals: [0, 2, 7] = C, D, G
  'sus2': [
    {
      id: 'Dsus2-open',
      frets: [0, 3, 2, 0, null, null],
      fingers: [null, 3, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // Dsus4 - Suspended 4
  // Intervals: [0, 5, 7] = C, F, G
  'sus4': [
    {
      id: 'Dsus4-open',
      frets: [3, 3, 2, 0, null, null],
      fingers: [3, 4, 1, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // D7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = D, G, A, C
  '7sus4': [
    {
      // String 1 (E=4) fret 3: 4+3=7 (G) ✓ P4
      // String 2 (B=11) fret 3: 11+3=14%12=2 (D) ✓ root
      // String 3 (G=7) fret 5: 7+5=12%12=0 (C) ✓ m7
      // String 4 (D=2) fret 7: 2+7=9 (A) ✓ P5
      // String 5 (A=9) fret 5: 9+5=14%12=2 (D) ✓ root
      id: 'D7sus4-A',
      frets: [3, 3, 5, 7, 5, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 3,
      barreStrings: [0, 1],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // D6 - Major 6
  // Intervals: [0, 4, 7, 9] = D, F#, A, B
  // Verification: [2,0,2,0,x,x] → F#(6),B(11),A(9),D(2) ✓
  '6': [
    {
      id: 'D6-open',
      frets: [2, 0, 2, 0, null, null],
      fingers: [1, null, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // Dm6 - Minor 6
  // Intervals: [0, 3, 7, 9] = D, F, A, B
  // Verification: [1,0,2,0,x,x] → F(5),B(11),A(9),D(2) ✓
  'm6': [
    {
      id: 'Dm6-open',
      frets: [1, 0, 2, 0, null, null],
      fingers: [1, null, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // DmM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = D, F, A, C#
  // Verification: [1,2,2,0,x,x] → F(5),C#(1),A(9),D(2) ✓
  'mM7': [
    {
      id: 'DmM7-open',
      frets: [1, 2, 2, 0, null, null],
      fingers: [1, 2, 3, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // D9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = D, F#, A, C, E
  // Verification: [5,5,5,4,5,x] → A(9),E(4),C(0),F#(6),D(2) ✓
  '9': [
    {
      id: 'D9-barre',
      frets: [5, 5, 5, 4, 5, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 5,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Dm9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = D, F, A, C, E (2, 5, 9, 0, 4)
  'm9': [
    {
      // Open position - includes F(5) for complete chord
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ m3
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ m7
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ 5th
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ root
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓ 9th
      // Simpler voicing without 5th:
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ m3
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ m7
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ 5th (optional)
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ root
      // Needs E for 9th - use higher position
      // Better: barre position at fret 5
      // String 0 (E=4) fret 5: 4+5=9 (A) ✓ 5th
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓ 9th
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓ m7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ m3
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓ root
      id: 'Dm9-barre',
      frets: [5, 5, 5, 3, 5, null],
      fingers: [1, 1, 1, 2, 1, null],
      barreAt: 5,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // DM9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = D, F#, A, C#, E (2, 6, 9, 1, 4)
  'M9': [
    {
      // Position voicing - includes F#(6) for complete chord
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ M3
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ M7
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ 5th
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ root
      // Missing E(4) 9th - add with open string or different voicing
      // Better: use strings 1-5 for full voicing
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓ 9th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ M7
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓ M3
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓ root
      id: 'DM9-pos',
      frets: [null, 5, 6, 4, 5, null],
      fingers: [null, 2, 4, 1, 3, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = D, G, A, C, E (2, 7, 9, 0, 4)
  '9sus4': [
    {
      // Open position
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓ 9th
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ m7
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ sus4
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ root
      id: 'D9sus4-open',
      frets: [0, 1, 0, 0, null, null],
      fingers: [null, 1, null, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // Dadd9 - Add 9
  // Intervals: [0, 4, 7, 14] = D, F#, A, E
  // Verification: [0,3,2,4,x,x] → E(4),D(2),A(9),F#(6) ✓
  'add9': [
    {
      id: 'Dadd9-open',
      frets: [0, 3, 2, 4, null, null],
      fingers: [null, 2, 1, 4, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // D69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = D, F#, A, B, E
  '69': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'D69-open',
      frets: [0, 0, 2, 4, 5, null],
      fingers: [null, null, 1, 3, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Dm69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = D, F, A, B, E
  'm69': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'Dm69-open',
      frets: [0, 0, 2, 3, 5, null],
      fingers: [null, null, 1, 2, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // D-5 - Major flat 5
  // Intervals: [0, 4, 6] = D, F#, Ab
  '-5': [
    {
      // String 2 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ M3
      // String 3 (G=7) fret 7: 7+7=14%12=2 (D) ✓ root
      // String 4 (D=2) fret 6: 2+6=8 (Ab) ✓ b5
      // String 5 (A=9) fret 5: 9+5=14%12=2 (D) ✓ root
      id: 'D-5-A',
      frets: [null, 7, 7, 6, 5, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = D, F#, Ab, C (D=2, F#=6, Ab=8, C=0)
  '7-5': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 6: 2+6=8 (Ab) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'D7-5-1',
      frets: [null, 7, 5, 6, 5, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = D, F#, A#, C (D=2, F#=6, A#=10, C=0)
  '7+5': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'D7+5-1',
      frets: [null, 7, 5, 8, 5, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // DM7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = D, F#, Ab, C# (D=2, F#=6, Ab=8, C#=1)
  'M7-5': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓
      // String 3 (D=2) fret 6: 2+6=8 (Ab) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'DM7-5-1',
      frets: [null, 7, 6, 6, 5, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Dm7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = D, F, A#, C (2, 5, 10, 0)
  'm7+5': [
    {
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 3: 7+3=10 (A#) ✓
      // String 3 (D=2) fret 8: 2+8=10 (A#) - too far, use different voicing
      // Better voicing:
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 4: 2+4=6 - wrong, try again
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 8: 2+8=10 (A#) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'Dm7+5-1',
      frets: [null, 6, 5, 8, 5, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 5,
      barreStrings: [2, 4],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = D, F#, A, C, E# (2, 6, 9, 0, 5)
  '7+9': [
    {
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F=E#) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 4: 2+4=6 (F#) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'D7+9-1',
      frets: [null, 6, 5, 4, 5, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // D4.4 - Quartal chord (D-G-C)
  // Intervals: [0, 5, 10] = D, G, C (2, 7, 0)
  '4.4': [
    {
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'D4.4-1',
      frets: [null, 8, 5, 5, 5, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 5,
      barreStrings: [2, 4],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Dblk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = D, E, Ab, C (D=2, E=4, Ab=8, C=0)
  'blk': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 6: 2+6=8 (Ab) ✓
      // String 4 (A=9) fret 5: 9+5=14%12=2 (D) ✓
      id: 'Dblk-A',
      frets: [null, 5, 5, 6, 5, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 5,
      barreStrings: [1, 4],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

};

// Dルートの分数コード（10パターン）
// D = MIDI 2, Major triad = [2, 6, 9] = D, F#, A
export const D_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // D/E - D major with E bass (interval 2)
  // D=2, F#=6, A=9, Bass E=4
  'major/2': [
    {
      // Open D shape with E bass
      // String 1 (E=4) fret 2: 4+2=6 (F#) ✓
      // String 2 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 3 (G=7) fret 2: 7+2=9 (A) ✓
      // String 4 (D=2) fret 0: 2+0=2 (D) ✓
      // String 6 (E=4) fret 0: 4+0=4 (E) ✓ Bass
      id: 'D-major-2-1',
      frets: [2, 3, 2, 0, null, 0],
      fingers: [1, 3, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      difficulty: 'easy',
    },
  ],
  // D/F# - D major with F# bass (interval 4)
  // D=2, F#=6, A=9, Bass F#=6
  'major/4': [
    {
      // D shape with F# bass on string 6
      // String 1 (E=4) fret 2: 4+2=6 (F#) ✓
      // String 2 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 3 (G=7) fret 2: 7+2=9 (A) ✓
      // String 4 (D=2) fret 0: 2+0=2 (D) ✓
      // String 6 (E=4) fret 2: 4+2=6 (F#) ✓ Bass
      id: 'D-major-4-1',
      frets: [2, 3, 2, 0, null, 2],
      fingers: [1, 3, 2, null, null, 1],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      difficulty: 'easy',
    },
  ],
  // D/G - D major with G bass (interval 5)
  // D=2, F#=6, A=9, Bass G=7
  'major/5': [
    {
      // D shape with G bass on string 6
      // String 1 (E=4) fret 2: 4+2=6 (F#) ✓
      // String 2 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 3 (G=7) fret 2: 7+2=9 (A) ✓
      // String 4 (D=2) fret 0: 2+0=2 (D) ✓
      // String 6 (E=4) fret 3: 4+3=7 (G) ✓ Bass
      id: 'D-major-5-1',
      frets: [2, 3, 2, 0, null, 3],
      fingers: [1, 3, 2, null, null, 4],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      difficulty: 'medium',
    },
  ],

  // D/A - D major with A bass (interval 7)
  // D=2, F#=6, A=9, Bass=A(9)
  // String 5 (A=9) open: A(9) ✓ Bass
  // String 4 (D=2) open: D(2) ✓
  // String 3 (G=7) fret 2: 7+2=9 (A) ✓
  // String 2 (B=11) fret 3: 11+3=14%12=2 (D) ✓
  // String 1 (E=4) fret 2: 4+2=6 (F#) ✓
  'major/5th': [
    {
      id: 'D-major-5th-1',
      frets: [2, 3, 2, 0, 0, null],
      fingers: [1, 3, 2, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // D/C# - D major with C# bass (interval 11 from D = 2+11=13%12=1)
  // D=2, F#=6, A=9, Bass=C#(1)
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/7': [
    {
      id: 'D-major-7-1',
      frets: [2, 3, 2, 4, 4, null],
      fingers: [1, 2, 1, 3, 4, null],
      barreAt: 2,
      barreStrings: [0, 2],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D/B - D major with B bass (interval 9 from D = 2+9=11)
  // D=2, F#=6, A=9, Bass=B(11)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓
  // String 4 (D=2): for D(2): fret = (2-2+12)%12 = 0 ✓ (open!)
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for F#(6): fret = (6-11+12)%12 = 7 → too far
  // Alternative: use standard D shape with bass
  // String 4 (D=2): for F#(6): fret = (6-2+12)%12 = 4
  // Better voicing:
  // String 5 (A=9): for B(11): fret = 2 ✓
  // String 4 (D=2): for A(9): fret = (9-2+12)%12 = 7 → too far
  // Try simpler: [2,3,2,0,2,x] = F#,D,A,D,B
  'major/9': [
    {
      id: 'D-major-9-1',
      frets: [2, 3, 2, 0, 2, null],
      fingers: [1, 3, 2, null, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D/C - D major with C bass (interval 10 from D = 2+10=12%12=0)
  // D=2, F#=6, A=9, Bass=C(0)
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓
  // String 4 (D=2): for D(2): fret = (2-2+12)%12 = 0 ✓ (open!)
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓
  'major/10': [
    {
      id: 'D-major-10-1',
      frets: [2, 3, 2, 0, 3, null],
      fingers: [1, 3, 2, null, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // マイナー分数 (2種)
  // Dm/F - Minor with bass on minor 3rd (interval 3)
  // Dm = D(2), F(5), A(9), Bass = F(5)
  'minor/3': [
    {
      // Position 1: Open voicing with F bass
      // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
      // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
      // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
      // String 4 (D=2): for D(2): fret = (2-2+12)%12 = 0 ✓ open
      // String 6 (E=4): for F(5): fret = 1 ✓ BASS
      id: 'D-minor-3-1',
      frets: [1, 3, 2, 0, null, 1],
      fingers: [1, 4, 3, null, null, 2],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      difficulty: 'medium',
    },
  ],
  // Dm/A - Minor with bass on 5th (interval 7)
  // Dm = D(2), F(5), A(9), Bass = A(9)
  'minor/7': [
    {
      // Position 1: Open voicing with A bass
      // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
      // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
      // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
      // String 4 (D=2): for D(2): fret = (2-2+12)%12 = 0 ✓ open
      // String 5 (A=9): for A(9): fret = (9-9+12)%12 = 0 ✓ open BASS
      id: 'D-minor-7-1',
      frets: [1, 3, 2, 0, 0, null],
      fingers: [1, 4, 3, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // マイナー7分数 (2種)
  // Dm7/A - Dm7 with A(5th) in bass
  // Dm7 = D(2), F(5), A(9), C(0)
  'minor7/5': [
    {
      // String 6 (E=4): fret 5 → 4+5=9 (A) ✓ 5th (BASS)
      // String 5 (A=9): fret 5 → 9+5=14%12=2 (D) ✓ root
      // String 4 (D=2): fret 3 → 2+3=5 (F) ✓ m3
      // String 3 (G=7): fret 5 → 7+5=12%12=0 (C) ✓ m7
      // String 2 (B=11): fret 6 → 11+6=17%12=5 (F) ✓ m3
      id: 'D-minor7-5-1',
      frets: [null, 6, 5, 3, 5, 5],
      fingers: [null, 4, 2, 1, 3, 3],
      barreAt: 5,
      barreStrings: [4, 5],
      baseFret: 3,
      muted: [true, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Dm7/C - Dm7 with C(m7) in bass
  // Dm7 = D(2), F(5), A(9), C(0)
  'minor7/10': [
    {
      // String 5 (A=9): fret 3 → 9+3=12%12=0 (C) ✓ m7 (BASS)
      // String 4 (D=2): fret 0 → 2+0=2 (D) ✓ root
      // String 3 (G=7): fret 2 → 7+2=9 (A) ✓ 5th
      // String 2 (B=11): fret 1 → 11+1=12%12=0 (C) ✓ m7
      // String 1 (E=4): fret 1 → 4+1=5 (F) ✓ m3
      id: 'D-minor7-10-1',
      frets: [1, 1, 2, 0, 3, null],
      fingers: [1, 1, 3, null, 4, null],
      barreAt: 1,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

};
