/**
 * CaT4G - F Root Chord Data
 * Fルートの全31コード品質 + 10分数コード
 *
 * 配列順序: [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
 * 開放弦MIDI: [4(E), 11(B), 7(G), 2(D), 9(A), 4(E)]
 *
 * F = MIDI 5
 */

import type { Fingering, ChordQuality, SlashChordPattern } from '../types';

// Fルートの基本コード（31品質）
export const F_BASIC: Record<ChordQuality, Fingering[]> = {
  // ============================================
  // 基本 (5種)
  // ============================================

  // F Major - Major
  // Intervals: [0, 4, 7] = C, E, G
  '': [
    {
      id: 'F-barre',
      frets: [1, 1, 2, 3, 3, 1],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'F-easy',
      frets: [1, 1, 2, 3, null, null],
      fingers: [1, 1, 2, 3, null, null],
      barreAt: 1,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
    {
      id: 'F-barre-A',
      frets: [8, 10, 10, 10, 8, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 8,
      barreStrings: [0, 4],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Fm - Minor
  // Intervals: [0, 3, 7] = C, D#, G
  'm': [
    {
      id: 'Fm-barre-E',
      frets: [1, 1, 1, 3, 3, 1],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
    {
      id: 'Fm-barre-A',
      frets: [8, 9, 10, 10, 8, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 8,
      barreStrings: [0, 4],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F7 - Dominant 7
  // Intervals: [0, 4, 7, 10] = C, E, G, A#
  '7': [
    {
      id: 'F7-barre',
      frets: [1, 1, 2, 1, 3, 1],
      fingers: [1, 1, 2, 1, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // Fm7 - Minor 7
  // Intervals: [0, 3, 7, 10] = C, D#, G, A#
  'm7': [
    {
      id: 'Fm7-barre',
      frets: [1, 1, 1, 1, 3, 1],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // FM7 - Major 7
  // Intervals: [0, 4, 7, 11] = C, E, G, B
  'M7': [
    {
      id: 'FM7-open',
      frets: [0, 1, 2, 3, null, null],
      fingers: [null, 1, 2, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ハーフディミニッシュ系 (2種)
  // ============================================

  // Fm7-5 - Half Diminished (m7b5)
  // Intervals: [0, 3, 6, 10] = F, Ab, B, Eb (F=5, Ab=8, B=11, Eb=3)
  'm7-5': [
    {
      // String 1 (B=11) fret 9: 11+9=20%12=8 (Ab) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓
      id: 'Fm7b5-A',
      frets: [null, 9, 8, 9, 8, null],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Fm-5 - Minor flat 5 (diminished triad variant)
  // Intervals: [0, 3, 6] = F, Ab, Cb/B
  'm-5': [
    {
      // String 1 (B=11) fret 9: 11+9=20%12=8 (Ab) ✓
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓
      id: 'Fm-5-A',
      frets: [null, 9, 10, 9, 8, null],
      fingers: [null, 2, 4, 3, 1, null],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // ディミニッシュ/オーギュメント (3種)
  // ============================================

  // Fdim - Diminished
  // Intervals: [0, 3, 6] = F, Ab, Cb(B)
  // Verification: [1,0,1,3,2,1] → F(5),B(11),Ab(8),F(5),B(11),F(5) ✓
  'dim': [
    {
      id: 'Fdim-5str',
      frets: [7, 9, 7, 9, 8, null],
      fingers: [1, 3, 1, 4, 2, null],
      barreAt: 7,
      barreStrings: [0, 2],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'Fdim-6str',
      frets: [null, 0, 1, 0, null, 1],
      fingers: [null, null, 2, null, null, 1],
      baseFret: 1,
      muted: [true, false, false, false, true, false],
      difficulty: 'easy',
    },
  ],

  // Fdim7 - Diminished 7
  // Intervals: [0, 3, 6, 9] = F, Ab, B, D (F=5, Ab=8, B=11, D=2)
  'dim7': [
    {
      // String 0 (E=4) fret 4: 4+4=8 (Ab) ✓
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓
      // String 2 (G=7) fret 4: 7+4=11 (B) ✓
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓
      id: 'Fdim7-std',
      frets: [4, 3, 4, 3, null, null],
      fingers: [2, 1, 3, 1, null, null],
      baseFret: 3,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // Faug - Augmented
  // Intervals: [0, 4, 8] = F, A, C#
  // Verification: [1,2,2,3,x,1] → F(5),C#(1),A(9),F(5),F(5) ✓
  'aug': [
    {
      id: 'Faug-barre',
      frets: [1, 2, 2, 3, null, 1],
      fingers: [1, 2, 2, 4, null, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // サスペンド系 (3種)
  // ============================================

  // Fsus2 - Suspended 2
  // Intervals: [0, 2, 7] = F, G, C (5, 7, 0)
  'sus2': [
    {
      // String 0 (E=4) fret 1: 4+1=5 (F) ✓ root
      // String 1 (B=11) fret 1: 11+1=12%12=0 (C) ✓ 5th
      // String 2 (G=7) fret 0: 7+0=7 (G) ✓ 2nd
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ root
      // String 4 (A=9) fret 3: 9+3=12%12=0 (C) ✓ 5th
      // String 5 (E=4) fret 1: 4+1=5 (F) ✓ root
      id: 'Fsus2-barre',
      frets: [1, 1, 0, 3, 3, 1],
      fingers: [1, 1, null, 3, 4, 1],
      barreAt: 1,
      barreStrings: [0, 5] as [number, number],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium' as const,
    },
  ],

  // Fsus4 - Suspended 4
  // Intervals: [0, 5, 7] = C, F, G
  'sus4': [
    {
      id: 'Fsus4-barre',
      frets: [1, 1, 3, 3, 3, 1],
      fingers: [1, 1, 3, 3, 4, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // F7sus4 - Dominant 7 sus4
  // Intervals: [0, 5, 7, 10] = F, Bb, C, Eb
  '7sus4': [
    {
      // String 1 (E=4) fret 6: 4+6=10 (Bb) ✓ P4
      // String 2 (B=11) fret 6: 11+6=17%12=5 (F) ✓ root
      // String 3 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓ m7
      // String 4 (D=2) fret 10: 2+10=12%12=0 (C) ✓ P5
      // String 5 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'F7sus4-A',
      frets: [6, 6, 8, 10, 8, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 6,
      barreStrings: [0, 1],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // シックス系 (2種)
  // ============================================

  // F6 - Major 6
  // Intervals: [0, 4, 7, 9] = C, E, G, A
  '6': [
    {
      // 6弦ルート移動フォーム (Form 1) - F: X=1
      // 5弦使用: [null, X+2, X+1, null, X+2, X] = [null, 3, 2, null, 3, 1]
      id: 'F6-6str-form1',
      frets: [null, 3, 2, null, 3, 1],
      fingers: [null, 3, 2, null, 4, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, true, false, false],
      difficulty: 'medium',
    },
    {
      id: 'F6-barre',
      frets: [1, 3, 2, 3, null, 1],
      fingers: [1, 3, 2, 4, null, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      difficulty: 'hard',
    },
  ],

  // Fm6 - Minor 6
  // Intervals: [0, 3, 7, 9] = C, D#, G, A
  'm6': [
    {
      id: 'Fm6-barre',
      frets: [1, 3, 1, 3, 3, 1],
      fingers: [1, 3, 1, 4, 2, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // マイナーメジャー (1種)
  // ============================================

  // FmM7 - Minor Major 7
  // Intervals: [0, 3, 7, 11] = F, Ab, C, E
  // E-shape barre: [1,1,1,2,3,1] → F(5),C(0),Ab(8),E(4),C(0),F(5) ✓
  'mM7': [
    {
      id: 'FmM7-barre',
      frets: [1, 1, 1, 2, 3, 1],
      fingers: [1, 1, 1, 2, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // ナインス系 (5種)
  // ============================================

  // F9 - Dominant 9
  // Intervals: [0, 4, 7, 10, 14] = F, A, C, Eb, G (5, 9, 0, 3, 7)
  '9': [
    {
      // String 0 (E=4) fret 5: 4+5=9 (A) ✓ M3
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ 9th
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓ m7
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓ M3
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'F9-A',
      frets: [5, 8, 8, 7, 8, null],
      fingers: [1, 3, 4, 2, 3, null],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
  ],

  // Fm9 - Minor 9
  // Intervals: [0, 3, 7, 10, 14] = F, Ab, C, Eb, G (5, 8, 0, 3, 7)
  'm9': [
    {
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 5th
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ 9th
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓ m7
      // String 3 (D=2) fret 6: 2+6=8 (Ab) ✓ m3
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'Fm9-A',
      frets: [8, 8, 8, 6, 8, null],
      fingers: [2, 3, 4, 1, 2, null],
      barreAt: 8,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // FM9 - Major 9
  // Intervals: [0, 4, 7, 11, 14] = F, A, C, E, G (5, 9, 0, 4, 7)
  'M9': [
    {
      id: 'FM9-open',
      frets: [null, 8, 9, 7, 8, null],
      fingers: [null, 2, 4, 1, 3, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      id: 'FM9-barre',
      frets: [8, 8, 9, 10, 8, null],
      fingers: [1, 1, 2, 4, 1, null],
      barreAt: 8,
      barreStrings: [1, 5],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // F9sus4 - Dominant 9 sus4
  // Intervals: [0, 5, 7, 10, 14] = F, Bb, C, Eb, G (5, 10, 0, 3, 7)
  '9sus4': [
    {
      // String 0 (E=4) fret 6: 4+6=10 (Bb) ✓ sus4
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ 9th
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓ m7
      // String 3 (D=2) fret 8: 2+8=10 (Bb) ✓ sus4
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'F9sus4-A',
      frets: [6, 8, 8, 8, 8, null],
      fingers: [1, 2, 3, 4, 2, null],
      barreAt: 8,
      barreStrings: [1, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Fadd9 - Add 9
  // Intervals: [0, 4, 7, 14] = F, A, C, G (5, 9, 0, 7)
  'add9': [
    {
      // String 0 (E=4) fret 8: 4+8=12%12=0 (C) ✓ 5th
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓ M3
      // String 2 (G=7) fret 10: 7+10=17%12=5 (F) ✓ root
      // String 3 (D=2) fret 5: 2+5=7 (G) ✓ 9th
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'Fadd9-A',
      frets: [8, 10, 10, 5, 8, null],
      fingers: [2, 3, 4, 1, 2, null],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium' as const,
    },
    {
      // High position moveable shape (3rd fret position)
      // 4th string 3rd fret = F (root)
      // 3rd string 2nd fret = A (3rd)
      // 2nd string 1st fret = C (5th)
      // 1st string 3rd fret = G (9th)
      id: 'Fadd9-high',
      frets: [3, 1, 2, 3, null, null],
      fingers: [4, 1, 2, 3, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium' as const,
    },
  ],

  // ============================================
  // シックスナインス系 (2種)
  // ============================================

  // F69 - Major 6/9
  // Intervals: [0, 4, 7, 9, 14] = F, A, C, D, G
  // 5弦ルート移動フォーム (5弦8フレット = F)
  '69': [
    {
      id: 'F69-A',
      frets: [8, 8, 7, 7, 8, null],
      fingers: [3, 3, 1, 2, 4, null],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Fm69 - Minor 6/9
  // Intervals: [0, 3, 7, 9, 14] = F, Ab, C, D, G
  'm69': [
    {
      // フォーム1: 低フレット
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓ 9th
      // String 2 (G=7) fret 7: 7+7=14%12=2 (D) ✓ 6th
      // String 3 (D=2) fret 6: 2+6=8 (Ab) ✓ m3
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'Fm69-form1',
      frets: [null, 8, 7, 6, 8, null],
      fingers: [null, 3, 2, 1, 4, null],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // フォーム2: 低いポジション
      // String 0 (E=4) fret 3: 4+3=7 (G) ✓ 9th
      // String 1 (B=11) fret 3: 11+3=14%12=2 (D) ✓ 6th
      // String 2 (G=7) fret 1: 7+1=8 (Ab) ✓ m3
      // String 3 (D=2) fret 3: 2+3=5 (F) ✓ root
      id: 'Fm69-form2',
      frets: [3, 3, 1, 3, null, null],
      fingers: [2, 3, 1, 4, null, null],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オルタード系 (6種)
  // ============================================

  // F-5 - Major flat 5
  // Intervals: [0, 4, 6] = F, A, B
  '-5': [
    {
      // String 2 (B=11) fret 10: 11+10=21%12=9 (A) ✓ M3
      // String 3 (G=7) fret 10: 7+10=17%12=5 (F) ✓ root
      // String 4 (D=2) fret 9: 2+9=11 (B) ✓ b5
      // String 5 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'F-5-A',
      frets: [null, 10, 10, 9, 8, null],
      fingers: [null, 3, 4, 2, 1, null],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F7-5 - Dominant 7 flat 5
  // Intervals: [0, 4, 6, 10] = F, A, B, Eb (5, 9, 11, 3)
  '7-5': [
    {
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓ M3
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓ m7
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓ b5
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'F7-5-1',
      frets: [null, 10, 8, 9, 8, null],
      fingers: [null, 4, 1, 3, 2, null],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F7+5 - Dominant 7 sharp 5 (= aug7)
  // Intervals: [0, 4, 8, 10] = F, A, C#, Eb (5, 9, 1, 3)
  '7+5': [
    {
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓ M3
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓ m7
      // String 3 (D=2) fret 11: 2+11=13%12=1 (C#) ✓ #5
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'F7+5-1',
      frets: [null, 10, 8, 11, 8, null],
      fingers: [null, 3, 1, 4, 2, null],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // FM7-5 - Major 7 flat 5
  // Intervals: [0, 4, 6, 11] = F, A, B, E (5, 9, 11, 4)
  'M7-5': [
    {
      // String 1 (B=11) fret 10: 11+10=21%12=9 (A) ✓ M3
      // String 2 (G=7) fret 9: 7+9=16%12=4 (E) ✓ M7
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓ b5
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓ root
      id: 'FM7-5-1',
      frets: [null, 10, 9, 9, 8, null],
      fingers: [null, 4, 2, 3, 1, null],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Fm7+5 - Minor 7 sharp 5
  // Intervals: [0, 3, 8, 10] = F, Ab, C#, Eb (5, 8, 1, 3)
  'm7+5': [
    {
      // String 1 (B=11) fret 9: 11+9=20%12=8 (Ab) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓
      // String 3 (D=2) fret 11: 2+11=13%12=1 (C#) ✓
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓
      id: 'Fm7+5-1',
      frets: [null, 9, 8, 11, 8, null],
      fingers: [null, 2, 1, 4, 1, null],
      barreAt: 8,
      barreStrings: [2, 4],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F7+9 - Dominant 7 sharp 9 (Hendrix chord)
  // Intervals: [0, 4, 7, 10, 15] = F, A, C, Eb, G# (5, 9, 0, 3, 8)
  '7+9': [
    {
      // String 1 (B=11) fret 9: 11+9=20%12=8 (G#) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓
      // String 3 (D=2) fret 7: 2+7=9 (A) ✓
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓
      id: 'F7+9-1',
      frets: [null, 9, 8, 7, 8, null],
      fingers: [null, 4, 2, 1, 3, null],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // ============================================
  // 特殊 (2種)
  // ============================================

  // F4.4 - Quartal chord (F-Bb-Eb)
  // Intervals: [0, 5, 10] = F, Bb, Eb (5, 10, 3)
  '4.4': [
    {
      // String 1 (B=11) fret 11: 11+11=22%12=10 (Bb) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓
      // String 3 (D=2) fret 8: 2+8=10 (Bb) ✓
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓
      id: 'F4.4-1',
      frets: [null, 11, 8, 8, 8, null],
      fingers: [null, 4, 1, 1, 1, null],
      barreAt: 8,
      barreStrings: [2, 4],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Fblk - Blackadder chord
  // Intervals: [0, 2, 6, 10] = F, G, B, Eb (F=5, G=7, B=11, Eb=3)
  'blk': [
    {
      // String 1 (B=11) fret 8: 11+8=19%12=7 (G) ✓
      // String 2 (G=7) fret 8: 7+8=15%12=3 (Eb) ✓
      // String 3 (D=2) fret 9: 2+9=11 (B) ✓
      // String 4 (A=9) fret 8: 9+8=17%12=5 (F) ✓
      id: 'Fblk-A',
      frets: [null, 8, 8, 9, 8, null],
      fingers: [null, 1, 1, 2, 1, null],
      barreAt: 8,
      barreStrings: [1, 4],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // ============================================
  // パワーコード (1種)
  // ============================================

  // F5 - Power Chord (root + P5)
  // Intervals: [0, 7] = F, C
  '5': [
    {
      id: 'F5-power5',
      frets: [null, null, null, 10, 8, null],
      fingers: [null, null, null, 3, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 8,
      muted: [true, true, true, false, false, true],
      difficulty: 'easy',
    },
    {
      id: 'F5-power6',
      frets: [null, null, null, null, 3, 1],
      fingers: [null, null, null, null, 3, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, true, true, false, false],
      difficulty: 'easy',
    },
  ],

};

// Fルートの分数コード（10パターン）
// F = MIDI 5, Major triad = [5, 9, 0] = F, A, C
export const F_SLASH: Record<SlashChordPattern, Fingering[]> = {
  // メジャー分数 (6種)
  // F/G - F major with G bass (interval 2)
  // F=5, A=9, C=0, Bass G=7
  'major/2': [
    {
      // F barre with G bass on string 6
      // String 1 (E=4) fret 1: 4+1=5 (F) ✓
      // String 2 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 3 (G=7) fret 2: 7+2=9 (A) ✓
      // String 4 (D=2) fret 3: 2+3=5 (F) ✓
      // String 5 (A=9) fret 3: 9+3=12%12=0 (C) ✓
      // String 6 (E=4) fret 3: 4+3=7 (G) ✓ Bass
      id: 'F-major-2-1',
      frets: [1, 1, 2, 3, 3, 3],
      fingers: [1, 1, 2, 3, 3, 4],
      barreAt: 1,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],
  // F/A - F major with A bass (interval 4)
  // F=5, A=9, C=0, Bass A=9
  'major/4': [
    {
      // F with open A bass
      // String 1 (E=4) fret 1: 4+1=5 (F) ✓
      // String 2 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 3 (G=7) fret 2: 7+2=9 (A) ✓
      // String 4 (D=2) fret 3: 2+3=5 (F) ✓
      // String 5 (A=9) fret 0: 9+0=9 (A) ✓ Bass
      id: 'F-major-4-1',
      frets: [1, 1, 2, 3, 0, null],
      fingers: [1, 1, 2, 3, null, null],
      barreAt: 1,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],
  // F/Bb - F major with Bb bass (interval 5)
  // F=5, A=9, C=0, Bass Bb=10
  'major/5': [
    {
      // F with Bb bass on string 5
      // String 1 (E=4) fret 1: 4+1=5 (F) ✓
      // String 2 (B=11) fret 1: 11+1=12%12=0 (C) ✓
      // String 3 (G=7) fret 2: 7+2=9 (A) ✓
      // String 4 (D=2) fret 3: 2+3=5 (F) ✓
      // String 5 (A=9) fret 1: 9+1=10 (Bb) ✓ Bass
      id: 'F-major-5-1',
      frets: [1, 1, 2, 3, 1, null],
      fingers: [1, 1, 2, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F/C - F major with C bass (interval 7)
  // F=5, A=9, C=0, Bass=C(0)
  // String 5 (A=9) fret 3: 9+3=12%12=0 (C) ✓ Bass
  // String 4 (D=2) fret 3: 2+3=5 (F) ✓
  // String 3 (G=7) fret 2: 7+2=9 (A) ✓
  // String 2 (B=11) fret 1: 11+1=12%12=0 (C) ✓
  // String 1 (E=4) fret 1: 4+1=5 (F) ✓
  'major/5th': [
    {
      id: 'F-major-5th-1',
      frets: [1, 1, 2, 3, 3, null],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 1,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // F/E - F major with E bass (interval 11 from F = 5+11=16%12=4)
  // F=5, A=9, C=0, Bass=E(4)
  // String 6 (E=4): for E(4): fret = (4-4+12)%12 = 0 ✓ (open!)
  // String 5 (A=9): for F(5): fret = (5-9+12)%12 = 8 → too high, try string 4
  // Better: Use open E as bass
  // String 4 (D=2): for A(9): fret = (9-2+12)%12 = 7 → too high
  // Try compact voicing:
  // String 6 (E=4): for E(4): fret = 0 ✓ (BASS)
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/7': [
    {
      id: 'F-major-7-1',
      frets: [1, 1, 2, 3, 3, 0],
      fingers: [1, 1, 2, 4, 3, null],
      barreAt: 1,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // F/D - F major with D bass (interval 9 from F = 5+9=14%12=2)
  // F=5, A=9, C=0, Bass=D(2)
  // String 4 (D=2): for D(2): fret = (2-2+12)%12 = 0 ✓ (open! BASS)
  // String 3 (G=7): for A(9): fret = (9-7+12)%12 = 2 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'major/9': [
    {
      id: 'F-major-9-1',
      frets: [1, 1, 2, 0, null, null],
      fingers: [1, 1, 2, null, null, null],
      barreAt: 1,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      difficulty: 'easy',
    },
  ],

  // F/D# - F major with D# bass (interval 10 from F = 5+10=15%12=3)
  // F=5, A=9, C=0, Bass=D#(3)
  // String 5 (A=9): for D#(3): fret = (3-9+12)%12 = 6 ✓ (BASS)
  // String 4 (D=2): for A(9): fret = (9-2+12)%12 = 7 → span too big
  // Try different voicing:
  // String 6 (E=4): for D#(3): fret = (3-4+12)%12 = 11 → too high
  // Better compact voicing at higher position:
  // String 5 (A=9): for D#(3): fret = 6 ✓ (BASS)
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for C(0): fret = (0-7+12)%12 = 5 ✓
  // String 2 (B=11): for F(5): fret = (5-11+12)%12 = 6 ✓
  // String 1 (E=4): for A(9): fret = (9-4+12)%12 = 5 ✓
  'major/10': [
    {
      id: 'F-major-10-1',
      frets: [5, 6, 5, 3, 6, null],
      fingers: [1, 3, 2, 1, 4, null],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // マイナー分数 (2種)
  // Fm/Ab - Fm with Ab bass (interval 3 = minor 3rd)
  // Fm = F(5), Ab(8), C(0), Bass=Ab(8)
  // String 6 (E=4): for Ab(8): fret = (8-4+12)%12 = 4 ✓ (BASS)
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for Ab(8): fret = (8-7+12)%12 = 1 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'minor/3': [
    {
      id: 'F-minor-3-1',
      frets: [1, 1, 1, 3, 3, 4],
      fingers: [1, 1, 1, 3, 4, 4],
      barreAt: 1,
      barreStrings: [0, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Fm/C - Fm with C bass (interval 7 = 5th)
  // Fm = F(5), Ab(8), C(0), Bass=C(0)
  // String 5 (A=9): for C(0): fret = (0-9+12)%12 = 3 ✓ (BASS)
  // String 4 (D=2): for F(5): fret = (5-2+12)%12 = 3 ✓
  // String 3 (G=7): for Ab(8): fret = (8-7+12)%12 = 1 ✓
  // String 2 (B=11): for C(0): fret = (0-11+12)%12 = 1 ✓
  // String 1 (E=4): for F(5): fret = (5-4+12)%12 = 1 ✓
  'minor/7': [
    {
      id: 'F-minor-7-1',
      frets: [1, 1, 1, 3, 3, null],
      fingers: [1, 1, 1, 3, 4, null],
      barreAt: 1,
      barreStrings: [0, 2],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // マイナー7分数 (2種)
  // Fm7/C - Fm7 with C(5th) in bass
  // Fm7 = F(5), Ab(8), C(0), Eb(3)
  'minor7/5': [
    {
      // String 6 (E=4): fret 8 → 4+8=12%12=0 (C) ✓ 5th (BASS)
      // String 5 (A=9): fret 8 → 9+8=17%12=5 (F) ✓ root
      // String 4 (D=2): fret 6 → 2+6=8 (Ab) ✓ m3
      // String 3 (G=7): fret 8 → 7+8=15%12=3 (Eb) ✓ m7
      // String 2 (B=11): fret 9 → 11+9=20%12=8 (Ab) ✓ m3
      id: 'F-minor7-5-1',
      frets: [null, 9, 8, 6, 8, 8],
      fingers: [null, 4, 2, 1, 3, 3],
      barreAt: 8,
      barreStrings: [4, 5],
      baseFret: 6,
      muted: [true, false, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Fm7/Eb - Fm7 with Eb(m7) in bass
  // Fm7 = F(5), Ab(8), C(0), Eb(3)
  'minor7/10': [
    {
      // String 5 (A=9): fret 6 → 9+6=15%12=3 (Eb) ✓ m7 (BASS)
      // String 4 (D=2): fret 3 → 2+3=5 (F) ✓ root
      // String 3 (G=7): fret 5 → 7+5=12%12=0 (C) ✓ 5th
      // String 2 (B=11): fret 4 → 11+4=15%12=3 (Eb) ✓ m7
      // String 1 (E=4): fret 4 → 4+4=8 (Ab) ✓ m3
      id: 'F-minor7-10-1',
      frets: [4, 4, 5, 3, 6, null],
      fingers: [1, 1, 3, 1, 4, null],
      barreAt: 3,
      barreStrings: [0, 3],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

};
