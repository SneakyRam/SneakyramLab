
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AssistantContextType = {
  isOpen: boolean;
  toggleAssistant: () => void;
};

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAssistant = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <AssistantContext.Provider value={{ isOpen, toggleAssistant }}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}
