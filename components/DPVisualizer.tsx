import React, { useEffect, useState } from 'react';
import { Item } from '../types';

interface DPVisualizerProps {
  items: Item[];
  capacity: number;
  isRunning: boolean;
  speed: number;
  onFinish: () => void;
  shouldReset: boolean;
}

type CellState = {
  value: number;
  status: 'pending' | 'calculating' | 'filled' | 'backtracking' | 'selected';
};

export const DPVisualizer: React.FC<DPVisualizerProps> = ({
  items,
  capacity,
  isRunning,
  speed,
  onFinish,
  shouldReset,
}) => {
  // DP Table State: Row 0 is base case (0 items), Row 1 is Item 0, etc.
  const [grid, setGrid] = useState<CellState[][]>([]);
  
  const [currentI, setCurrentI] = useState(0); // Current Item Index (1-based for table)
  const [currentW, setCurrentW] = useState(0); // Current Capacity Column
  const [phase, setPhase] = useState<'filling' | 'backtracking' | 'finished'>('filling');
  const [backtrackI, setBacktrackI] = useState(0);
  const [backtrackW, setBacktrackW] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Ready to start");

  // Initialize
  useEffect(() => {
    // Reset Grid
    const newGrid: CellState[][] = [];
    for (let i = 0; i <= items.length; i++) {
      const row: CellState[] = [];
      for (let w = 0; w <= capacity; w++) {
        row.push({ value: 0, status: 'pending' });
      }
      newGrid.push(row);
    }
    // Initialize row 0 as filled with 0s immediately
    for(let w=0; w<=capacity; w++) newGrid[0][w] = { value: 0, status: 'filled' };
    
    setGrid(newGrid);

    if (shouldReset) {
      setCurrentI(1);
      setCurrentW(0);
      setPhase('filling');
      setBacktrackI(items.length);
      setBacktrackW(capacity);
      setStatusMessage("Ready to start");
    }
  }, [items, capacity, shouldReset]);

  // Animation Loop
  useEffect(() => {
    if (!isRunning || phase === 'finished') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const step = () => {
      if (phase === 'filling') {
        if (currentI > items.length) {
          setPhase('backtracking');
          setStatusMessage("Table filled. Starting backtracking path...");
          return;
        }

        // Logic for current cell dp[currentI][currentW]
        const item = items[currentI - 1]; // 0-indexed item
        const weight = item.weight;
        const value = item.value;

        let cellValue = 0;
        let prevVal = grid[currentI - 1][currentW].value;
        
        if (weight > currentW) {
          cellValue = prevVal;
          setStatusMessage(`Item ${item.name} (W:${weight}) > Cap ${currentW}. Copying from above.`);
        } else {
          const includeVal = value + grid[currentI - 1][currentW - weight].value;
          cellValue = Math.max(prevVal, includeVal);
          setStatusMessage(`Max(Skip: ${prevVal}, Take: ${includeVal}) = ${cellValue}`);
        }

        // Update Grid
        setGrid(prev => {
          const newGrid = [...prev];
          newGrid[currentI] = [...prev[currentI]];
          newGrid[currentI][currentW] = { value: cellValue, status: 'calculating' };
          return newGrid;
        });

        // Small delay to show "calculating" color before moving? 
        // For smoother animation in one step, we just set it to filled in next tick or same tick?
        // Let's just keep 'calculating' state visual for this frame, then mark filled next frame.
        // Actually, to keep it simple, we just set value and move on. 
        // But to make it look "active", we'll just rely on the currentI/currentW pointers to style the cell in render.
        
        // Move to next cell
        if (currentW < capacity) {
          setCurrentW(prev => prev + 1);
        } else {
          setCurrentW(0);
          setCurrentI(prev => prev + 1);
        }

      } else if (phase === 'backtracking') {
         if (backtrackI === 0) {
           setPhase('finished');
           setStatusMessage("Optimal Solution Found!");
           onFinish();
           return;
         }

         const currentVal = grid[backtrackI][backtrackW].value;
         const aboveVal = grid[backtrackI - 1][backtrackW].value;

         setGrid(prev => {
             const newGrid = [...prev];
             // Mark path
             newGrid[backtrackI][backtrackW] = { ...newGrid[backtrackI][backtrackW], status: 'backtracking' };
             return newGrid;
         });

         if (currentVal !== aboveVal) {
             const item = items[backtrackI - 1];
             setStatusMessage(`Value changed from row above. Item ${item.name} was selected.`);
             
             // Mark selected permanently
             setGrid(prev => {
                 const newGrid = [...prev];
                 newGrid[backtrackI][backtrackW] = { ...newGrid[backtrackI][backtrackW], status: 'selected' };
                 return newGrid;
             });

             setBacktrackI(prev => prev - 1);
             setBacktrackW(prev => prev - item.weight);
         } else {
             setStatusMessage(`Value same as above. Item ${items[backtrackI-1].name} skipped.`);
             setBacktrackI(prev => prev - 1);
         }
      }
    };

    timeoutId = setTimeout(step, speed);
    return () => clearTimeout(timeoutId);
  }, [isRunning, phase, currentI, currentW, backtrackI, backtrackW, items, capacity, grid, speed, onFinish]);


  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-lg text-secondary flex items-center gap-2">
          Dynamic Programming
          <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-normal">O(N × W)</span>
        </h3>
        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
           State: dp[{currentI > items.length ? 'N' : currentI}][{currentW}]
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4 overflow-hidden">
         <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 px-4 py-2 rounded-lg text-sm font-medium text-center truncate">
            {statusMessage}
         </div>

         <div className="flex-1 overflow-auto custom-scrollbar relative border border-gray-200 dark:border-gray-700 rounded-lg">
             {/* Grid Container */}
             <div className="min-w-max">
                 {/* Header Row (Capacity) */}
                 <div className="flex sticky top-0 z-10">
                     <div className="w-16 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-800 font-bold text-xs sticky left-0 z-20 border-b border-r border-gray-300 dark:border-gray-600">
                        Item\Cap
                     </div>
                     {Array.from({length: capacity + 1}).map((_, idx) => (
                         <div key={idx} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-xs font-mono border-b border-r border-gray-200 dark:border-gray-700 text-gray-500">
                             {idx}
                         </div>
                     ))}
                 </div>
                 
                 {/* Grid Body */}
                 {grid.map((row, i) => (
                     <div key={i} className="flex">
                         {/* Row Header (Item) */}
                         <div className="w-16 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-800/80 text-xs font-bold sticky left-0 z-10 border-b border-r border-gray-200 dark:border-gray-700">
                             {i === 0 ? 'Ø' : items[i-1]?.name?.substring(0, 6)}
                         </div>
                         {/* Cells */}
                         {row.map((cell, w) => {
                             // Determine visual state
                             const isCurrent = (phase === 'filling' && i === currentI && w === currentW);
                             const isProcessed = (i < currentI) || (i === currentI && w < currentW);
                             const isBacktrackPath = cell.status === 'selected' || cell.status === 'backtracking';
                             
                             let bgClass = 'bg-white dark:bg-gray-900';
                             if (isCurrent) bgClass = 'bg-yellow-200 dark:bg-yellow-900/50 scale-110 shadow-inner z-0';
                             else if (cell.status === 'selected') bgClass = 'bg-green-400 dark:bg-green-600 text-white font-bold';
                             else if (cell.status === 'backtracking') bgClass = 'bg-green-200 dark:bg-green-900/30';
                             else if (isProcessed) bgClass = 'bg-gray-50 dark:bg-gray-800/30 text-gray-400';

                             return (
                                 <div 
                                    key={`${i}-${w}`} 
                                    className={`w-10 h-10 flex items-center justify-center text-xs font-mono border-b border-r border-gray-100 dark:border-gray-800 transition-colors duration-200 ${bgClass}`}
                                 >
                                    {cell.status !== 'pending' ? cell.value : ''}
                                 </div>
                             );
                         })}
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};