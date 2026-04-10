import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { MealPlanView } from "./components/MealPlanView";
import { ShoppingListView } from "./components/ShoppingListView";
import { SettingsView } from "./components/SettingsView";
import { Meal } from "./lib/gemini";

export default function App() {
  const [activeTab, setActiveTab] = useState<"current" | "ingredients" | "next" | "settings">("current");
  const [currentWeekMeals, setCurrentWeekMeals] = useState<Meal[]>([]);
  const [nextWeekMeals, setNextWeekMeals] = useState<Meal[]>([]);
  
  // Settings state
  const [allergies, setAllergies] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [theme, setTheme] = useState<"orange" | "blue" | "firewatch">("orange");
  const [mealTypes, setMealTypes] = useState<string[]>(["Breakfast", "Lunch", "Dinner"]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "current" && (
        <MealPlanView 
          title="This Week's Meals" 
          meals={currentWeekMeals} 
          onMealsGenerated={setCurrentWeekMeals}
          allergies={allergies}
          exclusions={exclusions}
          mealTypes={mealTypes}
          setMealTypes={setMealTypes}
        />
      )}
      
      {activeTab === "ingredients" && (
        <ShoppingListView meals={currentWeekMeals} />
      )}
      
      {activeTab === "next" && (
        <MealPlanView 
          title="Next Week's Meals" 
          meals={nextWeekMeals} 
          onMealsGenerated={setNextWeekMeals}
          allergies={allergies}
          exclusions={exclusions}
          mealTypes={mealTypes}
          setMealTypes={setMealTypes}
        />
      )}

      {activeTab === "settings" && (
        <SettingsView 
          allergies={allergies}
          setAllergies={setAllergies}
          exclusions={exclusions}
          setExclusions={setExclusions}
          theme={theme}
          setTheme={setTheme}
        />
      )}
    </Layout>
  );
}
