"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  registerTab: (trigger: HTMLButtonElement, value: string) => void;
  activeValue: string | undefined;
}>({
  registerTab: () => {},
  activeValue: undefined,
});

interface ElegantTabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const ElegantTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  ElegantTabsProps
>(({ defaultValue, value, onValueChange, ...props }, ref) => {
  const [activeValue, setActiveValue] = React.useState<string | undefined>(value ?? defaultValue);
  const tabsRef = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  
  const registerTab = React.useCallback((trigger: HTMLButtonElement, value: string) => {
    tabsRef.current.set(value, trigger);
  }, []);
  
  React.useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
    }
  }, [value]);
  
  const handleValueChange = React.useCallback((newValue: string) => {
    setActiveValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);
  
  const contextValue = React.useMemo(() => ({
    registerTab,
    activeValue,
  }), [registerTab, activeValue]);
  
  return (
    <TabsContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        ref={ref}
        defaultValue={defaultValue}
        value={value}
        onValueChange={handleValueChange}
        {...props}
      />
    </TabsContext.Provider>
  );
});
ElegantTabs.displayName = "ElegantTabs";

const ElegantTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    indicatorClassName?: string;
  }
>(({ className, children, indicatorClassName, ...props }, ref) => {
  const { activeValue } = React.useContext(TabsContext);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });
  const [activeTab, setActiveTab] = React.useState<HTMLButtonElement | null>(null);
  const [initialized, setInitialized] = React.useState(false);
  
  // Track the active tab element
  React.useEffect(() => {
    if (!listRef.current) return;
    
    const activeTabElement = listRef.current.querySelector(`[data-state="active"]`) as HTMLButtonElement;
    if (activeTabElement) {
      setActiveTab(activeTabElement);
      if (!initialized) setInitialized(true);
    }
  }, [activeValue, initialized]);
  
  // Update indicator position
  React.useEffect(() => {
    if (activeTab && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const activeRect = activeTab.getBoundingClientRect();
      
      setIndicator({
        left: activeRect.left - listRect.left,
        width: activeRect.width,
      });
    }
  }, [activeTab, listRef]);
  
  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      if (activeTab && listRef.current) {
        const listRect = listRef.current.getBoundingClientRect();
        const activeRect = activeTab.getBoundingClientRect();
        
        setIndicator({
          left: activeRect.left - listRect.left,
          width: activeRect.width,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  return (
    <div className="relative" ref={listRef}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "inline-flex items-center justify-start border-b border-gray-100 dark:border-dark-slate transition-colors",
          className,
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
      <div 
        className={cn(
          "absolute h-0.5 bg-[#0066CC] dark:bg-[#0066CC] bottom-0 transition-all duration-300 ease-in-out",
          indicatorClassName
        )}
        style={{ 
          left: `${indicator.left}px`, 
          width: `${indicator.width}px`,
          opacity: initialized ? 1 : 0, 
        }}
      />
    </div>
  );
});
ElegantTabsList.displayName = "ElegantTabsList";

const ElegantTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, ...props }, ref) => {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { registerTab } = React.useContext(TabsContext);
  
  React.useEffect(() => {
    if (triggerRef.current && value) {
      registerTab(triggerRef.current, value);
    }
  }, [registerTab, value]);
  
  return (
    <TabsPrimitive.Trigger
      ref={triggerRef}
      value={value}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap py-3 px-4 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50",
        "text-gray-500 dark:text-gray-400 data-[state=active]:text-[#2C2C2C] dark:data-[state=active]:text-white",
        className,
      )}
      {...props}
    />
  );
});
ElegantTabsTrigger.displayName = "ElegantTabsTrigger";

const ElegantTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 transition-all duration-500 ease-in-out",
      "data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-2",
      "data-[state=active]:opacity-100 data-[state=active]:translate-y-0",
      "focus-visible:outline-none",
      className,
    )}
    {...props}
  />
));
ElegantTabsContent.displayName = "ElegantTabsContent";

export { ElegantTabs, ElegantTabsList, ElegantTabsTrigger, ElegantTabsContent } 