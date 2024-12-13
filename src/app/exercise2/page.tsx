'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { fetchFixedRangeValues } from '../../lib/api';
import RangeFixed from '../../components/RangeFixed/RangeFixed';

export default function Exercise2Page() {
  const [values, setValues] = useState<number[] | null>(null);

  useEffect(() => {
    fetchFixedRangeValues().then((rangeValues) => {
      setValues(rangeValues);
    });
  }, []);

  if (!values) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <main className={styles.container}>
      <h1>Exercise 2: Fixed Values Range</h1>
      <p>
        Select values from a fixed set of currency values. Drag the handles to snap to the closest available value.
      </p>
      <RangeFixed values={values} />
    </main>
  );
}