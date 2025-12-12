export interface Item {
  id: string;
  name: string;
  weight: number;
  value: number;
  color: string;
  icon: string;
}

export interface ComparisonResult {
  greedy: {
    totalValue: number;
    totalWeight: number;
    selectedIds: string[];
    executionTimeMs: number;
  };
  dp: {
    totalValue: number;
    totalWeight: number;
    selectedIds: string[];
    executionTimeMs: number;
  };
}

export interface SimulationConfig {
  speed: number; // ms delay
  isRunning: boolean;
  hasRun: boolean;
}
