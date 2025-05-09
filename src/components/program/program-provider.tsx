//this file will return a context provider that contains 
//all programs about our project

import React, { ReactNode } from "react";



export interface ProgramContext{
    nameServiceProgramID: string,
}

const Context = React.createContext<ProgramContext>({} as ProgramContext)

export function ProgramContextProvider({ children }: { children: ReactNode }) {
    
    const value: ProgramContext = {
        nameServiceProgramID: "a"
    }

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}