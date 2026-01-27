/**
 * CaT4G - Music Theory: Intervals
 * 音楽理論に基づくインターバル（音程）定義
 *
 * インターバルは半音数で表現され、ルート音からの相対的な位置を示す。
 * これにより、どんなルート音でも同じコード構造を適用できる。
 */

/**
 * 基本インターバル（半音数）
 * 音楽理論における標準的な音程を半音数で定義
 */
export const INTERVALS = {
  // ルート
  R: 0, // Root（根音）

  // 2度
  m2: 1, // Minor 2nd（短2度）- b9としても使用
  M2: 2, // Major 2nd（長2度）- 9th, add9としても使用

  // 3度
  m3: 3, // Minor 3rd（短3度）- マイナーコードの特徴
  M3: 4, // Major 3rd（長3度）- メジャーコードの特徴

  // 4度
  P4: 5, // Perfect 4th（完全4度）- sus4, 11th
  A4: 6, // Augmented 4th（増4度）- #11, トライトーン

  // 5度
  d5: 6, // Diminished 5th（減5度）- b5, ディミニッシュ
  P5: 7, // Perfect 5th（完全5度）- 標準の5度
  A5: 8, // Augmented 5th（増5度）- #5, オーギュメント

  // 6度
  m6: 8, // Minor 6th（短6度）- b13としても使用
  M6: 9, // Major 6th（長6度）- 6th, 13thコード

  // 7度
  d7: 9, // Diminished 7th（減7度）- dim7コード
  m7: 10, // Minor 7th（短7度）- ドミナント7th
  M7: 11, // Major 7th（長7度）- メジャー7th
} as const;

/**
 * 拡張インターバル（オクターブ以上）
 * 9th, 11th, 13thなどのテンションノート
 */
export const EXTENDED_INTERVALS = {
  // 9度（オクターブ + 2度）
  b9: 13, // Flat 9th（短9度）
  '9': 14, // 9th（長9度）
  '#9': 15, // Sharp 9th（増9度）

  // 11度（オクターブ + 4度）
  '11': 17, // 11th（完全11度）
  '#11': 18, // Sharp 11th（増11度）

  // 13度（オクターブ + 6度）
  b13: 20, // Flat 13th（短13度）
  '13': 21, // 13th（長13度）
} as const;

export type IntervalName = keyof typeof INTERVALS;
export type ExtendedIntervalName = keyof typeof EXTENDED_INTERVALS;
export type AllIntervalName = IntervalName | ExtendedIntervalName;

/**
 * インターバル名から半音数を取得
 */
export function getIntervalSemitones(name: AllIntervalName): number {
  if (name in INTERVALS) {
    return INTERVALS[name as IntervalName];
  }
  if (name in EXTENDED_INTERVALS) {
    return EXTENDED_INTERVALS[name as ExtendedIntervalName];
  }
  throw new Error(`Unknown interval: ${name}`);
}

/**
 * 半音数をオクターブ内に正規化（0-11）
 */
export function normalizeToOctave(semitones: number): number {
  return ((semitones % 12) + 12) % 12;
}

/**
 * インターバル配列をオクターブ内に正規化（重複除去）
 */
export function normalizeIntervals(intervals: number[]): number[] {
  const normalized = new Set(intervals.map(normalizeToOctave));
  return Array.from(normalized).sort((a, b) => a - b);
}

/**
 * インターバルの日本語名
 */
export const INTERVAL_NAMES_JP: Record<string, string> = {
  R: 'ルート',
  m2: '短2度',
  M2: '長2度',
  m3: '短3度',
  M3: '長3度',
  P4: '完全4度',
  A4: '増4度',
  d5: '減5度',
  P5: '完全5度',
  A5: '増5度',
  m6: '短6度',
  M6: '長6度',
  d7: '減7度',
  m7: '短7度',
  M7: '長7度',
  b9: '短9度',
  '9': '長9度',
  '#9': '増9度',
  '11': '完全11度',
  '#11': '増11度',
  b13: '短13度',
  '13': '長13度',
};

/**
 * 半音数からインターバル名を逆引き（基本インターバルのみ）
 */
export function getSemitoneName(semitones: number): string | null {
  const normalized = normalizeToOctave(semitones);
  for (const [name, value] of Object.entries(INTERVALS)) {
    if (value === normalized) {
      return name;
    }
  }
  return null;
}
