import React, { ReactNode, useEffect, useState } from "react";
import { Web3NameService } from "@/components/program/anchor/nameService/idl";
import idl from "@/components/program/anchor/nameService/IDL.json";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";

export interface NameServiceProviderContext{
    nameProgram: anchor.Program<Web3NameService> | null;
}

const Context = React.createContext<NameServiceProviderContext>({
    nameProgram: null,
});

//web3 name service program context
export function NameServiceProvider({ children }: { children: ReactNode}){

    const {connection} = useConnection()
    const anchorWallet = useAnchorWallet();

    const [nameProgram, setnameProgram] = useState<anchor.Program<Web3NameService> | null>(null);
    
    useEffect(() => {
        if (anchorWallet) {
          const provider = new anchor.AnchorProvider(connection, anchorWallet, {
            commitment: "confirmed",
          });
    
          const newProgram = new anchor.Program<Web3NameService>(idl, provider);
    
          setnameProgram(newProgram);
        } else {
          setnameProgram(null);
        }
      }, [anchorWallet, connection]);
    

    const value: NameServiceProviderContext = {
        nameProgram: nameProgram,
    }

    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useNameService() {
    return React.useContext(Context);
}


