'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { fetchRangeValues } from '../../lib/api';
import Range from '../../components/Range/Range';

export default function Exercise1Page() {
  const [minValue, setMinValue] = useState<number | null>(null);
  const [maxValue, setMaxValue] = useState<number | null>(null);

  useEffect(() => {
    fetchRangeValues().then(({ min, max }) => {
      setMinValue(min);
      setMaxValue(max);
    });
  }, []);

  if (minValue === null || maxValue === null) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <main className={styles.container}>
      <h1>Exercise 1: Custom Range</h1>
      <Range initialMin={minValue} initialMax={maxValue} />
    </main>
  );
}