
import { Connection, PublicKey } from "@solana/web3.js";
import "../../style/components/auctioncreateroot.css"
import { useEffect, useState } from "react";
import { useAuctionService } from "../program/auction-provider";
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { getHashedName, getSeedAndKey } from "@/utils/aboutquery";
import { useNameService } from "../program/name-service-provider";
import React from 'react'; 
import { checkAuctionAccountLists, createRootAccount, createRootInfo, decodeFundingRootData } from "@/utils/auction";

import previous from "../../assets/previous.png";
import next from "../../assets/next.png";

interface crowdingRoot{
    domainName: string,
    nowRaised: number,
    targetAmount: number,
}


const AuctionCreateRoot = () => {
    const [creatingLists, setCreatingLists] = useState<string[]>([]);
    const { auctionProgram } = useAuctionService();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const { nameProgram } = useNameService();

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

    // 优化的 CrowdingLists 组件，使用 React.memo 防止不必要的渲染
    const CrowdingLists = React.memo(() => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const [checingInfo, setChecingInfo] = useState<{ [creatingRoot: string]: createRootInfo | null }>({});
        const currentDomain = creatingLists[currentIndex];

        const nextItem = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % creatingLists.length);
        };

        const lastItem = () => {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? creatingLists.length - 1 : prevIndex - 1
            );
        };

        useEffect(() => {
            const fetchRootInfo = async () => {
                if (connection && nameProgram && auctionProgram) {
                    try {
                        const { nameAccountKey: seed } = getSeedAndKey(
                            nameProgram.programId,
                            getHashedName(currentDomain),
                            null
                        );
                        const seeds = [
                            Buffer.from("web3 Auction"),
                            seed.toBuffer(),
                        ];
                        const [address, bump] = await PublicKey.findProgramAddressSync(seeds, auctionProgram.programId);
                        const fundingRootAccountInfo = await connection.getAccountInfo(address);

                        if (fundingRootAccountInfo) {
                            const data = decodeFundingRootData(fundingRootAccountInfo.data);
                            // 更新状态时检查是否已经存在数据
                            setChecingInfo((prevState) => ({
                                ...prevState,
                                [currentDomain]: data,
                            }));
                        } else {
                            throw new Error("no this accountInfo");
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            };
            fetchRootInfo();
        }, [currentDomain, connection, nameProgram, auctionProgram]);

        const calculateProgress = () => {
            const info = checingInfo[currentDomain];
            if (!info || info.target === 0) return 0;
            return Math.min((info.raisedAmount / info.target) * 100, 100);
        };

        const progress = calculateProgress();

        const [showAddAmountModal, setShowAddAmountModal] = useState(false);
        const addAmount = (addingDomain: string) => {
            setShowAddAmountModal(true);
            console.log("happy");
        };

        const closeAddModal = () => {
            setShowAddAmountModal(false);
        };

        return (
            <div className="crowdingLists">
                <button onClick={lastItem} className="crowdButton">
                    <img src={previous} width={40} />
                </button>
                <div className="nowShow">
                    <h1>{currentDomain}</h1>
                    {checingInfo[currentDomain] ? (
                        <div className="infoBlock">
                            <h1>{checingInfo[currentDomain]?.target}</h1>
                            <h2>Raised: {checingInfo[currentDomain]?.raisedAmount}</h2>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <button className="donate" onClick={() => addAmount(currentDomain)}>
                                add
                            </button>
                        </div>
                    ) : (
                        <div className="loader"></div>
                    )}
                </div>
                <button onClick={nextItem} className="crowdButton">
                    <img src={next} width={40} />
                </button>
            </div>
        );
    });

    const crowding = (
        <div className="showcrowding">
            {creatingLists.length > 0 ? (
                <CrowdingLists />
            ) : (
                <p>No items to display.</p>
            )}
        </div>
    );

    const showCreateRootModal = () => {
        setShowCreateRoot(true);
    };

    const create = (
        <div className="createCrowd">
            <div className="wordBox">
                <h1>Don't have a root domain you like?</h1>
                <h2>Click here to create one that you want</h2>
            </div>
            <button className="buttonBox" onClick={showCreateRootModal}>
                <h1>balabala</h1>
            </button>
        </div>
    );

    const [showCreateRoot, setShowCreateRoot] = useState(false);

    const closeCreateRootModal = () => {
        setShowCreateRoot(false);
    };

    const clinkToCreate = async (wantCreateRoot: string, initBalance: string) => {
        try {
            await createRootAccount(wantCreateRoot, auctionProgram, wallet, nameProgram, +initBalance);
        } catch (err) {
            console.error("Error creating root:", err);
        }

        closeCreateRootModal();
    };

    const [wantCreateRootName, setWantCreateRoorName] = useState("");
    const [fundAmount, setFundAmount] = useState("");

    const createRoot = (
        <div className="createRoot">
            <div className="createBox">
                <input
                    className="createRootInput"
                    type="text"
                    value={wantCreateRootName}
                    onChange={(e) => setWantCreateRoorName(e.target.value)}
                    placeholder="what you want"
                />
                <input
                    className="initBalanceInput"
                    type="text"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                />
                <button className="createButton" onClick={() => clinkToCreate(wantCreateRootName, fundAmount)}>
                    <h1>create</h1>
                </button>
            </div>
        </div>
    );

    return (
        <div className="show">
            {crowding}
            {create}
            {showCreateRoot && createRoot}
        </div>
    );
};

export default AuctionCreateRoot;


