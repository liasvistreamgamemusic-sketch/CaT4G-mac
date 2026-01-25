/**
 * CaT4G - G Root Chord Data
 * Gルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * G = MIDI 7
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// Gルートの基本コード（31品質）
export const G_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // G Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'G-open',
      frets: [3, 0, 0, 0, 2, 3],
      fingers: [4, null, null, null, 1, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
    {
      id: 'G-barre-E',
      frets: [3, 3, 4, 5, 5, 3],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'G-barre-A',
      frets: [10, 12, 12, 12, 10, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 10,
      barreStrings: [0, 4],
      baseFret: 10,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // Gm - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'Gm-barre-E',
      frets: [3, 3, 3, 5, 5, 3],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      id: 'Gm-barre-A',
      frets: [10, 11, 12, 12, 10, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 10,
      barreStrings: [0, 4],
      baseFret: 10,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = C, E, G, A#
  '7': [
    {
      id: 'G7-open',
      frets: [1, 0, 0, 0, 2, 3],
      fingers: [1, null, null, null, 2, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Gm7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C, D#, G, A#
  'm7': [
    {
      id: 'Gm7-barre',
      frets: [3, 3, 3, 3, 5, 3],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // GM7 - Major 7
  // Intervals: [0, 4, 7, 11] = C, E, G, B
  'M7': [
    {
      id: 'GM7-open',
      frets: [2, 0, 0, 0, 2, 3],
      fingers: [1, null, null, null, 2, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // Gm7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = G, Bb, Db, F (G=7, Bb=10, Db=1, F=5)
  'm7-5': [
    {
      // String 1 (B=11) fret 11: 11+11=22%12=10 (Bb) ✓
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓
      // String 3 (D=2) fret 11: 2+11=13%12=1 (Db) ✓
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓
      id: 'Gm7b5-A',
      frets: [null, 11, 10, 11, 10, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Gm-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = G, Bb, Db
  'm-5': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (Bb) ✓
      // String 1 (B=11) fret 2: 11+2=13%12=1 (Db) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      id: 'Gm-5-open',
      frets: [6, 2, 0, null, null, null],
      fingers: [4, 1, null, null, null, null],
      baseFret: 1,
      muted: [false, false, false, true, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // Gdim - Diminished
  // Intervals: [0, 3, 6] = G, Bb, Db (G=7, Bb=10, Db=1)
  'dim': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (Bb) ✓
      // String 1 (B=11) fret 2: 11+2=13%12=1 (Db) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      id: 'Gdim-open',
      frets: [6, 2, 0, null, null, null],
      fingers: [3, 1, null, null, null, null],
      baseFret: 1,
      muted: [false, false, false, true, true, true],
      difficulty: 'medium',
    },
  ],

  // Gdim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = G, Bb, Db, E (G=7, Bb=10, Db=1, E=4)
  'dim7': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (Bb) ✓
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 6: 7+6=13%12=1 (Db) ✓
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓
      id: 'Gdim7-std',
      frets: [6, 5, 6, 5, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 5,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // Gaug - Augmented
  // Intervals: [0, 4, 8] = G, B, D# (G=7, B=11, D#=3)
  'aug': [
    {
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      id: 'Gaug-std',
      frets: [3, 4, 4, null, null, null],
      fingers: [1, 2, 3, null, null, null],
      baseFret: 3,
      muted: [false, false, false, true, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // Gsus2 - Suspended 2
  // Intervals: [0, 2, 7] = G, A, D (G=7, A=9, D=2)
  'sus2': [
    {
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      // String 5 (E=4) fret 3: 4+3=7 (G) ✓
      id: 'Gsus2-open',
      frets: [3, null, 0, 0, 0, 3],
      fingers: [3, null, null, null, null, 4],
      baseFret: 1,
      muted: [false, true, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Gsus4 - Suspended 4
  // Intervals: [0, 5, 7] = C, F, G
  'sus4': [
    {
      id: 'Gsus4-open',
      frets: [3, 1, 0, 0, 3, 3],
      fingers: [3, 1, null, null, 4, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // G7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = G, C, D, F
  '7sus4': [
    {
      // String 1 (E=4) fret 8: 4+8=12%12=0 (C) ✓ P4
      // String 2 (B=11) fret 8: 11+8=19%12=7 (G) ✓ root
      // String 3 (G=7) fret 10: 7+10=17%12=5 (F) ✓ m7
      // String 4 (D=2) fret 12: 2+12=14%12=2 (D) ✓ P5
      // String 5 (A=9) fret 10: 9+10=19%12=7 (G) ✓ root
      id: 'G7sus4-A',
      frets: [8, 8, 10, 12, 10, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 8,
      barreStrings: [0, 1],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // G6 - Major 6
  // Intervals: [0, 4, 7, 9] = C, E, G, A
  '6': [
    {
      id: 'G6-open',
      frets: [0, 0, 0, 0, 2, 3],
      fingers: [null, null, null, null, 1, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Gm6 - Minor 6
  // Intervals: [0, 3, 7, 9] = C, D#, G, A
  'm6': [
    {
      id: 'Gm6-barre',
      frets: [3, 5, 3, 5, 5, 3],
      fingers: [1, 3, 1, 4, 2, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // GmM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = G, Bb, D, F# (G=7, Bb=10, D=2, F#=6)
  'mM7': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 8: 2+8=10 (Bb) ✓
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓
      id: 'GmM7-A',
      frets: [null, 7, 7, 8, 10, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // G9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = C, E, G, A#, D
  '9': [
    {
      id: 'G9-open',
      frets: [1, 0, 0, 0, 0, 3],
      fingers: [1, null, null, null, null, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Gm9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = G, Bb, D, F, A (7, 10, 2, 5, 9)
  'm9': [
    {
      // String 0 (E=4) fret 10: 4+10=14%12=2 (D) ✓ 5th
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓ 9th
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓ m7
      // String 3 (D=2) fret 8: 2+8=10 (Bb) ✓ m3
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓ root
      id: 'Gm9-A',
      frets: [10, 10, 10, 8, 10, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 10,
      barreStrings: [0, 4],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      // Easier open position voicing
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ m7
      // String 1 (B=11) fret 0: 11+0=11 - not in chord, but use fret 10 for A
      // Actually use simpler:
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓ root
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ 5th
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓ m3
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ m7
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ 9th
      id: 'Gm9-open',
      frets: [3, 3, 3, 3, 0, null],
      fingers: [1, 1, 1, 1, null, null],
      barreAt: 3,
      barreStrings: [0, 3],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // GM9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = G, B, D, F#, A (7, 11, 2, 6, 9)
  'M9': [
    {
      // Open position
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ M7
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓ M3
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ root
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ 5th
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ 9th
      // String 5 (E=4) fret 3: 4+3=7 (G) ✓ root
      id: 'GM9-open',
      frets: [2, 0, 0, 0, 0, 3],
      fingers: [2, null, null, null, null, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // G9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = G, C, D, F, A (7, 0, 2, 5, 9)
  '9sus4': [
    {
      // Open position
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ m7
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ sus4
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ root
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ 5th
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ 9th
      // String 5 (E=4) fret 3: 4+3=7 (G) ✓ root
      id: 'G9sus4-open',
      frets: [1, 1, 0, 0, 0, 3],
      fingers: [1, 2, null, null, null, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Gadd9 - Add 9
  // Intervals: [0, 4, 7, 14] = C, E, G, D
  'add9': [
    {
      id: 'Gadd9-open',
      frets: [3, 0, 2, 0, 0, 3],
      fingers: [3, null, 2, null, null, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // G69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = G, B, D, E, A
  '69': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      // String 5 (E=4) fret 3: 4+3=7 (G) ✓
      id: 'G69-open',
      frets: [0, 0, 0, 0, 0, 3],
      fingers: [null, null, null, null, null, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Gm69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = G, Bb, D, E, A
  'm69': [
    {
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓
      // String 5 (E=4) fret 3: 4+3=7 (G) ✓
      id: 'Gm69-open',
      frets: [0, 3, 3, 0, 0, 3],
      fingers: [null, 2, 3, null, null, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // G-5 - Major flat 5
  // Intervals: [0, 4, 6] = G, B, Db
  '-5': [
    {
      // String 2 (B=11) fret 12: 11+12=23%12=11 (B) ✓ M3
      // String 3 (G=7) fret 12: 7+12=19%12=7 (G) ✓ root
      // String 4 (D=2) fret 11: 2+11=13%12=1 (Db) ✓ b5
      // String 5 (A=9) fret 10: 9+10=19%12=7 (G) ✓ root
      id: 'G-5-A',
      frets: [null, 12, 12, 11, 10, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // G7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = G, B, Db, F (7, 11, 1, 5)
  '7-5': [
    {
      // String 1 (B=11) fret 12: 11+12=23%12=11 (B) ✓ M3
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓ m7
      // String 3 (D=2) fret 11: 2+11=13%12=1 (Db) ✓ b5
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓ root
      id: 'G7-5-1',
      frets: [null, 12, 10, 11, 10, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // G7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = G, B, D#, F (7, 11, 3, 5)
  '7+5': [
    {
      // String 1 (B=11) fret 12: 11+12=23%12=11 (B) ✓ M3
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓ m7
      // String 3 (D=2) fret 13: 2+13=15%12=3 (D#) ✓ #5
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓ root
      id: 'G7+5-1',
      frets: [null, 12, 10, 13, 10, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // GM7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = G, B, Db, F# (7, 11, 1, 6)
  'M7-5': [
    {
      // String 1 (B=11) fret 12: 11+12=23%12=11 (B) ✓ M3
      // String 2 (G=7) fret 11: 7+11=18%12=6 (F#) ✓ M7
      // String 3 (D=2) fret 11: 2+11=13%12=1 (Db) ✓ b5
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓ root
      id: 'GM7-5-1',
      frets: [null, 12, 11, 11, 10, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Gm7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = G, Bb, D#, F (7, 10, 3, 5)
  'm7+5': [
    {
      // String 1 (B=11) fret 11: 11+11=22%12=10 (Bb) ✓
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓
      // String 3 (D=2) fret 13: 2+13=15%12=3 (D#) ✓
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓
      id: 'Gm7+5-1',
      frets: [null, 11, 10, 13, 10, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 10,
      barreStrings: [2, 4],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // G7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = G, B, D, F, A# (7, 11, 2, 5, 10)
  '7+9': [
    {
      // String 1 (B=11) fret 11: 11+11=22%12=10 (A#) ✓
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓
      id: 'G7+9-1',
      frets: [null, 11, 10, 9, 10, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // G4.4 - Quartal chord (G-C-F)
  // Intervals: [0, 5, 10] = G, C, F (7, 0, 5)
  '4.4': [
    {
      // String 1 (B=11) fret 13: 11+13=24%12=0 (C) ✓
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓
      id: 'G4.4-1',
      frets: [null, 13, 10, 10, 10, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 10,
      barreStrings: [2, 4],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Gblk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = G, A, Db, F (G=7, A=9, Db=1, F=5)
  'blk': [
    {
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓
      // String 3 (D=2) fret 11: 2+11=13%12=1 (Db) ✓
      // String 4 (A=9) fret 10: 9+10=19%12=7 (G) ✓
      id: 'Gblk-A',
      frets: [null, 10, 10, 11, 10, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 10,
      barreStrings: [1, 4],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

};

// Gルートの分数コード（10パターン）
// G = MIDI 7, Major triad = [7, 11, 2] = G, B, D
export const G_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // G/A - G major with A bass (interval 2)
  // G=7, B=11, D=2, Bass=A(9)
  // String 5 (A=9): for A(9): fret = 0 ✓ (open BASS)
  // String 4 (D=2): for D(2): fret = 0 ✓ (open)
  // String 3 (G=7): for G(7): fret = 0 ✓ (open)
  // String 2 (B=11): for B(11): fret = 0 ✓ (open)
  // String 1 (E=4): for G(7): fret = 3 ✓
  'major/2': [
    {
      id: 'G-major-2-1',
      frets: [3, 0, 0, 0, 0, null],
      fingers: [3, null, null, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // G/B - G major with B bass (interval 4)
  // G=7, B=11, D=2, Bass=B(11)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓ (BASS)
  // String 4 (D=2): for D(2): fret = 0 ✓ (open)
  // String 3 (G=7): for G(7): fret = 0 ✓ (open)
  // String 2 (B=11): for B(11): fret = 0 ✓ (open)
  // String 1 (E=4): for G(7): fret = 3 ✓
  'major/4': [
    {
      id: 'G-major-4-1',
      frets: [3, 0, 0, 0, 2, null],
      fingers: [3, null, null, null, 1, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // G/C - G major with C bass (interval 5)
  // G=7, B=11, D=2, Bass=C(0)
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓ (BASS)
  // String 4 (D=2): for D(2): fret = 0 ✓ (open)
  // String 3 (G=7): for G(7): fret = 0 ✓ (open)
  // String 2 (B=11): for B(11): fret = 0 ✓ (open)
  // String 1 (E=4): for G(7): fret = 3 ✓
  'major/5': [
    {
      id: 'G-major-5-1',
      frets: [3, 0, 0, 0, 3, null],
      fingers: [3, null, null, null, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // G/D - G major with D bass (interval 7)
  // G=7, B=11, D=2, Bass=D(2)
  // String 6 (E=4) fret 3: 4+3=7 (G) ✓
  // String 5 (A=9) fret 2: 9+2=11 (B) ✓
  // String 4 (D=2) open: D(2) ✓ Bass
  // String 3 (G=7) open: G(7) ✓
  // String 2 (B=11) open: B(11) ✓
  // String 1 (E=4) fret 3: 4+3=7 (G) ✓
  'major/5th': [
    {
      id: 'G-major-5th-1',
      frets: [3, 0, 0, 0, 2, 3],
      fingers: [3, null, null, null, 1, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // G/F# - G major with F# bass (interval 11 from G = 7+11=18%12=6)
  // G=7, B=11, D=2, Bass=F#(6)
  // String 6 (E=4): for F#(6): fret = (6-4+12)%12 = 2 ✓ (BASS)
  // String 5 (A=9): for D(2): fret = (2-9+12)%12 = 5 ✓
  // String 4 (D=2): for G(7): fret = (7-2+12)%12 = 5 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓
  'major/7': [
    {
      id: 'G-major-7-1',
      frets: [3, 3, 4, 5, 5, 2],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 3,
      barreStrings: [0, 1],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // G/E - G major with E bass (interval 9 from G = 7+9=16%12=4)
  // G=7, B=11, D=2, Bass=E(4)
  // String 6 (E=4): for E(4): fret = (4-4+12)%12 = 0 ✓ (open! BASS)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓
  // String 4 (D=2): for D(2): fret = (2-2+12)%12 = 0 ✓ (open!)
  // String 3 (G=7): for G(7): fret = (7-7+12)%12 = 0 ✓ (open!)
  // String 2 (B=11): for B(11): fret = (11-11+12)%12 = 0 ✓ (open!)
  // String 1 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓
  'major/9': [
    {
      id: 'G-major-9-1',
      frets: [3, 0, 0, 0, 2, 0],
      fingers: [4, null, null, null, 1, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // G/F - G major with F bass (interval 10 from G = 7+10=17%12=5)
  // G=7, B=11, D=2, Bass=F(5)
  // String 6 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓ (BASS)
  // String 5 (A=9): for D(2): fret = (2-9+12)%12 = 5 → too far
  // Try: Bass on string 4, mute string 5,6
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓ (BASS)
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 → span ok
  // Better: use open position with F on fret 1
  // String 6 (E=4): for F(5): fret = 1 ✓ (BASS)
  // String 5 (A=9): for B(11): fret = 2 ✓
  // String 4 (D=2): for D(2): fret = 0 ✓ (open!)
  // String 3 (G=7): for G(7): fret = 0 ✓ (open!)
  // String 2 (B=11): for B(11): fret = 0 ✓ (open!)
  // String 1 (E=4): for G(7): fret = 3 ✓
  'major/10': [
    {
      id: 'G-major-10-1',
      frets: [3, 0, 0, 0, 2, 1],
      fingers: [4, null, null, null, 2, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // マイナー分数 (2種)
  // Gm/Bb - Gm with Bb bass (interval 3 = minor 3rd)
  // Gm = G(7), Bb(10), D(2), Bass=Bb(10)
  // String 5 (A=9): for Bb(10): fret = (10-9+12)%12 = 1 ✓ (BASS)
  // String 4 (D=2): for D(2): fret = 0 ✓ (open)
  // String 3 (G=7): for G(7): fret = 0 ✓ (open)
  // String 2 (B=11): for Bb(10): fret = (10-11+12)%12 = 11 → too high, try fret 11 or alternative
  // Alternative: String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for G(7): fret = 3 ✓
  'minor/3': [
    {
      id: 'G-minor-3-1',
      frets: [3, 3, 0, 0, 1, null],
      fingers: [3, 4, null, null, 1, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // Gm/D - Gm with D bass (interval 7 = 5th)
  // Gm = G(7), Bb(10), D(2), Bass=D(2)
  // String 4 (D=2): for D(2): fret = 0 ✓ (open BASS)
  // String 3 (G=7): for G(7): fret = 0 ✓ (open)
  // String 2 (B=11): for Bb(10): fret = (10-11+12)%12 = 11 → too high
  // Alternative voicing at fret 3:
  // String 5 (A=9): for D(2): fret = (2-9+12)%12 = 5 ✓ (BASS)
  // String 4 (D=2): for G(7): fret = (7-2+12)%12 = 5 ✓
  // String 3 (G=7): for Bb(10): fret = (10-7+12)%12 = 3 ✓
  // String 2 (B=11): for D(2): fret = (2-11+12)%12 = 3 ✓
  // String 1 (E=4): for G(7): fret = 3 ✓
  'minor/7': [
    {
      id: 'G-minor-7-1',
      frets: [3, 3, 3, 5, 5, null],
      fingers: [1, 1, 1, 3, 4, null],
      barreAt: 3,
      barreStrings: [0, 2],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // マイナー7分数 (2種)
  // Gm7/D - Gm7 with D bass (interval 7 = 5th)
  // Gm7 = G(7), Bb(10), D(2), F(5)
  'minor7/5': [
    {
      // String 4 (D=2): fret 0 → 2+0=2 (D) ✓ 5th (BASS open)
      // String 3 (G=7): fret 0 → 7+0=7 (G) ✓ root
      // String 2 (B=11): fret 3 → 11+3=14%12=2 (D) ✓ 5th
      // String 1 (E=4): fret 1 → 4+1=5 (F) ✓ m7
      // Missing Bb! Add it on string 5:
      // String 5 (A=9): fret 1 → 9+1=10 (Bb) ✓ m3
      id: 'G-minor7-5-1',
      frets: [1, 3, 0, 0, 1, null],
      fingers: [1, 3, null, null, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // Gm7/F - Gm7 with F(m7) in bass
  // Gm7 = G(7), Bb(10), D(2), F(5)
  'minor7/10': [
    {
      // String 6 (E=4): fret 1 → 4+1=5 (F) ✓ m7 (BASS)
      // String 5 (A=9): fret 1 → 9+1=10 (Bb) ✓ m3
      // String 4 (D=2): fret 0 → 2+0=2 (D) ✓ 5th
      // String 3 (G=7): fret 0 → 7+0=7 (G) ✓ root
      // String 2 (B=11): fret 3 → 11+3=14%12=2 (D) ✓ 5th
      // String 1 (E=4): fret 3 → 4+3=7 (G) ✓ root
      id: 'G-minor7-10-1',
      frets: [3, 3, 0, 0, 1, 1],
      fingers: [3, 4, null, null, 1, 1],
      barreAt: 1,
      barreStrings: [4, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

};
