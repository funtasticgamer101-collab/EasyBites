import { useState } from "react";
import { ChefHat, CalendarDays, ShoppingCart, CalendarClock, Settings, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "current" | "ingredients" | "next" | "settings";
  setActiveTab: (tab: "current" | "ingredients" | "next" | "settings") => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNavClick = (tab: "current" | "ingredients" | "next" | "settings") => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-theme-bg font-sans overflow-hidden transition-colors duration-300 relative z-0">
      <div className="theme-bg-layer firewatch-bg" />
      
      {/* Top App Bar */}
      <header className="bg-theme-accent text-white shadow-md z-10 flex-shrink-0 transition-colors duration-300">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-heading">EasyBites</h1>
          </div>
          
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-7 h-7 text-white" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-safe">
        {children}
      </main>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-theme-card shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-theme-border-light flex items-center justify-between bg-theme-accent text-white">
          <div className="flex items-center gap-3">
            <ChefHat className="w-6 h-6" />
            <h2 className="text-xl font-bold font-heading">Menu</h2>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleNavClick("current")}
            className={cn(
              "flex items-center gap-4 w-full p-4 rounded-xl transition-colors text-left",
              activeTab === "current" 
                ? "bg-theme-accent-light text-theme-accent-light-text font-bold" 
                : "text-theme-text hover:bg-theme-bg"
            )}
          >
            <CalendarDays className={cn("w-6 h-6", activeTab === "current" ? "text-theme-accent-text" : "text-theme-muted")} />
            <span className="text-lg">This Week</span>
          </button>
          
          <button
            onClick={() => handleNavClick("ingredients")}
            className={cn(
              "flex items-center gap-4 w-full p-4 rounded-xl transition-colors text-left",
              activeTab === "ingredients" 
                ? "bg-theme-accent-light text-theme-accent-light-text font-bold" 
                : "text-theme-text hover:bg-theme-bg"
            )}
          >
            <ShoppingCart className={cn("w-6 h-6", activeTab === "ingredients" ? "text-theme-accent-text" : "text-theme-muted")} />
            <span className="text-lg">Groceries</span>
          </button>

          <button
            onClick={() => handleNavClick("next")}
            className={cn(
              "flex items-center gap-4 w-full p-4 rounded-xl transition-colors text-left",
              activeTab === "next" 
                ? "bg-theme-accent-light text-theme-accent-light-text font-bold" 
                : "text-theme-text hover:bg-theme-bg"
            )}
          >
            <CalendarClock className={cn("w-6 h-6", activeTab === "next" ? "text-theme-accent-text" : "text-theme-muted")} />
            <span className="text-lg">Next Week</span>
          </button>

          <div className="my-4 border-t border-theme-border-light mx-2"></div>

          <button
            onClick={() => handleNavClick("settings")}
            className={cn(
              "flex items-center gap-4 w-full p-4 rounded-xl transition-colors text-left",
              activeTab === "settings" 
                ? "bg-theme-accent-light text-theme-accent-light-text font-bold" 
                : "text-theme-text hover:bg-theme-bg"
            )}
          >
            <Settings className={cn("w-6 h-6", activeTab === "settings" ? "text-theme-accent-text" : "text-theme-muted")} />
            <span className="text-lg">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
