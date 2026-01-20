/**
 * AnnotationEditor - コメント入力・表示コンポーネント
 * 特定の行またはコードへのメモ・注釈を管理
 * Based on patterns from AddSongModal.tsx
 */

import { useState, useCallback, useEffect } from 'react';
import type { Annotation, UUID } from '@/types/database';
import { db } from '@/lib/api';

interface AnnotationEditorProps {
  /** 対象の行ID */
  lineId: UUID;
  /** 対象のコードインデックス（null = 行全体への注釈） */
  chordIndex?: number | null;
  /** 閉じる際のコールバック */
  onClose?: () => void;
  /** 注釈が変更された際のコールバック */
  onAnnotationChange?: () => void;
  /** コンパクト表示モード（入力欄のみ表示） */
  compact?: boolean;
  /** 読み取り専用モード */
  readOnly?: boolean;
}

/**
 * AnnotationEditor
 * 行またはコードへの注釈を管理するエディタコンポーネント
 */
export function AnnotationEditor({
  lineId,
  chordIndex = null,
  onClose,
  onAnnotationChange,
  compact = false,
  readOnly = false,
}: AnnotationEditorProps) {
  // 注釈一覧
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  // 新規追加用の入力内容
  const [newContent, setNewContent] = useState('');
  // 編集中の注釈ID
  const [editingId, setEditingId] = useState<UUID | null>(null);
  // 編集中の内容
  const [editingContent, setEditingContent] = useState('');
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);
  // エラー状態
  const [error, setError] = useState<string | null>(null);

  // 注釈を読み込む
  const loadAnnotations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allAnnotations = await db.getAnnotations(lineId);
      // chordIndex でフィルタリング
      const filtered = allAnnotations.filter(
        (a) => a.chordIndex === chordIndex
      );
      setAnnotations(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注釈の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [lineId, chordIndex]);

  // 初回読み込み
  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  // 新規追加処理
  const handleAdd = useCallback(async () => {
    if (!newContent.trim() || readOnly) return;

    try {
      setIsLoading(true);
      setError(null);
      await db.createAnnotation(lineId, newContent.trim(), chordIndex ?? undefined);
      setNewContent('');
      await loadAnnotations();
      onAnnotationChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '注釈の追加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [lineId, chordIndex, newContent, readOnly, loadAnnotations, onAnnotationChange]);

  // 編集開始
  const handleStartEdit = useCallback((annotation: Annotation) => {
    if (readOnly) return;
    setEditingId(annotation.id);
    setEditingContent(annotation.content);
  }, [readOnly]);

  // 編集キャンセル
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingContent('');
  }, []);

  // 編集保存
  const handleSaveEdit = useCallback(async () => {
    if (!editingId || !editingContent.trim() || readOnly) return;

    try {
      setIsLoading(true);
      setError(null);
      await db.updateAnnotation(editingId, editingContent.trim());
      setEditingId(null);
      setEditingContent('');
      await loadAnnotations();
      onAnnotationChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '注釈の更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [editingId, editingContent, readOnly, loadAnnotations, onAnnotationChange]);

  // 削除処理
  const handleDelete = useCallback(async (id: UUID) => {
    if (readOnly) return;

    try {
      setIsLoading(true);
      setError(null);
      await db.deleteAnnotation(id);
      await loadAnnotations();
      onAnnotationChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '注釈の削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [readOnly, loadAnnotations, onAnnotationChange]);

  // キーボードショートカット（Enter で追加/保存、Escape でキャンセル）
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, action: 'add' | 'edit') => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (action === 'add') {
          handleAdd();
        } else {
          handleSaveEdit();
        }
      } else if (e.key === 'Escape') {
        if (action === 'edit') {
          handleCancelEdit();
        } else if (onClose) {
          onClose();
        }
      }
    },
    [handleAdd, handleSaveEdit, handleCancelEdit, onClose]
  );

  // ラベル表示
  const targetLabel = chordIndex !== null && chordIndex !== undefined
    ? `コード #${chordIndex + 1}`
    : '行全体';

  // コンパクトモード
  if (compact) {
    return (
      <div className="space-y-2">
        {/* 既存の注釈 */}
        {annotations.length > 0 && (
          <div className="space-y-1">
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="flex items-start gap-2 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1"
              >
                <span className="flex-1 text-text-primary whitespace-pre-wrap">
                  {annotation.content}
                </span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleDelete(annotation.id)}
                    className="text-text-muted hover:text-red-400 transition-colors flex-shrink-0"
                    title="削除"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 新規追加（読み取り専用でない場合） */}
        {!readOnly && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'add')}
              placeholder="メモを追加..."
              className="flex-1 bg-background-primary border border-[var(--glass-premium-border)] rounded px-2 py-1 text-sm focus:outline-none focus:border-accent-primary transition-colors"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newContent.trim() || isLoading}
              className="px-2 py-1 text-xs bg-accent-primary text-white rounded disabled:opacity-50 hover:bg-accent-hover transition-colors"
            >
              追加
            </button>
          </div>
        )}
      </div>
    );
  }

  // 通常モード（フル機能）
  return (
    <div className="bg-background-surface border border-[var(--glass-premium-border)] rounded-lg p-4 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h3 className="font-medium text-text-primary">注釈・メモ</h3>
          <span className="text-xs text-text-muted bg-background-primary px-2 py-0.5 rounded">
            {targetLabel}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--btn-glass-hover)] rounded transition-colors"
          >
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded px-3 py-2 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ローディング */}
      {isLoading && annotations.length === 0 && (
        <div className="flex items-center justify-center py-4 text-text-muted">
          <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          読み込み中...
        </div>
      )}

      {/* 注釈一覧 */}
      {annotations.length > 0 && (
        <div className="space-y-2">
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="bg-background-primary rounded-lg border border-[var(--glass-premium-border)] overflow-hidden"
            >
              {editingId === annotation.id ? (
                // 編集モード
                <div className="p-3 space-y-2">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'edit')}
                    className="w-full bg-background-surface border border-[var(--glass-premium-border)] rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary resize-none"
                    rows={3}
                    autoFocus
                    disabled={isLoading}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
                      disabled={isLoading}
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={!editingContent.trim() || isLoading}
                      className="px-3 py-1 text-xs bg-accent-primary text-white rounded disabled:opacity-50 hover:bg-accent-hover transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                // 表示モード
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-sm text-text-primary whitespace-pre-wrap">
                      {annotation.content}
                    </p>
                    {!readOnly && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(annotation)}
                          className="p-1 text-text-muted hover:text-accent-primary rounded transition-colors"
                          title="編集"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(annotation.id)}
                          className="p-1 text-text-muted hover:text-red-400 rounded transition-colors"
                          title="削除"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    {formatDate(annotation.createdAt)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 空状態 */}
      {!isLoading && annotations.length === 0 && (
        <div className="text-center py-4 text-text-muted text-sm">
          まだ注釈がありません
        </div>
      )}

      {/* 新規追加フォーム */}
      {!readOnly && (
        <div className="pt-2 border-t border-[var(--glass-premium-border)]">
          <label className="block text-xs text-text-secondary mb-2">
            新しい注釈を追加
          </label>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder="演奏のヒント、練習メモなど..."
            className="w-full bg-background-primary border border-[var(--glass-premium-border)] rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary resize-none"
            rows={2}
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-text-muted">
              Enter で追加、Shift+Enter で改行
            </p>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newContent.trim() || isLoading}
              className="px-4 py-1.5 text-sm bg-accent-primary text-white rounded disabled:opacity-50 hover:bg-accent-hover transition-colors"
            >
              追加
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 日付をフォーマット
 */
function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export default AnnotationEditor;
