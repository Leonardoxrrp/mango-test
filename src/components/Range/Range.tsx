'use client';

import React, { useRef, useState } from 'react';
import { RangeProps } from './types';
import styles from './Range.module.css';
import useDrag from '../../hooks/useDrag';
import { clamp } from '../../utils/clamp';

const Range: React.FC<RangeProps> = ({ initialMin, initialMax }) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  const [dragStartMinVal, setDragStartMinVal] = useState(minValue);
  const [dragStartMaxVal, setDragStartMaxVal] = useState(maxValue);

  const trackRef = useRef<HTMLDivElement>(null);

  // Recalculate step on each drag event
  const calculateStep = () => {
    if (!trackRef.current) return 0;
    const { width } = trackRef.current.getBoundingClientRect();
    return (initialMax - initialMin) / width;
  };

  const handleMinDrag = useDrag({
    onDragStart: () => {
      // Store initial min handle value before dragging
      setDragStartMinVal(minValue);
    },
    onDrag: (deltaX) => {
      const step = calculateStep();
      const newVal = clamp(dragStartMinVal + deltaX * step, initialMin, maxValue);
      setMinValue(newVal);
    },
  });

  const handleMaxDrag = useDrag({
    onDragStart: () => {
      // Store initial max handle value before dragging
      setDragStartMaxVal(maxValue);
    },
    onDrag: (deltaX) => {
      const step = calculateStep();
      const newVal = clamp(dragStartMaxVal + deltaX * step, minValue, initialMax);
      setMaxValue(newVal);
    },
  });

  const getLeftPercentage = (val: number) => {
    return ((val - initialMin) / (initialMax - initialMin)) * 100;
  };

  const handleMinLabelClick = () => {
    const val = prompt(`Set a new minimum value (Current: ${minValue}):`);
    if (val === null) return;
    const numericVal = parseFloat(val);
    if (!isNaN(numericVal)) {
      setMinValue(clamp(numericVal, initialMin, maxValue));
    }
  };

  const handleMaxLabelClick = () => {
    const val = prompt(`Set a new maximum value (Current: ${maxValue}):`);
    if (val === null) return;
    const numericVal = parseFloat(val);
    if (!isNaN(numericVal)) {
      setMaxValue(clamp(numericVal, minValue, initialMax));
    }
  };

  const minPos = getLeftPercentage(minValue);
  const maxPos = getLeftPercentage(maxValue);

  return (
    <div className={styles.container}>
      <div className={styles.labels}>
        <span
          className={styles.label}
          onClick={handleMinLabelClick}
          data-testid="min-label"
        >
          {Math.round(minValue)}
        </span>
        <span
          className={styles.label}
          onClick={handleMaxLabelClick}
          data-testid="max-label"
        >
          {Math.round(maxValue)}
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
    </div>
  );
};

export default Range;