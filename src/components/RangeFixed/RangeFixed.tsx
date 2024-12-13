'use client';

import React, { useRef, useState } from 'react';
import { RangeFixedProps } from './types';
import styles from './RangeFixed.module.css';
import { clamp } from '../../utils/clamp';
import useDrag from '../../hooks/useDrag';
import { formatCurrency } from '../../lib/currency';

const RangeFixed: React.FC<RangeFixedProps> = ({ values }) => {
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(values.length - 1);

  const [dragStartMinIndex, setDragStartMinIndex] = useState(minIndex);
  const [dragStartMaxIndex, setDragStartMaxIndex] = useState(maxIndex);

  const trackRef = useRef<HTMLDivElement>(null);

  const calculateStep = () => {
    if (!trackRef.current) return 1;
    const { width } = trackRef.current.getBoundingClientRect();
    return width / (values.length - 1);
  };

  const getLeftPercentage = (index: number) => {
    return (index / (values.length - 1)) * 100;
  };

  const snapToClosestIndex = (pixelPosition: number) => {
    const step = calculateStep();
    const approxIndex = pixelPosition / step;
    const roundedIndex = Math.round(approxIndex);
    return clamp(roundedIndex, 0, values.length - 1);
  };

  const handleMinDrag = useDrag({
    onDragStart: () => {
      setDragStartMinIndex(minIndex);
    },
    onDrag: (deltaX) => {
      if (!trackRef.current) return;
      const trackRect = trackRef.current.getBoundingClientRect();
      const startPixel = dragStartMinIndex * (trackRect.width / (values.length - 1));
      const newPixelPos = startPixel + deltaX;
      let newIndex = snapToClosestIndex(newPixelPos);
      if (newIndex > maxIndex) newIndex = maxIndex;
      setMinIndex(newIndex);
    }
  });

  const handleMaxDrag = useDrag({
    onDragStart: () => {
      setDragStartMaxIndex(maxIndex);
    },
    onDrag: (deltaX) => {
      if (!trackRef.current) return;
      const trackRect = trackRef.current.getBoundingClientRect();
      const startPixel = dragStartMaxIndex * (trackRect.width / (values.length - 1));
      const newPixelPos = startPixel + deltaX;
      let newIndex = snapToClosestIndex(newPixelPos);
      // Ensure we don't cross minIndex
      if (newIndex < minIndex) newIndex = minIndex;
      setMaxIndex(newIndex);
    }
  });

  const minPos = getLeftPercentage(minIndex);
  const maxPos = getLeftPercentage(maxIndex);

  return (
    <div className={styles.container} data-testid="range-fixed-container">
      <div className={styles.labels}>
        <span className={styles.label} data-testid="min-value">
          {formatCurrency(values[minIndex])}
        </span>
        <span className={styles.label} data-testid="max-value">
          {formatCurrency(values[maxIndex])}
        </span>
      </div>
      <div className={styles.trackWrapper}>
        <div className={styles.track} ref={trackRef}>
          <div
            className={styles.rangeFill}
            style={{
              left: `${minPos}%`,
              width: `${maxPos - minPos}%`,
            }}
          />
          <div
            className={`${styles.handle} ${handleMinDrag.isDragging ? styles.dragging : ''}`}
            style={{ left: `${minPos}%` }}
            ref={handleMinDrag.handleRef}
            data-testid="min-handle"
          />
          <div
            className={`${styles.handle} ${handleMaxDrag.isDragging ? styles.dragging : ''}`}
            style={{ left: `${maxPos}%` }}
            ref={handleMaxDrag.handleRef}
            data-testid="max-handle"
          />
        </div>
      </div>

      <div className={styles.fixedValues}>
        {values.map((val, index) => (
          <div
            key={val}
            className={styles.tick}
            style={{ left: `${getLeftPercentage(index)}%` }}
            data-testid={`tick-${index}`}
          >
            |
          </div>
        ))}
      </div>
    </div>
  );
};

export default RangeFixed;