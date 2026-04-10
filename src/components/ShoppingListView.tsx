import { useState } from "react";
import { ShoppingCart, CheckCircle2, Circle } from "lucide-react";
import { Meal } from "../lib/gemini";
import { cn } from "../lib/utils";

interface ShoppingListViewProps {
  meals: Meal[];
}

export function ShoppingListView({ meals }: ShoppingListViewProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center p-8">
        <div className="bg-theme-bg p-5 rounded-full mb-4 transition-colors duration-300">
          <ShoppingCart className="w-12 h-12 text-theme-muted" />
        </div>
        <h2 className="text-2xl font-bold text-theme-text mb-2 font-heading">Your list is empty</h2>
        <p className="text-theme-muted text-sm">
          Generate a meal plan for this week to see your grocery list here.
        </p>
      </div>
    );
  }

  // Flatten and aggregate ingredients
  const allIngredients = meals.flatMap(meal => meal.ingredients);
  
  // Simple grouping (in a real app, we'd use AI to categorize or a predefined list)
  // For now, we just list them out with a unique key
  const ingredientList = allIngredients.map((ing, idx) => ({
    id: `ing-${idx}-${ing.name.replace(/\s+/g, '-')}`,
    name: ing.name,
    amount: ing.amount,
  }));

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const progress = Math.round((checkedItems.size / ingredientList.length) * 100) || 0;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-6 px-1">
        <h2 className="text-3xl font-bold text-theme-text mb-1 font-heading">Groceries</h2>
        <p className="text-theme-muted text-sm mb-4">Everything you need for this week.</p>
        
        {/* Progress Bar */}
        <div className="bg-theme-bg rounded-full h-2.5 w-full overflow-hidden border border-theme-border-light">
          <div 
            className="bg-theme-accent h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs font-medium text-theme-muted mt-1.5">{progress}% collected</p>
      </div>

      <div className="bg-theme-card rounded-2xl shadow-sm border border-theme-border overflow-hidden transition-colors duration-300">
        <ul className="divide-y divide-theme-border-light">
          {ingredientList.map((item) => {
            const isChecked = checkedItems.has(item.id);
            return (
              <li 
                key={item.id}
                className={cn(
                  "flex items-center gap-3 p-4 transition-colors cursor-pointer hover:bg-theme-bg",
                  isChecked && "bg-theme-bg/50"
                )}
                onClick={() => toggleItem(item.id)}
              >
                <button className="flex-shrink-0 text-theme-muted focus:outline-none">
                  {isChecked ? (
                    <CheckCircle2 className="w-6 h-6 text-theme-accent-text" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <div className={cn("flex-1 transition-all", isChecked && "opacity-50 line-through")}>
                  <p className="text-theme-text font-medium text-sm">{item.name}</p>
                  <p className="text-theme-muted text-xs">{item.amount}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
