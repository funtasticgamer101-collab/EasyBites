import { useState } from "react";
import { Loader2, Sparkles, Clock, Utensils } from "lucide-react";
import { Meal, generateMealPlan } from "../lib/gemini";
import { cn } from "../lib/utils";

interface MealPlanViewProps {
  title: string;
  meals: Meal[];
  onMealsGenerated: (meals: Meal[]) => void;
  allergies: string;
  exclusions: string;
  mealTypes: string[];
  setMealTypes: (types: string[]) => void;
}

export function MealPlanView({ title, meals, onMealsGenerated, allergies, exclusions, mealTypes, setMealTypes }: MealPlanViewProps) {
  const [keyword, setKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const toggleMealType = (type: string) => {
    setMealTypes(
      mealTypes.includes(type)
        ? mealTypes.filter(t => t !== type)
        : [...mealTypes, type]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) {
      setError("Please enter a craving or keyword.");
      return;
    }
    if (mealTypes.length === 0) {
      setError("Please select at least one meal type.");
      return;
    }
    
    setIsGenerating(true);
    setError("");
    
    try {
      const newMeals = await generateMealPlan(keyword, allergies, exclusions, mealTypes);
      onMealsGenerated(newMeals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  if (meals.length === 0) {
    return (
      <div className="p-4 max-w-md mx-auto h-full flex flex-col justify-center">
        <div className="bg-theme-card rounded-3xl shadow-sm border border-theme-border overflow-hidden transition-colors duration-300">
          <div className="p-6 border-b border-theme-border-light bg-theme-card-header text-center">
            <div className="bg-theme-accent-light w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-theme-accent-text" />
            </div>
            <h2 className="text-2xl font-bold text-theme-text font-heading">Generate {title}</h2>
            <p className="text-theme-muted text-sm mt-1">Easy, single-person comfort food.</p>
          </div>

          <form onSubmit={handleGenerate} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-theme-text mb-2">
                Include meals for:
              </label>
              <div className="flex gap-2">
                {["Breakfast", "Lunch", "Dinner"].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleMealType(type)}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-sm font-medium transition-colors border",
                      mealTypes.includes(type) 
                        ? "bg-theme-accent text-white border-theme-accent" 
                        : "bg-theme-bg text-theme-muted border-theme-border hover:border-theme-accent-light"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-2">
                What are you craving?
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., Grilled cheese, pasta, tacos..."
                className="w-full px-4 py-3 rounded-xl border border-theme-border focus:ring-2 focus:ring-theme-accent focus:border-theme-accent outline-none transition-all bg-theme-bg text-theme-text"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-theme-accent hover:bg-theme-accent-hover text-white font-medium py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Cooking up ideas...
                </>
              ) : (
                <>
                  <Utensils className="w-5 h-5" />
                  Generate Plan
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-3xl font-bold text-theme-text font-heading">{title}</h2>
        <button 
          onClick={() => onMealsGenerated([])}
          className="text-sm font-medium text-theme-accent-text hover:text-theme-accent-hover"
        >
          Reset
        </button>
      </div>

      {meals.map((meal) => (
        <div key={meal.id} className="bg-theme-card rounded-2xl p-5 shadow-sm border border-theme-border flex flex-col gap-3 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="bg-theme-accent-light text-theme-accent-light-text text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Day {meal.day} • {meal.mealTime}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-theme-muted bg-theme-bg px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {meal.prepTime}
            </span>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-theme-text leading-tight font-heading">{meal.name}</h3>
            <p className="text-sm text-theme-accent-text font-medium mt-0.5">{meal.type}</p>
          </div>
          
          <p className="text-theme-muted text-sm leading-relaxed">{meal.description}</p>
        </div>
      ))}
    </div>
  );
}
