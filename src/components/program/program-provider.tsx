//this file will return a context provider that contains 
//all programs about our project

import React, { ReactNode } from "react";
import idl from "@/components/program/anchor/nameService/IDL.json";
import { NameServiceProvider } from "./name-service-provider";
import { AuctionServiceProvider } from "./auction-provider";


export interface ProgramContext{
    nameServiceProgramID: string,
}

const Context = React.createContext<ProgramContext>({} as ProgramContext)

export function ProgramContextProvider({ children }: { children: ReactNode }) {
    
    const value: ProgramContext = {
        nameServiceProgramID: idl.address
    }

    return (
        <Context.Provider value={value}>
            <NameServiceProvider>
                <AuctionServiceProvider>
                    {children}
                </AuctionServiceProvider>
            </NameServiceProvider>
        </Context.Provider>
    )
}