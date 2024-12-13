export async function fetchRangeValues(): Promise<{ min: number; max: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ min: 1, max: 100 });
      }, 500);
    });
  }