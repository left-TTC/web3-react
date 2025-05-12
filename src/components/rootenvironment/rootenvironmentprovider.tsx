import { PublicKey } from "@solana/web3.js";
import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { getAllRootDomain } from "@/utils/search/getAllDomains";
import { FindType, reverseLookup } from "@/utils/search/reverseLookup";



export interface RootDomainProviderContext {
    rootDomains: string[];
    activeRootDomain: string | null;
    rootDomainsPubKey: PublicKey[];
    activeRootDomainPubKey: PublicKey | null;
    setActiveRootDomain: (domain: string) => void;
    setActiveRootDomainPubkey: (pubkey: PublicKey) => void;
    refreshRootDomains: () => Promise<void>;
    loading: boolean;
}

//give a global state
const RootDomainContext = React.createContext<RootDomainProviderContext>({
    rootDomains: [],
    activeRootDomain: null,
    rootDomainsPubKey: [],
    activeRootDomainPubKey: null,
    setActiveRootDomain: () => {},
    setActiveRootDomainPubkey: () => {},
    refreshRootDomains: async () => {},
    loading: false,
});

export const activeRootDomainAtom = atomWithStorage<string | null>(
    'web3-active-root',
    null,
);

export const rootDomainsAtom = atomWithStorage<string[]>(
    'web3-root-domains',
    [],
);

export const rootDomainsPubAtom = atomWithStorage<PublicKey[]>(
    'web3-root-domains-keys',
    [],
)

export const activeRootDomainsPubAtom = atomWithStorage<PublicKey | null>(
    'web3-root-domains-key',
    null,
);

export function RootDomainProvider({ children }: { children: ReactNode }) {
    //useMemo will cache 
    const { connection } = useConnection();
    // const { publicKey: usrKey} = useWallet();

    const [activeRootDomain, setActiveRootDomain] = useAtom(activeRootDomainAtom);
    const [rootDomains, setRootDomains] = useAtom(rootDomainsAtom);
    const [activeRootDomainPubKey, setActiveRootDomainPubkey] = useAtom(activeRootDomainsPubAtom);
    const [rootDomainsPubKey, setRootDomainsPubKey] = useAtom(rootDomainsPubAtom);
    const [loading, setLoading] = useState(false);
  
    const refreshRootDomains = useCallback(async () => {
      setLoading(true);
      try {
        const domains = await getAllRootDomain(connection);
        console.log("root number:", domains.length);

        setRootDomainsPubKey(domains);

        const domainPromises = domains.map(domain => 
          reverseLookup(connection, domain, FindType.Root, null)
        );
        const resolvedDomains = (await Promise.all(domainPromises)).filter(Boolean) as string[];
  
        setRootDomains(resolvedDomains);

        if (!activeRootDomain && resolvedDomains.length > 0) {
          setActiveRootDomain(resolvedDomains[0]);
          setActiveRootDomainPubkey(domains[0]);
        }

        if (activeRootDomainPubKey && !domains.some(d => d.equals(activeRootDomainPubKey))) {
          setActiveRootDomain(null);
        }
      } catch (error) {
        console.error('Failed to refresh root domains:', error);
      } 
    }, [activeRootDomain, setActiveRootDomain, setRootDomains]);

    useEffect(() => {
      refreshRootDomains();
    }, [refreshRootDomains]);
  
    const contextValue = useMemo(() => ({
        rootDomains,
        activeRootDomain,
        rootDomainsPubKey,
        activeRootDomainPubKey,
        setActiveRootDomain,
        setActiveRootDomainPubkey,
        refreshRootDomains,
        loading,
    }), [rootDomains, activeRootDomain, setActiveRootDomain, refreshRootDomains, loading]);
  
    return (
      <RootDomainContext.Provider value={contextValue}>
        {children}
      </RootDomainContext.Provider>
    );
}

export const useRootDomain = () => useContext(RootDomainContext);


