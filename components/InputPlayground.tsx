import React, { useState } from 'react';
import { Item } from '../types';
import { Plus, Trash2, RefreshCw, Dices } from 'lucide-react';
import { ITEM_ICONS, ITEM_COLORS } from '../constants';

interface InputPlaygroundProps {
  items: Item[];
  setItems: (items: Item[]) => void;
  capacity: number;
  setCapacity: (c: number) => void;
  onReset: () => void;
  isLocked: boolean;
}

export const InputPlayground: React.FC<InputPlaygroundProps> = ({
  items,
  setItems,
  capacity,
  setCapacity,
  onReset,
  isLocked
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(1);
  const [newItemValue, setNewItemValue] = useState(1);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    const newItem: Item = {
      id: Date.now().toString(),
      name: newItemName,
      weight: Math.max(1, Math.min(20, newItemWeight)),
      value: Math.max(1, newItemValue),
      color: ITEM_COLORS[items.length % ITEM_COLORS.length],
      icon: ITEM_ICONS[items.length % ITEM_ICONS.length]
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemWeight(1);
    setNewItemValue(1);
    onReset();
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    onReset();
  };

  const handleRandomize = () => {
    const names = ['Gem', 'Relic', 'Potion', 'Sword', 'Shield', 'Map', 'Coin', 'Helm'];
    const count = 4 + Math.floor(Math.random() * 4); // 4-7 items
    const newItems: Item[] = [];
    for(let i=0; i<count; i++) {
        newItems.push({
            id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
            name: names[i % names.length],
            weight: 1 + Math.floor(Math.random() * 8),
            value: 5 + Math.floor(Math.random() * 45),
            color: ITEM_COLORS[i % ITEM_COLORS.length],
            icon: ITEM_ICONS[i % ITEM_ICONS.length]
        });
    }
    setItems(newItems);
    onReset();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Column */}
        <div className="w-full md:w-1/3 space-y-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Knapsack Capacity: <span className="text-primary font-bold text-lg">{capacity}</span>
             </label>
             <input 
               type="range" 
               min="5" 
               max="20" 
               value={capacity} 
               onChange={(e) => { setCapacity(parseInt(e.target.value)); onReset(); }}
               disabled={isLocked}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
             />
             <div className="flex justify-between text-xs text-gray-400 mt-1">
               <span>5</span>
               <span>20</span>
             </div>
           </div>

           <div className="flex gap-2">
             <button 
               onClick={handleRandomize}
               disabled={isLocked}
               className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
             >
               <Dices size={18} /> Randomize
             </button>
           </div>
           
           <form onSubmit={handleAddItem} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
             <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300">Add Custom Item</h4>
             <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Name"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  maxLength={10}
                  className="col-span-2 px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white"
                  disabled={isLocked}
                />
                <div className="flex flex-col">
                    <label className="text-xs text-gray-400 mb-1">Weight</label>
                    <input type="number" min="1" max="15" value={newItemWeight} onChange={e => setNewItemWeight(parseInt(e.target.value))} className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white" disabled={isLocked} />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-400 mb-1">Value</label>
                    <input type="number" min="1" max="100" value={newItemValue} onChange={e => setNewItemValue(parseInt(e.target.value))} className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white" disabled={isLocked} />
                </div>
             </div>
             <button type="submit" disabled={!newItemName || isLocked} className="w-full py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2">
               <Plus size={16} /> Add Item
             </button>
           </form>
        </div>

        {/* Items List */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex justify-between items-center">
             Current Items
             <span className="text-xs font-normal text-gray-500">{items.length} items</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.color} text-white`}>
                     {item.icon}
                   </div>
                   <div>
                     <div className="font-bold text-sm text-gray-800 dark:text-gray-100">{item.name}</div>
                     <div className="text-xs text-gray-500">Weight: {item.weight} • Value: {item.value}</div>
                   </div>
                 </div>
                 <button 
                   onClick={() => handleRemoveItem(item.id)}
                   disabled={isLocked}
                   className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:invisible"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            ))}
            {items.length === 0 && (
                <div className="col-span-full py-8 text-center text-gray-400 text-sm">
                    No items added. Add some or randomize!
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};