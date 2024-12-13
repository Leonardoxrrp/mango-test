// exercise 1
export async function fetchRangeValues(): Promise<{ min: number; max: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ min: 1, max: 100 });
      }, 500);
    });
  }

 
// exercise 2
export async function fetchFixedRangeValues(): Promise<number[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([1.99, 5.99, 10.99, 30.99, 50.99, 70.99]);
      }, 500);
    });
  }