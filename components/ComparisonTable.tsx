import React from 'react';
import { ComparisonResult, Item } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ComparisonTableProps {
  results: ComparisonResult | null;
  items: Item[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ results, items }) => {
  const getItemNames = (ids: string[]) => {
    return ids.map(id => items.find(i => i.id === id)?.name).join(', ');
  };

  if (!results) {
    return (
      <div className="text-center p-12 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
        Run the simulation to see the comparison results.
      </div>
    );
  }

  const greedyOptimal = results.greedy.totalValue === results.dp.totalValue;

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-300">
            <th className="p-4 border-b border-gray-200 dark:border-gray-700">Feature</th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-primary font-bold">Greedy Algorithm</th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-secondary font-bold">Dynamic Programming</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <td className="p-4 font-semibold text-gray-700 dark:text-gray-200">Time Complexity</td>
            <td className="p-4 font-mono text-gray-600 dark:text-gray-400">O(N log N)</td>
            <td className="p-4 font-mono text-gray-600 dark:text-gray-400">O(N × Capacity)</td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <td className="p-4 font-semibold text-gray-700 dark:text-gray-200">Optimality</td>
            <td className="p-4">
              <span className="flex items-center gap-2 text-red-500 font-medium">
                <XCircle size={16} /> Not Guaranteed
              </span>
            </td>
            <td className="p-4">
              <span className="flex items-center gap-2 text-green-500 font-medium">
                <CheckCircle2 size={16} /> Always Optimal
              </span>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
            <td className="p-4 font-semibold text-gray-700 dark:text-gray-200">Total Value</td>
            <td className={`p-4 font-bold text-lg ${greedyOptimal ? 'text-gray-800 dark:text-white' : 'text-red-500'}`}>
              ${results.greedy.totalValue}
            </td>
            <td className="p-4 font-bold text-lg text-green-600 dark:text-green-400">
              ${results.dp.totalValue}
            </td>
          </tr>
           <tr className="border-b border-gray-100 dark:border-gray-800">
            <td className="p-4 font-semibold text-gray-700 dark:text-gray-200">Total Weight</td>
            <td className="p-4 font-mono">{results.greedy.totalWeight}</td>
            <td className="p-4 font-mono">{results.dp.totalWeight}</td>
          </tr>
          <tr>
            <td className="p-4 font-semibold text-gray-700 dark:text-gray-200 align-top">Selected Items</td>
            <td className="p-4 text-xs text-gray-500">{getItemNames(results.greedy.selectedIds)}</td>
            <td className="p-4 text-xs text-gray-500">{getItemNames(results.dp.selectedIds)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
