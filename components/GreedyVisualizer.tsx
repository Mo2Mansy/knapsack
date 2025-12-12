import React, { useEffect, useState, useRef } from 'react';
import { Item } from '../types';
import { ArrowDown, Check, X } from 'lucide-react';

interface GreedyVisualizerProps {
  items: Item[];
  capacity: number;
  isRunning: boolean;
  speed: number;
  onFinish: () => void;
  shouldReset: boolean;
}

export const GreedyVisualizer: React.FC<GreedyVisualizerProps> = ({
  items,
  capacity,
  isRunning,
  speed,
  onFinish,
  shouldReset,
}) => {
  const [sortedItems, setSortedItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentCapacity, setCurrentCapacity] = useState(capacity);
  const [currentValue, setCurrentValue] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [statusMessage, setStatusMessage] = useState("Ready to start");
  const [processingState, setProcessingState] = useState<'idle' | 'evaluating' | 'taken' | 'skipped'>('idle');

  // Initialization and Reset
  useEffect(() => {
    // Sort items by ratio for display
    const sorted = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
    setSortedItems(sorted);
    
    if (shouldReset) {
      setCurrentIndex(-1);
      setCurrentCapacity(capacity);
      setCurrentValue(0);
      setSelectedItems([]);
      setStatusMessage("Ready to start");
      setProcessingState('idle');
    }
  }, [items, capacity, shouldReset]);

  // Animation Loop
  useEffect(() => {
    if (!isRunning || currentIndex >= sortedItems.length) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const step = () => {
      // If we haven't started yet, move to index 0
      if (currentIndex === -1) {
        setCurrentIndex(0);
        setProcessingState('evaluating');
        setStatusMessage(`Evaluating ${sortedItems[0].name} (Ratio: ${(sortedItems[0].value / sortedItems[0].weight).toFixed(2)})`);
        return;
      }

      const item = sortedItems[currentIndex];
      
      // If currently evaluating, decide to take or skip
      if (processingState === 'evaluating') {
        if (item.weight <= currentCapacity) {
          setProcessingState('taken');
          setStatusMessage(`Taking ${item.name} (Fits in capacity)`);
          setSelectedItems(prev => [...prev, item]);
          setCurrentCapacity(prev => prev - item.weight);
          setCurrentValue(prev => prev + item.value);
        } else {
          setProcessingState('skipped');
          setStatusMessage(`Skipping ${item.name} (Too heavy)`);
        }
      } 
      // If result shown (taken/skipped), move to next item
      else if (processingState === 'taken' || processingState === 'skipped') {
         const nextIndex = currentIndex + 1;
         if (nextIndex < sortedItems.length) {
           setCurrentIndex(nextIndex);
           setProcessingState('evaluating');
           setStatusMessage(`Evaluating ${sortedItems[nextIndex].name} (Ratio: ${(sortedItems[nextIndex].value / sortedItems[nextIndex].weight).toFixed(2)})`);
         } else {
           // Finished
           setCurrentIndex(nextIndex); // Move past end
           setStatusMessage("Algorithm Finished");
           setProcessingState('idle');
           onFinish();
         }
      }
    };

    timeoutId = setTimeout(step, speed);
    return () => clearTimeout(timeoutId);
  }, [isRunning, currentIndex, processingState, sortedItems, currentCapacity, speed, onFinish]);


  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-lg text-primary flex items-center gap-2">
          Greedy Algorithm
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-normal">O(N log N)</span>
        </h3>
        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
           Value: {currentValue} | Rem. Cap: {currentCapacity}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-6 overflow-y-auto">
        {/* Status Bar */}
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg text-sm font-medium text-center transition-all">
          {statusMessage}
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Sorted Items List */}
          <div className="flex-1 flex flex-col gap-2">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Sorted by Ratio (Value/Weight)</h4>
            <div className="space-y-2">
              {sortedItems.map((item, idx) => {
                const isCurrent = idx === currentIndex;
                const isProcessed = idx < currentIndex;
                const isSelected = selectedItems.find(s => s.id === item.id);
                
                return (
                  <div 
                    key={item.id}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-300 flex justify-between items-center
                      ${isCurrent ? 'border-primary bg-primary/5 scale-105 shadow-md z-10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}
                      ${isProcessed && !isSelected ? 'opacity-50' : ''}
                      ${isSelected ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${item.color} shadow-sm`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">W:{item.weight} V:{item.value}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-mono font-bold bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                        R: {(item.value / item.weight).toFixed(2)}
                      </span>
                      {isSelected && <Check size={16} className="text-green-500 mt-1" />}
                      {isProcessed && !isSelected && <X size={16} className="text-red-400 mt-1" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Knapsack Visualization */}
          <div className="flex-1 flex flex-col items-center justify-start border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-4">
             <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">Knapsack</h4>
             
             <div className="relative w-full max-w-[200px] aspect-[3/4] border-4 border-gray-400 dark:border-gray-600 rounded-b-xl border-t-0 bg-gray-100 dark:bg-gray-800/50 flex flex-col-reverse p-2 gap-1 overflow-hidden transition-all">
                {/* Empty State / Fill Animation */}
                <div 
                  className="absolute bottom-0 left-0 w-full bg-blue-500/10 transition-all duration-500"
                  style={{ height: `${((capacity - currentCapacity) / capacity) * 100}%` }}
                />

                {selectedItems.map((item) => (
                   <div key={item.id} className={`w-full p-2 rounded ${item.color} text-white text-xs font-bold flex justify-between animate-bounce-in shadow-sm`}>
                      <span>{item.name}</span>
                      <span>+{item.value}</span>
                   </div>
                ))}
             </div>
             
             <div className="mt-4 text-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">${currentValue}</div>
                <div className="text-sm text-gray-500">Total Value</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};