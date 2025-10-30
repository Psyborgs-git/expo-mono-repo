import React, { createContext, useContext, ReactNode } from 'react';
import { type Organization } from '@bdt/network';
import { useAuth } from './AuthContext';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  switchOrganization: (organization: Organization) => Promise<void>;
  getOrgHeader: () => string | undefined;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const { organization, selectOrganization } = useAuth();

  const switchOrganization = async (newOrganization: Organization) => {
    await selectOrganization(newOrganization);
  };

  const getOrgHeader = (): string | undefined => {
    return organization?.id;
  };

  const contextValue: OrganizationContextType = {
    currentOrganization: organization,
    switchOrganization,
    getOrgHeader,
  };

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextType {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider'
    );
  }
  return context;
}
