import { useState, useEffect, useCallback, RefObject } from 'react';
import {
  calculateScale,
  getScaledValues,
  ScaledValues,
  BASE_WIDTH,
  MAX_SCALE,
} from '@/lib/scaling';

/**
 * コンテナサイズに応じたスケーリング値を提供するフック
 *
 * @param containerRef コンテナのRefObject
 * @returns スケーリングされた値とコンテナ幅
 */
export function useContainerScale(
  containerRef: RefObject<HTMLElement | null>
): ScaledValues & { containerWidth: number } {
  const [containerWidth, setContainerWidth] = useState(BASE_WIDTH);
  const [scaledValues, setScaledValues] = useState<ScaledValues>(
    getScaledValues(MAX_SCALE)
  );

  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const width = containerRef.current.getBoundingClientRect().width;
      if (width > 0 && width !== containerWidth) {
        setContainerWidth(width);
        const scale = calculateScale(width);
        setScaledValues(getScaledValues(scale));
      }
    }
  }, [containerRef, containerWidth]);

  useEffect(() => {
    // 初回計算
    updateScale();

    // ウィンドウリサイズ時
    window.addEventListener('resize', updateScale);

    // ResizeObserverでコンテナサイズ変更を監視
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, [containerRef, updateScale]);

  return {
    ...scaledValues,
    containerWidth,
  };
}

/**
 * スケール値を直接受け取るバージョン（親コンポーネントからpropsで渡す場合用）
 *
 * @param scale スケール係数
 * @returns スケーリングされた値
 */
export function useScaledValues(scale: number): ScaledValues {
  const [scaledValues, setScaledValues] = useState<ScaledValues>(
    getScaledValues(scale)
  );

  useEffect(() => {
    setScaledValues(getScaledValues(scale));
  }, [scale]);

  return scaledValues;
}

export type { ScaledValues };
