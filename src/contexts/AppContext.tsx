import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PilotDataset } from '@/lib/pilotParser';
import type { SimulationResult, DietInputs } from '@/lib/simulator';

export const SIMULATOR_DEFAULTS: DietInputs = {
  fiber_proxy: 25,
  added_sugar_proxy: 30,
  sat_fat_proxy: 15,
  omega3_proxy: 2,
};

interface AppState {
  presenterMode: boolean;
  setPresenterMode: (v: boolean) => void;
  adminMode: boolean;
  pilotDataset: PilotDataset | null;
  setPilotDataset: (d: PilotDataset | null) => void;
  lastRun: SimulationResult | null;
  setLastRun: (r: SimulationResult | null) => void;
  simulatorInputs: DietInputs;
  setSimulatorInputs: (inputs: DietInputs) => void;
  resetDemoState: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [presenterMode, setPresenterMode] = useState(false);
  const [pilotDataset, setPilotDataset] = useState<PilotDataset | null>(null);
  const [lastRun, setLastRun] = useState<SimulationResult | null>(null);
  const [simulatorInputs, setSimulatorInputs] = useState<DietInputs>(SIMULATOR_DEFAULTS);

  const adminMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('admin') === 'true';

  const resetDemoState = useCallback(() => {
    setLastRun(null);
    setPilotDataset(null);
    setSimulatorInputs(SIMULATOR_DEFAULTS);
    import('@/lib/simulator').then(m => m.clearRuns());
  }, []);

  return (
    <AppContext.Provider
      value={{
        presenterMode,
        setPresenterMode,
        adminMode,
        pilotDataset,
        setPilotDataset,
        lastRun,
        setLastRun,
        simulatorInputs,
        setSimulatorInputs,
        resetDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
