/**
 * CaT4G - Chord Utilities
 * 共有ユーティリティ関数
 */

/**
 * 品質文字列を正規化（エイリアス解決）
 * 様々な表記法を標準形式に変換
 */
export function normalizeQuality(quality: string): string {
  // 一般的なエイリアスマッピング
  const aliases: Record<string, string> = {
    // メジャーセブンス
    'Δ': 'M7',
    'Δ7': 'M7',
    'ma7': 'M7',
    'Maj7': 'M7',
    'maj7': 'M7',
    'major7': 'M7',
    // メジャー
    'maj': '',
    'major': '',
    // マイナー
    'mi': 'm',
    'min': 'm',
    'minor': 'm',
    '-': 'm',
    // マイナーセブンス
    'mi7': 'm7',
    'min7': 'm7',
    'minor7': 'm7',
    '-7': 'm7',
    // マイナーメジャーセブンス
    'minMaj7': 'mM7',
    'mMaj7': 'mM7',
    'm(M7)': 'mM7',
    'm/M7': 'mM7',
    'min/maj7': 'mM7',
    'minmaj7': 'mM7',
    '-Δ7': 'mM7',
    'mΔ7': 'mM7',
    // ディミニッシュ
    'o': 'dim',
    '°': 'dim',
    'o7': 'dim7',
    '°7': 'dim7',
    // ハーフディミニッシュ
    'Ø': 'm7b5',
    'Ø7': 'm7b5',
    'ø': 'm7b5',
    'ø7': 'm7b5',
    '-7b5': 'm7b5',
    'min7b5': 'm7b5',
    'm7-5': 'm7b5',
    // オーギュメント
    'aug': '+',
    // 6th
    'maj6': '6',
    'add6': '6',
    'M6': '6',
    'min6': 'm6',
    '-6': 'm6',
    // sus
    'sus': 'sus4',
    'suspended4': 'sus4',
    'suspended2': 'sus2',
  };

  return aliases[quality] || quality;
}
