/**
 * CaT4G - C Root Chord Data
 * Cルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * C = MIDI 0
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// Cルートの基本コード（31品質）
export const C_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // C Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'C-open',
      frets: [0, 1, 0, 2, 3, null],
      fingers: [null, 1, null, 2, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'C-barre-A',
      frets: [3, 5, 5, 5, 3, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'C-barre-E',
      frets: [8, 8, 9, 10, 10, 8],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 8,
      barreStrings: [0, 5],
      baseFret: 8,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // Cm - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'Cm-barre-A',
      frets: [3, 4, 5, 5, 3, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Cm-barre-E',
      frets: [8, 8, 8, 10, 10, 8],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 8,
      barreStrings: [0, 5],
      baseFret: 8,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // C7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = C, E, G, A#
  '7': [
    {
      id: 'C7-open',
      frets: [0, 1, 3, 2, 3, null],
      fingers: [null, 1, 3, 2, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Cm7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C, D#, G, A#
  'm7': [
    {
      id: 'Cm7-barre',
      frets: [3, 4, 3, 5, 3, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // CM7 - Major 7
  // Intervals: [0, 4, 7, 11] = C, E, G, B
  'M7': [
    {
      id: 'CM7-open',
      frets: [0, 0, 0, 2, 3, null],
      fingers: [null, null, null, 2, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // Cm7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = C, Eb, Gb, Bb
  'm7-5': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (Eb) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 4: 2+4=6 (Gb) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'Cm7b5-A',
      frets: [null, 4, 3, 4, 3, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Cm-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = C, Eb, Gb
  'm-5': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (Eb) ✓
      // String 2 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 3 (D=2) fret 4: 2+4=6 (Gb) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'Cm-5-A',
      frets: [null, 4, 5, 4, 3, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // Cdim - Diminished
  // Intervals: [0, 3, 6] = C, Eb, Gb
  'dim': [
    {
      // 5弦ルート dim（標準フォーム）
      // 1弦(E=4)+2=6 (Gb) b5, 2弦(B=11)+4=3 (Eb) m3
      // 3弦(G=7)+2=9 (A) bb7, 4弦(D=2)+4=6 (Gb) b5, 5弦(A=9)+3=0 (C) root
      id: 'Cdim-5str',
      frets: [2, 4, 2, 4, 3, null],
      fingers: [1, 3, 1, 4, 2, null],
      barreAt: 2,
      barreStrings: [0, 2],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // 6弦ルート dim（高位ポジション）
      // 2弦(B=11)+7=6 (Gb) b5, 3弦(G=7)+8=3 (Eb) m3
      // 4弦(D=2)+7=9 (A) bb7, 6弦(E=4)+8=0 (C) root
      id: 'Cdim-6str',
      frets: [null, 7, 8, 7, null, 8],
      fingers: [null, 1, 3, 2, null, 4],
      baseFret: 7,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
  ],

  // Cdim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = C, Eb, Gb, A
  'dim7': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (Eb) ✓
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓
      // String 3 (D=2) fret 4: 2+4=6 (Gb) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'Cdim7-std',
      frets: [null, 4, 2, 4, 3, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Caug - Augmented
  // Intervals: [0, 4, 8] = C, E, G#
  'aug': [
    {
      id: 'Caug-open',
      frets: [0, 1, 1, 2, 3, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // Csus2 - Suspended 2
  // Intervals: [0, 2, 7] = C, D, G
  // Verification: [3,3,0,0,3,x] → G(7),D(2),G(7),D(2),C(0) ✓
  'sus2': [
    {
      id: 'Csus2-open',
      frets: [3, 3, 0, 0, 3, null],
      fingers: [3, 4, null, null, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // Csus4 - Suspended 4
  // Intervals: [0, 5, 7] = C, F, G
  'sus4': [
    {
      id: 'Csus4-open',
      frets: [1, 1, 0, 3, 3, null],
      fingers: [1, 1, null, 3, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = C, F, G, Bb
  '7sus4': [
    {
      // String 1 (E=4) fret 1: 4+1=5 (F) ✓ P4
      // String 2 (B=11) fret 1: 11+1=12%12=0 (C) ✓ root
      // String 3 (G=7) fret 3: 7+3=10 (Bb) ✓ m7
      // String 4 (D=2) fret 5: 2+5=7 (G) ✓ P5
      // String 5 (A=9) fret 3: 9+3=12%12=0 (C) ✓ root
      id: 'C7sus4-A',
      frets: [1, 1, 3, 5, 3, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 1,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // C6 - Major 6
  // Intervals: [0, 4, 7, 9] = C, E, G, A
  '6': [
    {
      // 6弦ルート移動フォーム (Form 1)
      id: 'C6-6str-form1',
      frets: [null, 10, 9, null, 10, 8],
      fingers: [null, 3, 2, null, 4, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 8,
      muted: [true, false, false, true, false, false],
      difficulty: 'medium',
    },
    {
      // 6弦ルート移動フォーム (Form 2)
      id: 'C6-6str-form2',
      frets: [null, 8, 9, 7, null, 8],
      fingers: [null, 2, 3, 1, null, 2],
      barreAt: 8,
      barreStrings: [1, 5],
      baseFret: 7,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      id: 'C6-open',
      frets: [0, 1, 2, 2, 3, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Cm6 - Minor 6
  // Intervals: [0, 3, 7, 9] = C, Eb, G, A
  // Verification: [5,4,5,5,3,x] → A(9),Eb(3),C(0),G(7),C(0) ✓
  'm6': [
    {
      id: 'Cm6-barre',
      frets: [5, 4, 5, 5, 3, null],
      fingers: [3, 2, 4, 4, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // CmM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = C, D#, G, B
  'mM7': [
    {
      // E-shape mM7 barre at fret 8
      id: 'CmM7-E-barre',
      frets: [8, 8, 8, 9, 10, 8],
      fingers: [1, 1, 1, 2, 3, 1],
      barreAt: 8,
      barreStrings: [0, 5],
      baseFret: 8,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'CmM7-barre',
      frets: [3, 4, 4, 5, 3, null],
      fingers: [1, 2, 2, 3, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // C9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = C, E, G, Bb, D
  // Verification: [3,3,3,2,3,x] → G(7),D(2),Bb(10),E(4),C(0) ✓
  '9': [
    {
      id: 'C9-open',
      frets: [3, 3, 3, 2, 3, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Cm9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = C, Eb, G, Bb, D (0, 3, 7, 10, 2)
  'm9': [
    {
      // Omit 5th for playability
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓ 5th
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ 9th
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓ m7
      // String 3 (D=2) fret 1: 2+1=3 (Eb) ✓ m3
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓ root
      id: 'Cm9-A',
      frets: [3, 3, 3, 1, 3, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // CM9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = C, E, G, B, D (0, 4, 7, 11, 2)
  'M9': [
    {
      id: 'CM9-open',
      frets: [null, 3, 4, 2, 3, null],
      fingers: [null, 2, 4, 1, 3, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'CM9-barre',
      frets: [3, 3, 4, 5, 3, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 3,
      barreStrings: [1, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // C9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = C, F, G, Bb, D (0, 5, 7, 10, 2)
  '9sus4': [
    {
      // Omit 5th for playability
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ sus4
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ 9th
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓ m7
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ sus4
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓ root
      id: 'C9sus4-A',
      frets: [1, 3, 3, 3, 3, null],
      fingers: [1, 2, 3, 4, 2, null],
      barreAt: 3,
      barreStrings: [1, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Cadd9 - Add 9
  // Intervals: [0, 4, 7, 14] = C, E, G, D
  'add9': [
    {
      id: 'Cadd9-open',
      frets: [0, 3, 0, 2, 3, null],
      fingers: [null, 2, null, 1, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'Cadd9-high',
      frets: [10, 8, 9, 10, null, null],
      fingers: [4, 1, 2, 3, null, null],
      baseFret: 8,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // C69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = C, E, G, A, D
  // 5弦ルート移動フォーム (5弦3フレット = C)
  '69': [
    {
      id: 'C69-A',
      frets: [3, 3, 2, 2, 3, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Cm69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = C, Eb, G, A, D
  'm69': [
    {
      // フォーム1: 低フレット
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ 9th
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ 6th
      // String 3 (D=2) fret 1: 2+1=3 (Eb) ✓ m3
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓ root
      id: 'Cm69-form1',
      frets: [null, 3, 2, 1, 3, null],
      fingers: [null, 3, 2, 1, 4, null],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // フォーム2: 高フレット
      // String 0 (E=4) fret 10: 4+10=14%12=2 (D) ✓ 9th
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓ 6th
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓ m3
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓ root
      id: 'Cm69-form2',
      frets: [10, 10, 8, 10, null, null],
      fingers: [2, 3, 1, 4, null, null],
      baseFret: 8,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // C-5 - Major flat 5
  // Intervals: [0, 4, 6] = C, E, Gb
  '-5': [
    {
      // String 2 (B=11) fret 5: 11+5=16%12=4 (E) ✓ M3
      // String 3 (G=7) fret 5: 7+5=12%12=0 (C) ✓ root
      // String 4 (D=2) fret 4: 2+4=6 (Gb) ✓ b5
      // String 5 (A=9) fret 3: 9+3=12%12=0 (C) ✓ root
      id: 'C-5-A',
      frets: [null, 5, 5, 4, 3, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = C, E, Gb, Bb (C=0, E=4, Gb=6, Bb=10)
  '7-5': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 4: 2+4=6 (Gb) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'C7-5-1',
      frets: [null, 5, 3, 4, 3, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = C, E, G#, Bb (C=0, E=4, G#=8, Bb=10)
  '7+5': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'C7+5-1',
      frets: [null, 5, 3, 6, 3, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // CM7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = C, E, Gb, B (C=0, E=4, Gb=6, B=11)
  'M7-5': [
    {
      // String 1 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 4: 2+4=6 (Gb) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'CM7-5-1',
      frets: [null, 5, 4, 4, 3, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Cm7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = C, Eb, G#, Bb
  'm7+5': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (Eb) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'Cm7+5-1',
      frets: [null, 4, 3, 6, 3, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 3,
      barreStrings: [2, 4],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = C, E, G, Bb, D#
  '7+9': [
    {
      // String 1 (B=11) fret 4: 11+4=15%12=3 (D#) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'C7+9-1',
      frets: [null, 4, 3, 2, 3, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // C4.4 - Quartal chord (C-F-Bb)
  // Intervals: [0, 5, 10] = C, F, Bb
  '4.4': [
    {
      // String 1 (B=11) fret 6: 11+6=17%12=5 (F) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'C4.4-1',
      frets: [null, 6, 3, 3, 3, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 3,
      barreStrings: [2, 4],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Cblk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = C, D, Gb, Bb
  'blk': [
    {
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 4: 2+4=6 (Gb) ✓
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      id: 'Cblk-A',
      frets: [null, 3, 3, 4, 3, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 3,
      barreStrings: [1, 4],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // パワーコード (1種)
  // ============================================

  // C5 - Power Chord (root + P5)
  // Intervals: [0, 7] = C, G
  '5': [
    {
      id: 'C5-power5',
      frets: [null, null, null, 5, 3, null],
      fingers: [null, null, null, 3, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 3,
      muted: [true, true, true, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'C5-power6',
      frets: [null, null, null, null, 10, 8],
      fingers: [null, null, null, null, 3, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 8,
      muted: [true, true, true, true, false, false],
      difficulty: 'easy',
    },
  ],

};

// Cルートの分数コード（10パターン）
export const C_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // C/D - C major with D bass (interval 2)
  // C=0, E=4, G=7, Bass D=2
  'major/2': [
    {
      // Barre chord at fret 5
      // String 1 (E=4) fret 3: 4+3=7 (G) ✓
      // String 2 (B=11) fret 5: 11+5=16%12=4 (E) ✓
      // String 3 (G=7) fret 5: 7+5=12%12=0 (C) ✓
      // String 4 (D=2) fret 5: 2+5=7 (G) ✓
      // String 5 (A=9) fret 5: 9+5=14%12=2 (D) ✓ Bass
      id: 'C-major-2-1',
      frets: [3, 5, 5, 5, 5, null],
      fingers: [1, 3, 3, 3, 3, null],
      barreAt: 5,
      barreStrings: [1, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],
  // C/E - C major with E bass (interval 4)
  // C=0, E=4, G=7, Bass E=4
  'major/4': [
    {
      // Open C with low E bass
      // String 1 (E=4) fret 0: 4+0=4 (E) ✓
      // String 2 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 3 (G=7) fret 0: 7+0=7 (G) ✓
      // String 4 (D=2) fret 2: 2+2=4 (E) ✓
      // String 5 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      // String 6 (E=4) fret 0: 4+0=4 (E) ✓ Bass
      id: 'C-major-4-1',
      frets: [0, 1, 0, 2, 3, 0],
      fingers: [null, 1, null, 2, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],
  // C/F - C major with F bass (interval 5)
  // C=0, E=4, G=7, Bass F=5
  'major/5': [
    {
      // C shape with F bass on string 6
      // String 1 (E=4) fret 0: 4+0=4 (E) ✓
      // String 2 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 3 (G=7) fret 0: 7+0=7 (G) ✓
      // String 4 (D=2) fret 2: 2+2=4 (E) ✓
      // String 5 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      // String 6 (E=4) fret 1: 4+1=5 (F) ✓ Bass
      id: 'C-major-5-1',
      frets: [0, 1, 0, 2, 3, 1],
      fingers: [null, 1, null, 2, 4, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // C/G - C major with G bass (interval 7)
  // C=0, E=4, G=7, Bass=G(7)
  // String 6 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓ Bass
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for G(7): fret = (7-7+12)%12 = 0 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for E(4): fret = (4-4+12)%12 = 0 ✓
  'major/5th': [
    {
      id: 'C-major-5th-1',
      frets: [0, 1, 0, 2, 3, 3],
      fingers: [null, 1, null, 2, 3, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // C/B - C major with B bass (interval 11)
  // C=0, E=4, G=7, Bass=B(11)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for G(7): fret = (7-7+12)%12 = 0 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for E(4): fret = (4-4+12)%12 = 0 ✓
  'major/7': [
    {
      id: 'C-major-7-1',
      frets: [0, 1, 0, 2, 2, null],
      fingers: [null, 1, null, 2, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C/A - C major with A bass (interval 9)
  // C=0, E=4, G=7, Bass=A(9)
  // String 5 (A=9): for A(9): fret = (9-9+12)%12 = 0 ✓ (open!)
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for G(7): fret = (7-7+12)%12 = 0 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for E(4): fret = (4-4+12)%12 = 0 ✓
  'major/9': [
    {
      id: 'C-major-9-1',
      frets: [0, 1, 0, 2, 0, null],
      fingers: [null, 1, null, 2, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // C/Bb - C major with Bb bass (interval 10)
  // C=0, E=4, G=7, Bass=Bb(10)
  // String 5 (A=9): for Bb(10): fret = (10-9+12)%12 = 1 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for G(7): fret = (7-7+12)%12 = 0 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for E(4): fret = (4-4+12)%12 = 0 ✓
  'major/10': [
    {
      id: 'C-major-10-1',
      frets: [0, 1, 0, 2, 1, null],
      fingers: [null, 1, null, 3, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // マイナー分数 (2種)
  // Cm/Eb - Minor with bass on minor 3rd (interval 3)
  // Cm = C(0), Eb(3), G(7), Bass = Eb(3)
  'minor/3': [
    {
      // Position 1: A-shape based
      // String 2 (B=11): for Eb(3): fret = (3-11+12)%12 = 4 ✓
      // String 3 (G=7): for C(0): fret = (0-7+12)%12 = 5 ✓
      // String 4 (D=2): for G(7): fret = (7-2+12)%12 = 5 ✓
      // String 5 (A=9): for Eb(3): fret = (3-9+12)%12 = 6 ✓ BASS
      id: 'C-minor-3-1',
      frets: [null, 4, 5, 5, 6, null],
      fingers: [null, 1, 2, 3, 4, null],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],
  // Cm/G - Minor with bass on 5th (interval 7)
  // Cm = C(0), Eb(3), G(7), Bass = G(7)
  'minor/7': [
    {
      // Position 1: E-shape based with G bass
      // String 1 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓
      // String 2 (B=11): for Eb(3): fret = (3-11+12)%12 = 4 ✓
      // String 3 (G=7): for C(0): fret = (0-7+12)%12 = 5 ✓
      // String 4 (D=2): for G(7): fret = (7-2+12)%12 = 5 ✓
      // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓
      // String 6 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓ BASS
      id: 'C-minor-7-1',
      frets: [3, 4, 5, 5, 3, 3],
      fingers: [1, 2, 4, 3, 1, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // マイナー7分数 (2種)
  // Cm7/G - Cm7 with G(5th) in bass
  // Cm7 = C(0), Eb(3), G(7), Bb(10)
  'minor7/5': [
    {
      // String 6 (E=4): fret 3 → 4+3=7 (G) ✓ 5th (BASS)
      // String 5 (A=9): fret 3 → 9+3=12%12=0 (C) ✓ root
      // String 4 (D=2): fret 1 → 2+1=3 (Eb) ✓ m3
      // String 3 (G=7): fret 3 → 7+3=10 (Bb) ✓ m7
      // String 2 (B=11): fret 4 → 11+4=15%12=3 (Eb) ✓ m3
      id: 'C-minor7-5-1',
      frets: [null, 4, 3, 1, 3, 3],
      fingers: [null, 4, 2, 1, 3, 3],
      barreAt: 3,
      barreStrings: [4, 5],
      baseFret: 1,
      muted: [true, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Cm7/Bb - Cm7 with Bb(m7) in bass
  // Cm7 = C(0), Eb(3), G(7), Bb(10)
  'minor7/10': [
    {
      // String 5 (A=9): fret 1 → 9+1=10 (Bb) ✓ m7 (BASS)
      // String 4 (D=2): fret 1 → 2+1=3 (Eb) ✓ m3
      // String 3 (G=7): fret 0 → 7+0=7 (G) ✓ 5th
      // String 2 (B=11): fret 1 → 11+1=12%12=0 (C) ✓ root
      // String 1 (E=4): fret 3 → 4+3=7 (G) ✓ 5th
      id: 'C-minor7-10-1',
      frets: [3, 1, 0, 1, 1, null],
      fingers: [4, 1, null, 2, 1, null],
      barreAt: 1,
      barreStrings: [1, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

};
