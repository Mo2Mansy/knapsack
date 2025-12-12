import { Item } from './types';

export const INITIAL_ITEMS: Item[] = [
  { id: '1', name: 'Laptop', weight: 3, value: 10, color: 'bg-blue-500', icon: '💻' },
  { id: '2', name: 'Camera', weight: 4, value: 12, color: 'bg-purple-500', icon: '📷' },
  { id: '3', name: 'Food', weight: 2, value: 4, color: 'bg-green-500', icon: '🍔' },
  { id: '4', name: 'Water', weight: 1, value: 2, color: 'bg-cyan-500', icon: '💧' },
  { id: '5', name: 'Gold', weight: 5, value: 20, color: 'bg-yellow-500', icon: '🏆' },
];

export const MAX_CAPACITY_LIMIT = 20; // Limit for visualization purposes
export const MIN_CAPACITY_LIMIT = 5;

export const ITEM_ICONS = ['💻', '📷', '🍔', '💧', '🏆', '🎸', '📱', '👟', '📚', '🔦', '💊', '🔑'];
export const ITEM_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-cyan-500', 
  'bg-yellow-500', 'bg-red-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500'
];

export const GREEDY_CODE = `def greedy_knapsack(items, capacity):
    # Sort by value/weight ratio descending
    items = sorted(items, key=lambda x: x[0] / x[1], reverse=True)
    total_value = 0
    chosen = []

    for value, weight in items:
        if weight <= capacity:
            chosen.append((value, weight))
            total_value += value
            capacity -= weight

    return total_value, chosen`;

export const DP_CODE = `def dp_knapsack(items, capacity):
    n = len(items)
    # Initialize DP table
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    # Fill table
    for i in range(1, n + 1):
        value, weight = items[i - 1]
        for c in range(capacity + 1):
            if weight > c:
                dp[i][c] = dp[i - 1][c]
            else:
                dp[i][c] = max(
                    dp[i - 1][c],
                    value + dp[i - 1][c - weight]
                )
    
    # Backtracking logic omitted for brevity...
    return dp[n][capacity]`;
