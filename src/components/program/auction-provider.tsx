import React, { ReactNode, useEffect, useState } from "react";
import { Auction } from "@/components/program/anchor/auction/idl";
import idl from "@/components/program/anchor/auction/IDL.json";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";


export interface AuctionProviderContext{
    auctionProgram: anchor.Program<Auction> | null,

}

const AcutionContext = React.createContext<AuctionProviderContext>({
    auctionProgram: null,
})

export function AuctionServiceProvider({ children }: { children: ReactNode}){

    const {connection} = useConnection()
    const anchorWallet = useAnchorWallet();

    const [auctionProgram, setAuctionProgram] = useState<anchor.Program<Auction> | null>(null);

    useEffect(() => {
        if (anchorWallet) {
            const provider = new anchor.AnchorProvider(connection, anchorWallet, {
                commitment: "confirmed",
            });

            const newProgram = new anchor.Program<Auction>(idl, provider);

            setAuctionProgram(newProgram);
        } else {
            setAuctionProgram(null);
        }
    }, [anchorWallet, connection]);

    const value: AuctionProviderContext = {
        auctionProgram: auctionProgram,
    }

    return <AcutionContext.Provider value={ value }>{ children }</AcutionContext.Provider>
}

export function useAuctionService() {
    return React.useContext(AcutionContext);
}