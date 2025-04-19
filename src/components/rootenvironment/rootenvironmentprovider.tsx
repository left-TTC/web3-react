import { Connection, PublicKey } from "@solana/web3.js";
import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuctionService } from "../program/auction-provider";
import { useNameService } from "../program/name-service-provider";
import { decodeRecordHeader } from "@/utils/user";
import { getUsrRecordAccount } from "@/utils/aboutquery";
import { useConnection } from "@solana/wallet-adapter-react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Program } from "@coral-xyz/anchor";
import { Auction } from "../program/anchor/auction/idl";
import { Web3NameService } from "../program/anchor/nameService/idl";



export interface RootDomainProviderContext {
    rootDomains: string[];
    activeRootDomain: string | null;
    setActiveRootDomain: (domain: string) => void;
    refreshRootDomains: () => Promise<void>;
    loading: boolean;
}

//give a global state
const RootDomainContext = React.createContext<RootDomainProviderContext>({
    rootDomains: [],
    activeRootDomain: null,
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

export function RootDomainProvider({ children }: { children: ReactNode }) {
    //useMemo will cache 
    const { auctionProgram } = useAuctionService();
    const { nameProgram } = useNameService();
    const { connection } = useConnection();

    const [activeRootDomain, setActiveRootDomain] = useAtom(activeRootDomainAtom);
    const [rootDomains, setRootDomains] = useAtom(rootDomainsAtom);
    const [loading, setLoading] = useState(false);
  
    const refreshRootDomains = useCallback(async () => {
      if (!auctionProgram || !nameProgram) return;
      
      setLoading(true);
      try {
        const domains = await getAvailableRoot(auctionProgram, nameProgram, connection);
        setRootDomains(domains);
        
        if(!activeRootDomain){
            setActiveRootDomain(domains[0])
        }

        console.log("domain length:", domains.length)

        if(domains.length < 2){
            setLoading(false);
        }
        
        if (activeRootDomain && !domains.includes(activeRootDomain)) {
          setActiveRootDomain(null);
        }
      } catch (error) {
        console.error('Failed to refresh root domains:', error);
      } 
    }, [auctionProgram, nameProgram, activeRootDomain, setActiveRootDomain, setRootDomains]);

    useEffect(() => {
      refreshRootDomains();
    }, [refreshRootDomains]);
  
    const contextValue = useMemo(() => ({
        rootDomains,
        activeRootDomain,
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


export async function getAvailableRoot(
    auctionProgram: Program<Auction>,
    nameProgram: Program<Web3NameService>,
    connection: Connection,
){
    if (!auctionProgram || !nameProgram) return [];

    try {
        const rootRecordAccount = getUsrRecordAccount(
            nameProgram.programId, 
            auctionProgram.programId, 
            null
        );

        console.log("try find rootrecord account")

        const recordAccountInfo = await connection.getAccountInfo(rootRecordAccount);

        if (!recordAccountInfo?.data) return [];

        const recordHeader = decodeRecordHeader(recordAccountInfo.data);

        if (recordHeader.root !== PublicKey.default.toBase58()) {
            console.error("Root is invalid");
            return [];
          }
      
        console.log("found domains:", recordHeader.domains)
        return recordHeader.domains || [];
    }catch(err){
        console.error("Failed to fetch root domains:", err);
        return [];
    }
}