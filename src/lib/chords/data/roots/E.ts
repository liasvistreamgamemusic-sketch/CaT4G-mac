/**
 * CaT4G - E Root Chord Data
 * Eルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * E = MIDI 4
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// Eルートの基本コード（31品質）
export const E_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // E Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'E-open',
      frets: [0, 0, 1, 2, 2, 0],
      fingers: [null, null, 1, 3, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
    {
      id: 'E-barre-A',
      frets: [7, 9, 9, 9, 7, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 7,
      barreStrings: [0, 4],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Em - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'Em-open',
      frets: [0, 0, 0, 2, 2, 0],
      fingers: [null, null, null, 2, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
    {
      id: 'Em-barre-A',
      frets: [7, 8, 9, 9, 7, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 7,
      barreStrings: [0, 4],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // E7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = C, E, G, A#
  '7': [
    {
      id: 'E7-open',
      frets: [0, 0, 1, 0, 2, 0],
      fingers: [null, null, 1, null, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Em7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C, D#, G, A#
  'm7': [
    {
      id: 'Em7-open',
      frets: [0, 0, 0, 0, 2, 0],
      fingers: [null, null, null, null, 1, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // EM7 - Major 7
  // Intervals: [0, 4, 7, 11] = C, E, G, B
  'M7': [
    {
      id: 'EM7-open',
      frets: [0, 0, 1, 1, 2, 0],
      fingers: [null, null, 1, 2, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // Em7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = E, G, Bb, D (E=4, G=7, Bb=10, D=2)
  'm7-5': [
    {
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 8: 2+8=10 (Bb) ✓
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓
      id: 'Em7b5-A',
      frets: [null, 8, 7, 8, 7, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Em-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = E, G, Bb
  'm-5': [
    {
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓
      // String 1 (B=11) fret 1: 11+1=12%12=0 - no, need Bb=10
      // Better voicing:
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓
      // String 3 (D=2) fret 8: 2+8=10 (Bb) ✓
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓
      id: 'Em-5-A',
      frets: [null, 8, 9, 8, 7, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // Edim - Diminished
  // Intervals: [0, 3, 6] = E, G, Bb
  // Verification: [x,x,0,2,1,0] → G(7),E(4),Bb(10),E(4) ✓
  'dim': [
    {
      id: 'Edim-5str',
      frets: [6, 8, 6, 8, 7, null],
      fingers: [1, 3, 1, 4, 2, null],
      barreAt: 6,
      barreStrings: [0, 2],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Edim-6str',
      frets: [null, 11, 12, 11, null, 12],
      fingers: [null, 1, 3, 2, null, 4],
      baseFret: 11,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
  ],

  // Edim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = E, G, Bb, Db (E=4, G=7, Bb=10, Db=1)
  'dim7': [
    {
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓
      // String 1 (B=11) fret 2: 11+2=13%12=1 (Db) ✓
      // String 2 (G=7) fret 3: 7+3=10 (Bb) ✓
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓
      id: 'Edim7-open',
      frets: [3, 2, 3, 2, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 2,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // Eaug - Augmented
  // Intervals: [0, 4, 8] = E, G#, C (B#)
  // Verification: [0,1,1,2,x,0] → E(4),C(0),G#(8),E(4),E(4) ✓
  'aug': [
    {
      id: 'Eaug-open',
      frets: [0, 1, 1, 2, null, 0],
      fingers: [null, 1, 2, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // Esus2 - Suspended 2
  // Intervals: [0, 2, 7] = E, F#, B
  // Verification: [0,0,4,4,2,0] → E(4),B(11),B(11),F#(6),B(11),E(4) ✓
  'sus2': [
    {
      id: 'Esus2-open',
      frets: [0, 0, 4, 4, 2, 0],
      fingers: [null, null, 3, 4, 1, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Esus4 - Suspended 4
  // Intervals: [0, 5, 7] = C, F, G
  'sus4': [
    {
      id: 'Esus4-open',
      frets: [0, 0, 2, 2, 2, 0],
      fingers: [null, null, 2, 3, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // E7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = E, A, B, D
  '7sus4': [
    {
      // String 1 (E=4) fret 5: 4+5=9 (A) ✓ P4
      // String 2 (B=11) fret 5: 11+5=16%12=4 (E) ✓ root
      // String 3 (G=7) fret 7: 7+7=14%12=2 (D) ✓ m7
      // String 4 (D=2) fret 9: 2+9=11 (B) ✓ P5
      // String 5 (A=9) fret 7: 9+7=16%12=4 (E) ✓ root
      id: 'E7sus4-A',
      frets: [5, 5, 7, 9, 7, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 5,
      barreStrings: [0, 1],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // E6 - Major 6
  // Intervals: [0, 4, 7, 9] = C, E, G, A
  '6': [
    {
      // 6弦ルート移動フォーム (Form 1) - E: X=0
      // 5弦使用: [null, X+2, X+1, null, X+2, X] = [null, 2, 1, null, 2, 0]
      id: 'E6-6str-form1',
      frets: [null, 2, 1, null, 2, 0],
      fingers: [null, 3, 2, null, 4, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, true, false, false],
      difficulty: 'medium',
    },
    {
      id: 'E6-open',
      frets: [0, 2, 1, 2, 2, 0],
      fingers: [null, 3, 1, 2, 4, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Em6 - Minor 6
  // Intervals: [0, 3, 7, 9] = C, D#, G, A
  'm6': [
    {
      id: 'Em6-open',
      frets: [0, 2, 0, 2, 2, 0],
      fingers: [null, 1, null, 2, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // EmM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = E, G, B, D#
  // Verification: [0,0,0,1,2,0] → E(4),B(11),G(7),D#(3),B(11),E(4) ✓
  'mM7': [
    {
      id: 'EmM7-open',
      frets: [0, 0, 0, 1, 2, 0],
      fingers: [null, null, null, 1, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // E9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = E, G#, B, D, F#
  // Verification: [2,0,1,0,2,0] → F#(6),B(11),G#(8),D(2),B(11),E(4) ✓
  '9': [
    {
      id: 'E9-open',
      frets: [2, 0, 1, 0, 2, 0],
      fingers: [2, null, 1, null, 3, null],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Em9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = E, G, B, D, F# (4, 7, 11, 2, 6)
  'm9': [
    {
      // Open position
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓ root
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓ 5th
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ m3
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ m7
      // String 4 (A=9) fret 2: 9+2=11 (B) ✓ 5th
      // String 5 (E=4) fret 2: 4+2=6 (F#) ✓ 9th
      id: 'Em9-open',
      frets: [0, 0, 0, 0, 2, 2],
      fingers: [null, null, null, null, 1, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // EM9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = E, G#, B, D#, F# (4, 8, 11, 3, 6)
  'M9': [
    {
      id: 'EM9-open',
      frets: [null, 7, 8, 6, 7, null],
      fingers: [null, 2, 4, 1, 3, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'EM9-barre',
      frets: [7, 7, 8, 9, 7, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 7,
      barreStrings: [1, 5],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // E9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = E, A, B, D, F# (4, 9, 11, 2, 6)
  '9sus4': [
    {
      // Open position
      // String 0 (E=4) fret 0: 4+0=4 (E) ✓ root
      // String 1 (B=11) fret 0: 11+0=11 (B) ✓ 5th
      // String 2 (G=7) fret 2: 7+2=9 (A) ✓ sus4
      // String 3 (D=2) fret 0: 2+0=2 (D) ✓ m7
      // String 4 (A=9) fret 0: 9+0=9 (A) ✓ sus4
      // String 5 (E=4) fret 2: 4+2=6 (F#) ✓ 9th
      id: 'E9sus4-open',
      frets: [0, 0, 2, 0, 0, 2],
      fingers: [null, null, 2, null, null, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Eadd9 - Add 9
  // Intervals: [0, 4, 7, 14] = C, E, G, D
  'add9': [
    {
      id: 'Eadd9-open',
      frets: [0, 0, 1, 2, 2, 2],
      fingers: [null, null, 1, 2, 3, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
    {
      // Eadd9-high: 4弦ルートの高位ポジション
      // 1弦(E=4)+2=6 (F#) 9th, 2弦(B=11)+0=11 (B) 5th
      // 3弦(G=7)+1=8 (G#) M3, 4弦(D=2)+2=4 (E) root
      id: 'Eadd9-high',
      frets: [2, 0, 1, 2, null, null],
      fingers: [3, null, 1, 4, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // E69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = E, G#, B, C#, F#
  // 5弦ルート移動フォーム (5弦7フレット = E)
  '69': [
    {
      id: 'E69-A',
      frets: [7, 7, 6, 6, 7, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Em69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = E, G, B, C#, F#
  'm69': [
    {
      // フォーム1: 低フレット
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓ 9th
      // String 2 (G=7) fret 6: 7+6=13%12=1 (C#) ✓ 6th
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓ m3
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓ root
      id: 'Em69-form1',
      frets: [null, 7, 6, 5, 7, null],
      fingers: [null, 3, 2, 1, 4, null],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // フォーム2: 低いポジション
      // String 0 (E=4) fret 2: 4+2=6 (F#) ✓ 9th
      // String 1 (B=11) fret 2: 11+2=13%12=1 (C#) ✓ 6th
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ m3
      // String 3 (D=2) fret 2: 2+2=4 (E) ✓ root
      id: 'Em69-form2',
      frets: [2, 2, 0, 2, null, null],
      fingers: [1, 2, null, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // E-5 - Major flat 5
  // Intervals: [0, 4, 6] = E, G#, Bb
  '-5': [
    {
      // String 2 (B=11) fret 9: 11+9=20%12=8 (G#) ✓ M3
      // String 3 (G=7) fret 9: 7+9=16%12=4 (E) ✓ root
      // String 4 (D=2) fret 8: 2+8=10 (Bb) ✓ b5
      // String 5 (A=9) fret 7: 9+7=16%12=4 (E) ✓ root
      id: 'E-5-A',
      frets: [null, 9, 9, 8, 7, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // E7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = E, G#, Bb, D (E=4, G#=8, Bb=10, D=2)
  '7-5': [
    {
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 8: 2+8=10 (Bb) ✓
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓
      id: 'E7-5-1',
      frets: [null, 9, 7, 8, 7, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // E7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = E, G#, C, D (E=4, G#=8, C=0, D=2)
  '7+5': [
    {
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓
      id: 'E7+5-1',
      frets: [null, 9, 7, 10, 7, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // EM7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = E, G#, Bb, D# (E=4, G#=8, Bb=10, D#=3)
  'M7-5': [
    {
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (D#) ✓
      // String 3 (D=2) fret 8: 2+8=10 (Bb) ✓
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓
      id: 'EM7-5-1',
      frets: [null, 9, 8, 8, 7, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Em7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = E, G, C, D (4, 7, 0, 2)
  'm7+5': [
    {
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 10: 2+10=12%12=0 (C) ✓
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓
      id: 'Em7+5-1',
      frets: [null, 8, 7, 10, 7, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 7,
      barreStrings: [2, 4],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // E7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = E, G#, B, D, F## (4, 8, 11, 2, 7)
  '7+9': [
    {
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G=F##) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 6: 2+6=8 (G#) ✓
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓
      id: 'E7+9-1',
      frets: [null, 8, 7, 6, 7, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // E4.4 - Quartal chord (E-A-D)
  // Intervals: [0, 5, 10] = E, A, D (4, 9, 2)
  '4.4': [
    {
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓
      id: 'E4.4-1',
      frets: [null, 10, 7, 7, 7, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 7,
      barreStrings: [2, 4],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Eblk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = E, F#, Bb, D (E=4, F#=6, Bb=10, D=2)
  'blk': [
    {
      // String 1 (B=11) fret 7: 11+7=18%12=6 (F#) ✓
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓
      // String 3 (D=2) fret 8: 2+8=10 (Bb) ✓
      // String 4 (A=9) fret 7: 9+7=16%12=4 (E) ✓
      id: 'Eblk-A',
      frets: [null, 7, 7, 8, 7, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 7,
      barreStrings: [1, 4],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // パワーコード (1種)
  // ============================================

  // E5 - Power Chord (root + P5)
  // Intervals: [0, 7] = E, B
  '5': [
    {
      id: 'E5-power5',
      frets: [null, null, null, 9, 7, null],
      fingers: [null, null, null, 3, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 7,
      muted: [true, true, true, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'E5-power6',
      frets: [null, null, null, null, 2, 0],
      fingers: [null, null, null, null, 3, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 0,
      muted: [true, true, true, true, false, false],
      difficulty: 'easy',
    },
  ],

};

// Eルートの分数コード（10パターン）
// E = MIDI 4, Major triad = [4, 8, 11] = E, G#, B
export const E_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // E/F# - E major with F# bass (interval 2)
  // E=4, G#=8, B=11, Bass F#=6
  'major/2': [
    {
      // Open E with F# bass on string 6
      // String 1 (E=4) fret 0: 4+0=4 (E) ✓
      // String 2 (B=11) fret 0: 11+0=11 (B) ✓
      // String 3 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 4 (D=2) fret 2: 2+2=4 (E) ✓
      // String 5 (A=9) fret 2: 9+2=11 (B) ✓
      // String 6 (E=4) fret 2: 4+2=6 (F#) ✓ Bass
      id: 'E-major-2-1',
      frets: [0, 0, 1, 2, 2, 2],
      fingers: [null, null, 1, 2, 3, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],
  // E/G# - E major with G# bass (interval 4)
  // E=4, G#=8, B=11, Bass G#=8
  'major/4': [
    {
      // G# bass on string 6 fret 4
      // String 1 (E=4) fret 0: 4+0=4 (E) ✓
      // String 2 (B=11) fret 0: 11+0=11 (B) ✓
      // String 3 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 4 (D=2) fret 2: 2+2=4 (E) ✓
      // String 5 (A=9) fret 2: 9+2=11 (B) ✓
      // String 6 (E=4) fret 4: 4+4=8 (G#) ✓ Bass
      id: 'E-major-4-1',
      frets: [0, 0, 1, 2, 2, 4],
      fingers: [null, null, 1, 2, 3, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],
  // E/A - E major with A bass (interval 5)
  // E=4, G#=8, B=11, Bass A=9
  'major/5': [
    {
      // A bass on open string 5
      // String 1 (E=4) fret 0: 4+0=4 (E) ✓
      // String 2 (B=11) fret 0: 11+0=11 (B) ✓
      // String 3 (G=7) fret 1: 7+1=8 (G#) ✓
      // String 4 (D=2) fret 2: 2+2=4 (E) ✓
      // String 5 (A=9) fret 0: 9+0=9 (A) ✓ Bass
      id: 'E-major-5-1',
      frets: [0, 0, 1, 2, 0, null],
      fingers: [null, null, 1, 2, null, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // E/B - E major with B bass (interval 7)
  // E=4, G#=8, B=11, Bass=B(11)
  // String 5 (A=9) fret 2: 9+2=11 (B) ✓ Bass
  // String 4 (D=2) fret 2: 2+2=4 (E) ✓
  // String 3 (G=7) fret 1: 7+1=8 (G#) ✓
  // String 2 (B=11) open: B(11) ✓
  // String 1 (E=4) open: E(4) ✓
  'major/5th': [
    {
      id: 'E-major-5th-1',
      frets: [0, 0, 1, 2, 2, null],
      fingers: [null, null, 1, 3, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // E/D# - E major with D# bass (interval 11 from E = 4+11=15%12=3)
  // E=4, G#=8, B=11, Bass=D#(3)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 ✓
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for E(4): fret = (4-11+12)%12 = 5 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'major/7': [
    {
      id: 'E-major-7-1',
      frets: [4, 5, 4, 6, 6, null],
      fingers: [1, 2, 1, 3, 4, null],
      barreAt: 4,
      barreStrings: [0, 2],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // E/C# - E major with C# bass (interval 9 from E = 4+9=13%12=1)
  // E=4, G#=8, B=11, Bass=C#(1)
  // String 5 (A=9): for C#(1): fret = (1-9+12)%12 = 4 ✓
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for E(4): fret = (4-11+12)%12 = 5 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'major/9': [
    {
      id: 'E-major-9-1',
      frets: [4, 5, 4, 6, 4, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // E/D - E major with D bass (interval 10 from E = 4+10=14%12=2)
  // E=4, G#=8, B=11, Bass=D(2)
  // String 5 (A=9): for D(2): fret = (2-9+12)%12 = 5 ✓
  // String 4 (D=2): for G#(8): fret = (8-2+12)%12 = 6 ✓
  // String 3 (G=7): for B(11): fret = (11-7+12)%12 = 4 ✓
  // String 2 (B=11): for E(4): fret = (4-11+12)%12 = 5 ✓
  // String 1 (E=4): for G#(8): fret = (8-4+12)%12 = 4 ✓
  'major/10': [
    {
      id: 'E-major-10-1',
      frets: [4, 5, 4, 6, 5, null],
      fingers: [1, 2, 1, 4, 3, null],
      barreAt: 4,
      barreStrings: [0, 2],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // マイナー分数 (2種)
  // Em/G - Em with G bass (interval 3 = minor 3rd)
  // Em = E(4), G(7), B(11), Bass=G(7)
  // String 6 (E=4): for G(7): fret = (7-4+12)%12 = 3 ✓ (BASS)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for G(7): fret = 0 ✓ (open)
  // String 2 (B=11): for B(11): fret = 0 ✓ (open)
  // String 1 (E=4): for E(4): fret = 0 ✓ (open)
  'minor/3': [
    {
      id: 'E-minor-3-1',
      frets: [0, 0, 0, 2, 2, 3],
      fingers: [null, null, null, 1, 2, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'easy',
    },
  ],

  // Em/B - Em with B bass (interval 7 = 5th)
  // Em = E(4), G(7), B(11), Bass=B(11)
  // String 5 (A=9): for B(11): fret = (11-9+12)%12 = 2 ✓ (BASS)
  // String 4 (D=2): for E(4): fret = (4-2+12)%12 = 2 ✓
  // String 3 (G=7): for G(7): fret = 0 ✓ (open)
  // String 2 (B=11): for B(11): fret = 0 ✓ (open)
  // String 1 (E=4): for E(4): fret = 0 ✓ (open)
  'minor/7': [
    {
      id: 'E-minor-7-1',
      frets: [0, 0, 0, 2, 2, null],
      fingers: [null, null, null, 1, 2, null],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // マイナー7分数 (2種)
  // Em7/B - Em7 with B(5th) in bass
  // Em7 = E(4), G(7), B(11), D(2)
  'minor7/5': [
    {
      // String 6 (E=4): fret 7 → 4+7=11 (B) ✓ 5th (BASS)
      // String 5 (A=9): fret 7 → 9+7=16%12=4 (E) ✓ root
      // String 4 (D=2): fret 5 → 2+5=7 (G) ✓ m3
      // String 3 (G=7): fret 7 → 7+7=14%12=2 (D) ✓ m7
      // String 2 (B=11): fret 8 → 11+8=19%12=7 (G) ✓ m3
      id: 'E-minor7-5-1',
      frets: [null, 8, 7, 5, 7, 7],
      fingers: [null, 4, 2, 1, 3, 3],
      barreAt: 7,
      barreStrings: [4, 5],
      baseFret: 5,
      muted: [true, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Em7/D - Em7 with D(m7) in bass
  'minor7/10': [
    {
      // String 5 (A=9): fret 5 → 9+5=14%12=2 (D) ✓ m7 (BASS)
      // Em7/D - Em7 with D(m7) in bass
      // Em7 = E(4), G(7), B(11), D(2)
      // String 4 (D=2): fret 0 → 2+0=2 (D) ✓ m7 (BASS)
      // String 3 (G=7): fret 0 → 7+0=7 (G) ✓ m3
      // String 2 (B=11): fret 0 → 11+0=11 (B) ✓ 5th
      // String 1 (E=4): fret 0 → 4+0=4 (E) ✓ root
      id: 'E-minor7-10-1',
      frets: [0, 0, 0, 0, null, null],
      fingers: [null, null, null, null, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

};
