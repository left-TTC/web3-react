
import { Connection, PublicKey } from "@solana/web3.js";
import "../../style/components/auctioncreateroot.css"
import { useEffect, useState } from "react";
import { useAuctionService } from "../program/auction-provider";
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { BN, Program } from "@coral-xyz/anchor";
import { Auction } from "../program/anchor/auction/idl";
import { Web3NameService } from "../program/anchor/nameService/idl";
import { getHashedName, getSeedAndKey } from "@/utils/aboutquery";
import { useNameService } from "../program/name-service-provider";
import React from 'react'; 
import { checkAuctionAccountLists, createRootAccount, createRootInfo, decodeFundingRootData } from "@/utils/auction";

interface crowdingRoot{
    domainName: string,
    nowRaised: number,
    targetAmount: number,
}


export const AuctionCreateRoot = () => {
    const [creatingLists, setCreatingLists] = useState<string[]>([]);

    const {auctionProgram} = useAuctionService();
    const {connection} = useConnection();
    const wallet = useAnchorWallet();
    const {nameProgram} = useNameService();

    useEffect(() => {
        const fetchData = async () => {
            if (auctionProgram && connection) {
                try {
                    const newLists = await checkAuctionAccountLists(auctionProgram.programId, connection);

                    if (newLists) {
                        setCreatingLists(newLists.slice(0, newLists.length - 1));  
                    }
                } catch (error) {
                    console.error("Error fetching auction account lists:", error);
                }
            }
        };
    
        fetchData();
    }, [auctionProgram, connection]);

    const CrowdingLists = () => {
        const [currentIndex, setCurrentIndex] = useState(0);

        const nextItem = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % creatingLists.length);
        };

        const lastItem = () => {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? creatingLists.length - 1 : prevIndex - 1
            );
        };

        const [checingInfo, setChecingInfo] = useState<{ [creatingRoot: string]: createRootInfo | null}>({});
        const currentDomain = creatingLists[currentIndex]

        useEffect(() =>{
            const fetchRootInfo = async () => {
                if(connection && nameProgram && auctionProgram){
                    try{
                        const {nameAccountKey: seed} = getSeedAndKey(
                            nameProgram.programId, getHashedName(currentDomain), null);
                        const seeds = [
                            Buffer.from("web3 Auction"),
                            seed.toBuffer()
                        ]
                        const [address, bump] = await PublicKey.findProgramAddressSync(seeds, auctionProgram.programId);
                        const fundingRootAccountInfo = await connection.getAccountInfo(address);

                        if (fundingRootAccountInfo){
                            const data = decodeFundingRootData(fundingRootAccountInfo.data);
                            setChecingInfo((prevState) => ({
                                ...prevState,
                                [currentDomain]: data,
                            }));
                        }else{
                            throw new Error("no this accountInfo")
                        }
                    }catch(err){

                    }
                }
            }
            fetchRootInfo();
        }, [currentDomain])

        return(
            <React.Fragment>
                <div className="crowdingLists">
                    <button onClick={nextItem}>Next</button>
                    <div className="nowShow">
                        <h1>{currentDomain}</h1>
                        <div className="infoBlock">
                        {checingInfo[currentDomain] ? (
                            <div>
                            <h1>Target: {checingInfo[currentDomain]?.target}</h1>
                            <h2>Raised Amount: {checingInfo[currentDomain]?.raisedAmount}</h2>
                            </div>
                        ) : (
                            <div className="loader"></div>
                        )}
                        </div>
                    </div>
                    <button onClick={lastItem}>Previous</button>
                </div>
            </React.Fragment>
        )
    }

    const crowding =
        <div className="showcrowding">
            {creatingLists.length > 0 ? (
                <CrowdingLists />
            ) : (
                <p>No items to display.</p>  
            )}
        </div>

    const showCreateRootModal = () => {
        setShowCreateRoot(true);
    }

    const create = 
        <div className="createCrowd">
            <div className="wordBox">
                <h1>Don't have a root domain you like?</h1>
                <h2>Click here to create one that you want</h2>
            </div>
            <button className="buttonBox" onClick={showCreateRootModal}>
                <h1>balabala</h1>
            </button>
        </div>

    const [showCreateRoot, setShowCreateRoot] = useState(false);


    const closeCreateRootModal = () => {
        setShowCreateRoot(false);
    }

    const clinkToCreate = (wantCreateRoot: string, initBalance: string) => {
        try{
            createRootAccount(wantCreateRoot, auctionProgram, wallet, nameProgram, +initBalance);
        }catch(err){

        }

        closeCreateRootModal();
    }

    const [wantCreateRootName, setWantCreateRoorName] = useState("");
    const [fundAmount, setFundAmount] = useState("");

    const createRoot =
        <div className="createRoot">
            <div className="createBox">
                <input className="createRootInput" type="text" value={wantCreateRootName} onChange={(e) => setWantCreateRoorName(e.target.value)} placeholder="what you want"/>
                <input className="initBalanceInput" type="text" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)}/>
                <button className="createButton" onClick={() => clinkToCreate(wantCreateRootName, fundAmount)}>
                    <h1>create</h1>
                </button>
            </div>
        </div>

    return(
        <div className="show">
            {crowding}
            {create}
            {showCreateRoot && createRoot}
        </div>
    )
}


