import React, { useState, useEffect, useCallback } from 'react';
import { Item, ComparisonResult } from './types';
import { INITIAL_ITEMS, MAX_CAPACITY_LIMIT, GREEDY_CODE, DP_CODE } from './constants';
import { calculateGreedy, calculateDP } from './utils/algorithmLogic';
import { GreedyVisualizer } from './components/GreedyVisualizer';
import { DPVisualizer } from './components/DPVisualizer';
import { ComparisonTable } from './components/ComparisonTable';
import { InputPlayground } from './components/InputPlayground';
import { CodeBlock } from './components/CodeBlock';
import { Play, RotateCcw, Moon, Sun, Info } from 'lucide-react';

const App: React.FC = () => {
  // Theme State
  const [darkMode, setDarkMode] = useState(false);
  
  // Data State
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [capacity, setCapacity] = useState(10);
  
  // Simulation State
  const [isRunning, setIsRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(500); // ms
  const [shouldReset, setShouldReset] = useState(true);
  const [completedAlgos, setCompletedAlgos] = useState({ greedy: false, dp: false });
  const [finalResults, setFinalResults] = useState<ComparisonResult | null>(null);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleRun = () => {
    setShouldReset(false);
    setIsRunning(true);
    setCompletedAlgos({ greedy: false, dp: false });
    
    // Pre-calculate final results for the table
    const greedyRes = calculateGreedy(items, capacity);
    const dpRes = calculateDP(items, capacity);
    
    // We store these but don't show them until animation finishes
    setFinalResults({
        greedy: { ...greedyRes, executionTimeMs: 0 },
        dp: { ...dpRes, executionTimeMs: 0 }
    });
  };

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setShouldReset(true);
    setCompletedAlgos({ greedy: false, dp: false });
    setFinalResults(null);
  }, []);

  const handleGreedyFinish = () => {
    setCompletedAlgos(prev => ({ ...prev, greedy: true }));
  };

  const handleDPFinish = () => {
    setCompletedAlgos(prev => ({ ...prev, dp: true }));
  };
  
  // Stop running state when both done
  useEffect(() => {
    if (completedAlgos.greedy && completedAlgos.dp) {
      setIsRunning(false);
    }
  }, [completedAlgos]);

  return (
    <div className="min-h-screen pb-20 transition-colors duration-300">
      
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl animate-bounce">K</div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 animate-pulse">
               Knapsack Duel
             </h1>
           </div>
           <button 
             onClick={() => setDarkMode(!darkMode)}
             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
           >
             {darkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
           <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
             Greedy vs Dynamic Programming
           </h2>
           <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
             Watch two algorithmic strategies solve the Knapsack Problem side-by-side in real-time.
           </p>
        </div>

        {/* Info & Config Section */}
        <section className="space-y-6">
           {/* The Problem */}
           <div className="space-y-4">
               <div className="flex items-center gap-2 text-primary font-semibold">
                 <Info size={20} />
                 <span>The Problem</span>
               </div>
               <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                 You have a knapsack with a capacity limit. There is a set of items, each with a specific weight and value. 
                 The goal is to maximize the total value of items in the knapsack without exceeding the weight limit.
               </p>
           </div>
           
           {/* Algorithm Breakdown */}
           <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold mb-4 text-lg text-gray-900 dark:text-white">Algorithm Breakdown</h3>
              <ul className="flex flex-col gap-4 text-sm">
                 <li className="flex gap-3">
                    <span className="font-bold text-primary min-w-[80px]">Greedy:</span>
                    <span className="text-gray-600 dark:text-gray-400">Picks items with the highest Value-to-Weight ratio first. Fast, but often suboptimal.</span>
                 </li>
                 <li className="flex gap-3">
                    <span className="font-bold text-secondary min-w-[80px]">DP:</span>
                    <span className="text-gray-600 dark:text-gray-400">Builds a solution using a 2D table to consider all combinations. Slower, but always finds the maximum value.</span>
                 </li>
              </ul>
           </div>

           {/* Configuration Playground (Moved here) */}
           <div>
               <div className="flex items-center gap-2 mb-4 mt-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configuration Playground</h2>
                  <span className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">Experiment Here</span>
               </div>
               <InputPlayground 
                  items={items} 
                  setItems={setItems} 
                  capacity={capacity} 
                  setCapacity={setCapacity}
                  onReset={handleReset}
                  isLocked={isRunning}
               />
           </div>
        </section>

        {/* Visualization Control Center */}
        <section id="visualization" className="space-y-6">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 sticky top-20 z-40">
              <div className="flex items-center gap-4">
                 <button
                   onClick={handleRun}
                   disabled={isRunning}
                   className={`
                      flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95
                      ${isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'}
                   `}
                 >
                   <Play size={20} fill="currentColor" />
                   {isRunning ? 'Running...' : 'Run Comparison'}
                 </button>
                 
                 <button
                   onClick={handleReset}
                   disabled={isRunning}
                   className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                   title="Reset"
                 >
                   <RotateCcw size={20} />
                 </button>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                 <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Animation Speed</span>
                 <input 
                   type="range" 
                   min="50" 
                   max="1000" 
                   step="50"
                   value={1050 - simSpeed} // Invert so right is faster
                   onChange={(e) => setSimSpeed(1050 - parseInt(e.target.value))}
                   className="w-full md:w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                 />
              </div>
           </div>

           {/* The Visualizers */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
              <GreedyVisualizer 
                 items={items} 
                 capacity={capacity} 
                 isRunning={isRunning} 
                 speed={simSpeed}
                 onFinish={handleGreedyFinish}
                 shouldReset={shouldReset}
              />
              <DPVisualizer 
                 items={items} 
                 capacity={capacity} 
                 isRunning={isRunning} 
                 speed={Math.max(20, simSpeed / 4)} // DP needs to run faster per step to be watchable
                 onFinish={handleDPFinish}
                 shouldReset={shouldReset}
              />
           </div>
        </section>

        {/* Results & Comparison */}
        <section className="space-y-6">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analysis</h2>
           <ComparisonTable results={(completedAlgos.greedy && completedAlgos.dp) ? finalResults : null} items={items} />
        </section>
        
        {/* Code Window (Moved here) */}
        <section className="space-y-6">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Algorithm Implementation</h2>
           <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                 <div className="flex-1 p-3 text-center text-sm font-mono text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">Greedy (Python)</div>
                 <div className="flex-1 p-3 text-center text-sm font-mono text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900">DP (Python)</div>
              </div>
              <div className="grid grid-cols-2">
                 <div className="border-r border-gray-200 dark:border-gray-800 h-[300px] overflow-y-auto custom-scrollbar">
                     <CodeBlock code={GREEDY_CODE} />
                 </div>
                 <div className="h-[300px] overflow-y-auto custom-scrollbar">
                     <CodeBlock code={DP_CODE} />
                 </div>
              </div>
           </div>
        </section>

        {/* Summary Footer */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-none rounded-2xl p-8 text-center shadow-xl transition-all">
           <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Key Takeaways</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mt-6">
              <div>
                 <h4 className="font-bold text-primary mb-2 text-lg">Use Greedy When...</h4>
                 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                   You need a very fast solution and an approximate answer is acceptable. 
                   Greedy is great for problems where "local best" choices often lead to a good global result (like Fractional Knapsack, but not 0/1).
                 </p>
              </div>
              <div>
                 <h4 className="font-bold text-secondary mb-2 text-lg">Use DP When...</h4>
                 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                   Precision is critical. In scenarios like financial budgeting, cargo loading, or cutting stock problems, 
                   missing the optimal solution can cost significant money.
                 </p>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
};

export default App;