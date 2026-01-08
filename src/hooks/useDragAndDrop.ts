import { useState, useCallback } from 'react';

export interface UseDragAndDropOptions<T> {
  items: T[];
  getItemId: (item: T) => string;
  onReorder: (itemId: string, newIndex: number) => void;
}

export interface UseDragAndDropReturn {
  draggedId: string | null;
  dragOverIndex: number | null;
  handleDragStart: (e: React.DragEvent, itemId: string) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent) => void;
  getDragProps: (itemId: string) => {
    draggable: true;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    className: string;
  };
  getDropZoneProps: (index: number) => {
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    className: string;
  };
}

export function useDragAndDrop<T>({
  items,
  getItemId,
  onReorder,
}: UseDragAndDropOptions<T>): UseDragAndDropReturn {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, itemId: string) => {
      setDraggedId(itemId);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', itemId);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverIndex(index);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      if (draggedId !== null && dragOverIndex !== null) {
        // Find the current index of the dragged item
        const currentIndex = items.findIndex(
          (item) => getItemId(item) === draggedId
        );

        // Only reorder if the position actually changed
        if (currentIndex !== -1 && currentIndex !== dragOverIndex) {
          onReorder(draggedId, dragOverIndex);
        }
      }

      setDraggedId(null);
      setDragOverIndex(null);
    },
    [draggedId, dragOverIndex, items, getItemId, onReorder]
  );

  const getDragProps = useCallback(
    (itemId: string) => ({
      draggable: true as const,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, itemId),
      onDragEnd: handleDragEnd,
      className: draggedId === itemId ? 'opacity-50' : '',
    }),
    [draggedId, handleDragStart, handleDragEnd]
  );

  const getDropZoneProps = useCallback(
    (index: number) => ({
      onDragOver: (e: React.DragEvent) => handleDragOver(e, index),
      onDrop: handleDrop,
      className:
        dragOverIndex === index
          ? 'border-t-2 border-purple-500'
          : 'border-t-2 border-transparent',
    }),
    [dragOverIndex, handleDragOver, handleDrop]
  );

  return {
    draggedId,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    getDragProps,
    getDropZoneProps,
  };
}
