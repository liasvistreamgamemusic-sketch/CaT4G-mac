/**
 * ComposeTab - Manual song entry form for HomePage
 *
 * Extracted from AddSongModal's manual input tab.
 * Allows creating new songs manually and navigating to edit mode.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateSongInput, CreateSectionInput } from '@/types/database';
import { useAppData } from '@/contexts/AppDataContext';

function generateDefaultTitle(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `Song${y}${m}${d}`;
}

export function ComposeTab() {
  const navigate = useNavigate();
  const { handleSaveSong } = useAppData();

  const [manualTitle, setManualTitle] = useState('');
  const [manualArtist, setManualArtist] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const sections = manualContent.trim()
      ? parseManualContent(manualContent)
      : [{ name: 'Main', lines: [] }];

    const songInput: CreateSongInput = {
      title: manualTitle.trim() || generateDefaultTitle(),
      artistName: manualArtist.trim() || undefined,
      sections,
    };

    try {
      const songId = await handleSaveSong(songInput);
      // Navigate to edit mode for manual entries
      navigate(`/songs/edit?id=${songId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-text-secondary">曲名</label>
        <input
          type="text"
          value={manualTitle}
          onChange={(e) => setManualTitle(e.target.value)}
          placeholder="空の場合は自動命名（例: Song20260123）"
          className="input-glass"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-text-secondary">アーティスト</label>
        <input
          type="text"
          value={manualArtist}
          onChange={(e) => setManualArtist(e.target.value)}
          placeholder="アーティスト名"
          className="input-glass"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-text-secondary">
          コード譜（[セクション名]で区切り）
        </label>
        <textarea
          value={manualContent}
          onChange={(e) => setManualContent(e.target.value)}
          placeholder={`[Intro]\nC  G  Am  F\n\n[Verse]\nC        G\n歌詞を入力\nAm       F\n続きの歌詞`}
          rows={10}
          className="input-glass font-mono text-sm resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn-glass btn-glass-primary px-6"
        >
          作成して編集へ
        </button>
      </div>
    </div>
  );
}

// Manual content parser (same as AddSongModal)
function parseManualContent(content: string): CreateSectionInput[] {
  const lines = content.split('\n');
  const sections: CreateSectionInput[] = [];
  let currentSection: CreateSectionInput = { name: 'Main', lines: [] };

  for (const line of lines) {
    const trimmed = line.trim();

    // Section marker
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { name: trimmed.slice(1, -1), lines: [] };
      continue;
    }

    if (trimmed === '') continue;

    // Simple parse: determine if chord line
    const tokens = trimmed.split(/\s+/);
    const chordCount = tokens.filter(isChord).length;
    const isChordLine = tokens.length > 0 && chordCount / tokens.length > 0.5;

    if (isChordLine) {
      let position = 0;
      const chords = tokens
        .filter(isChord)
        .map((chord) => {
          const pos = trimmed.indexOf(chord, position);
          position = pos + chord.length;
          return { chord, position: pos };
        });
      currentSection.lines.push({ lyrics: '', chords });
    } else {
      const lastLine = currentSection.lines[currentSection.lines.length - 1];
      if (lastLine && lastLine.lyrics === '' && lastLine.chords.length > 0) {
        lastLine.lyrics = trimmed;
      } else {
        currentSection.lines.push({ lyrics: trimmed, chords: [] });
      }
    }
  }

  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return sections.length > 0 ? sections : [{ name: 'Main', lines: [] }];
}

function isChord(token: string): boolean {
  return /^[A-G][#\u266F b\u266D]?(m|M|maj|min|dim|aug|sus[24]?|add\d+|\d+|7|9|11|13)?(\/[A-G][#\u266Fb\u266D]?)?$/.test(
    token
  );
}
