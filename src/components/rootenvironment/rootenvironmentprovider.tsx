import { getRecordListsPda } from "@/utils/auction";
import { PublicKey } from "@solana/web3.js";
import React, { ReactNode } from "react";
import { useAuctionService } from "../program/auction-provider";
import { useNameService } from "../program/name-service-provider";
import { getUserDomain } from "@/utils/user";
import { getUsrRecordAccount } from "@/utils/aboutquery";
import { useConnection } from "@solana/wallet-adapter-react";




export interface RootDomainProviderContext {
    rootDomain: string[],
    activeRootDomain: string | null,
    setActiveRootDomain: (choose: string) => void;
}

const RootDomainContext = React.createContext<RootDomainProviderContext>({} as RootDomainProviderContext)

export function RootDomainProvider({ children }: { children: ReactNode}){
    
}

export async function getAvailableRoot(){
    const {auctionProgram} = useAuctionService();
    const {nameProgram} = useNameService();
    const {connection} = useConnection();

    if (auctionProgram && nameProgram){
        const rootRecordAccount = getUsrRecordAccount(
            nameProgram.programId, auctionProgram.programId, null
        );

        const recordAccountInfo = await connection.getAccountInfo(rootRecordAccount)
    }
}