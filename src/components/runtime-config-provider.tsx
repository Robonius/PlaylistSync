"use client";

import React, { createContext, useContext, ReactNode } from 'react';

export interface RuntimeConfig {
  SPOTIFY_CLIENT_ID: string;
  GOOGLE_CLIENT_ID: string;
  SPOTIFY_REDIRECT_URI: string;
  GOOGLE_REDIRECT_URI: string;
}

const RuntimeConfigContext = createContext<RuntimeConfig | undefined>(undefined);

export function RuntimeConfigProvider({
  config,
  children
}: {
  config: RuntimeConfig;
  children: ReactNode
}) {
  return (
    <RuntimeConfigContext.Provider value={config}>
      {children}
    </RuntimeConfigContext.Provider>
  );
}

export function useRuntimeConfig() {
  const context = useContext(RuntimeConfigContext);
  if (context === undefined) {
    throw new Error('useRuntimeConfig must be used within a RuntimeConfigProvider');
  }
  return context;
}
