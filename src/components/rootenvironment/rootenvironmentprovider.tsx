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
    const [activeRootDomainPubKey, setActiveRootDomainPubKey] = useAtom(activeRootDomainsPubAtom);
    const [rootDomainsPubKey, setRootDomainsPubKey] = useAtom(rootDomainsPubAtom);
    const [loading, setLoading] = useState(false);
  
    const refreshRootDomains = useCallback(async () => {
      
      setLoading(true);
      try {
        const domains = await getAllRootDomain(connection);
        setRootDomainsPubKey(domains);

        let tmpDomains: string[] = [];
        for(let i = 0; i < domains.length; i++){
          const checkingDomain = await reverseLookup(
            connection, rootDomainsPubKey[i], FindType.Root, null
          );

          if (checkingDomain){
            tmpDomains.push(checkingDomain);
          } 
        }

        setRootDomains(tmpDomains);

        if(!activeRootDomain){
            setActiveRootDomain(rootDomains[0]);
            setActiveRootDomainPubKey(rootDomainsPubKey[0])
        }

        if(domains.length < 2){
            setLoading(false);
        }
        
        if (activeRootDomainPubKey && !domains.includes(activeRootDomainPubKey)) {
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


