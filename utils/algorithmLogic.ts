import { Item } from '../types';

export const calculateGreedy = (items: Item[], capacity: number) => {
  const sortedItems = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
  let currentCapacity = capacity;
  let totalValue = 0;
  const selectedIds: string[] = [];

  for (const item of sortedItems) {
    if (item.weight <= currentCapacity) {
      selectedIds.push(item.id);
      totalValue += item.value;
      currentCapacity -= item.weight;
    }
  }

  return { totalValue, totalWeight: capacity - currentCapacity, selectedIds };
};

export const calculateDP = (items: Item[], capacity: number) => {
  const n = items.length;
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { value, weight } = items[i - 1];
    for (let c = 0; c <= capacity; c++) {
      if (weight > c) {
        dp[i][c] = dp[i - 1][c];
      } else {
        dp[i][c] = Math.max(dp[i - 1][c], value + dp[i - 1][c - weight]);
      }
    }
  }

  // Backtrack
  let c = capacity;
  const selectedIds: string[] = [];
  let totalWeight = 0;

  for (let i = n; i > 0; i--) {
    if (dp[i][c] !== dp[i - 1][c]) {
      const item = items[i - 1];
      selectedIds.push(item.id);
      c -= item.weight;
      totalWeight += item.weight;
    }
  }

  return { totalValue: dp[n][capacity], totalWeight, selectedIds };
};
