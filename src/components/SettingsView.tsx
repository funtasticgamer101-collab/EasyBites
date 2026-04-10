import { ShieldAlert, Ban, Palette } from "lucide-react";
import { cn } from "../lib/utils";

interface SettingsViewProps {
  allergies: string;
  setAllergies: (val: string) => void;
  exclusions: string;
  setExclusions: (val: string) => void;
  theme: "orange" | "blue" | "firewatch";
  setTheme: (val: "orange" | "blue" | "firewatch") => void;
}

export function SettingsView({ allergies, setAllergies, exclusions, setExclusions, theme, setTheme }: SettingsViewProps) {
  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <div className="mb-2 px-1">
        <h2 className="text-3xl font-bold text-theme-text font-heading">Settings</h2>
        <p className="text-theme-muted text-sm">Manage your preferences.</p>
      </div>

      <div className="bg-theme-card rounded-2xl p-5 shadow-sm border border-theme-border space-y-4 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-5 h-5 text-theme-accent-text" />
          <h3 className="text-xl font-bold text-theme-text font-heading">Theme</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setTheme("orange")}
            className={cn(
              "py-3 px-4 rounded-xl border font-medium text-sm transition-all",
              theme === "orange" 
                ? "border-theme-accent bg-theme-accent-light text-theme-accent-light-text" 
                : "border-theme-border text-theme-muted hover:bg-theme-bg"
            )}
          >
            Orange (Default)
          </button>
          <button
            onClick={() => setTheme("blue")}
            className={cn(
              "py-3 px-4 rounded-xl border font-medium text-sm transition-all",
              theme === "blue" 
                ? "border-theme-accent bg-theme-accent-light text-theme-accent-light-text" 
                : "border-theme-border text-theme-muted hover:bg-theme-bg"
            )}
          >
            Blue (Dark)
          </button>
          <button
            onClick={() => setTheme("firewatch")}
            className={cn(
              "py-3 px-4 rounded-xl border font-medium text-sm transition-all",
              theme === "firewatch" 
                ? "border-theme-accent bg-theme-accent-light text-theme-accent-light-text" 
                : "border-theme-border text-theme-muted hover:bg-theme-bg"
            )}
          >
            Firewatch (Sunset)
          </button>
        </div>
      </div>

      <div className="bg-theme-card rounded-2xl p-5 shadow-sm border border-theme-border space-y-3 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <h3 className="text-xl font-bold text-theme-text font-heading">Allergies</h3>
        </div>
        <p className="text-sm text-theme-muted mb-2">Meals containing these will be strictly avoided.</p>
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="e.g., Peanuts, Shellfish, Dairy..."
          className="w-full px-4 py-3 rounded-xl border border-theme-border focus:ring-2 focus:ring-theme-accent focus:border-theme-accent outline-none transition-all min-h-[100px] resize-none bg-theme-bg text-theme-text"
        />
      </div>

      <div className="bg-theme-card rounded-2xl p-5 shadow-sm border border-theme-border space-y-3 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-1">
          <Ban className="w-5 h-5 text-theme-accent-text" />
          <h3 className="text-xl font-bold text-theme-text font-heading">Exclusions</h3>
        </div>
        <p className="text-sm text-theme-muted mb-2">Ingredients you just don't like.</p>
        <textarea
          value={exclusions}
          onChange={(e) => setExclusions(e.target.value)}
          placeholder="e.g., Mushrooms, Cilantro, Olives..."
          className="w-full px-4 py-3 rounded-xl border border-theme-border focus:ring-2 focus:ring-theme-accent focus:border-theme-accent outline-none transition-all min-h-[100px] resize-none bg-theme-bg text-theme-text"
        />
      </div>
    </div>
  );
}
