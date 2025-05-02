import React, { useEffect, useState } from "react";
import { useAuctionService } from "../program/auction-provider";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useNameService } from "../program/name-service-provider";
import { addFundingAmount, checkAuctionAccountLists, checkFundingStateAccount, createRootInfo, decodeAuctionList, decodeFundingRootData } from "@/utils/auction";
import { getHashedName, getSeedAndKey } from "@/utils/aboutquery";
// import { PublicKey } from "@solana/web3.js";

import previous from "../../assets/previous.png";
import next from "../../assets/next.png";

import "../../style/components/auction/auctionfunding.css"

const FundingRootInfo = () => {
    const [creatingLists, setCreatingLists] = useState<string[]>([]);
    const [addingDomain, setAddingDomain] = useState("");
    const [showAddAmountModal, setShowAddAmountModal] = useState(false);

    const { auctionProgram } = useAuctionService();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const { nameProgram } = useNameService();

    useEffect(() => {
        const fetchData = async () => {
            if (auctionProgram && connection) {
                try {
                    const listAccountInfo = await checkAuctionAccountLists(auctionProgram.programId, connection);
                    
                    if (listAccountInfo) {
                        const newLists = decodeAuctionList(listAccountInfo)
                        setCreatingLists(newLists.slice(0, newLists.length - 1));
                    }
                } catch (error) {
                    console.error("Error fetching auction account lists:", error);
                }
            }
        };

        fetchData();
    }, [auctionProgram, connection]);

    const [addingDomainInfo, setAddingDomainInfo] = useState<createRootInfo | null>(null);

    const CrowdingLists = ({ creatingLists }: { creatingLists: string[] }) => {
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
                        const { nameAccountKey: willCreateRoot } = getSeedAndKey(
                            nameProgram.programId,
                            getHashedName(currentDomain),
                            null
                        );
                        
                        const fundingRootStateAccount = await checkFundingStateAccount(auctionProgram.programId, willCreateRoot);
                        if (fundingRootStateAccount){
                            const fundingRootAccountInfo = await connection.getAccountInfo(fundingRootStateAccount);
                            
                            if (fundingRootAccountInfo) {
                                const data = decodeFundingRootData(fundingRootAccountInfo.data);
                                setChecingInfo((prevState) => ({
                                    ...prevState,
                                    [currentDomain]: data,
                                }));
                            } else {
                                throw new Error("no this accountInfo");
                            }
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
        
        const addAmount = (addingDomain: string, addingDomainInfo: createRootInfo | null) => {
            setShowAddAmountModal(true);
            console.log("happy");
            setAddingDomain(addingDomain);
            setAddingDomainInfo(addingDomainInfo)
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
                            <button className="donate" onClick={() => addAmount(currentDomain, checingInfo[currentDomain])}>
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
    };

    interface AddModalProps {
        checingInfo: createRootInfo | null; 
    }

    const AddModal: React.FC<AddModalProps> = ({ checingInfo })  => {
        const [willAddAmount, setWillAddAmount] = useState<number>(0);
        const [showAmountOptions, setShowAmountOptions] = useState(false);
    
        const handleAmountChange = (amount: number) => {
            setWillAddAmount(amount);
            setShowAmountOptions(false);
        };

        const toggleAmountOptions = () => {
            setShowAmountOptions(!showAmountOptions);
        };
    
        const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = +event.target.value;
            setWillAddAmount(value);
        };

        const closeAddModal = () => {
            setShowAddAmountModal(false);
            setWillAddAmount(0);
        };
    
        const handleConfirmAddAmount = async (addingDomain: string) => {
            if (willAddAmount > 0){
                const tx = await addFundingAmount(auctionProgram, wallet, nameProgram, willAddAmount, addingDomain)
                console.log(tx)
            }
            console.log("add")
            closeAddModal();
        };

        
        const amountOptions = [5000, 10000, 20000, 50000, 100000, checingInfo? (checingInfo.target - checingInfo.raisedAmount):(200000)];

        return (
            <div className="addmodal">
                <div className="addBlock">
                    <div className="title">
                        <h1>you are checking:</h1>
                        <h2>{addingDomain}</h2>
                    </div>
                    
                    <div className="amountInput">
                        <input 
                            className="amountInputbox"
                            type="text" 
                            value={willAddAmount || ""} 
                            onChange={handleAddressChange}
                            placeholder="Enter your wallet address"
                        />

                        <div className="amountSelection">
                            <button 
                                className="amountLabel" 
                                onClick={toggleAmountOptions}
                            >
                                add
                                <span className="dropdownArrow">
                                    {showAmountOptions ? '▲' : '▼'}
                                </span>
                            </button>
                            
                            {showAmountOptions && (
                                <div className="amountOptions">
                                    <div className="amountButtons">
                                        {amountOptions.map((amount) => (
                                            <button
                                                key={amount}
                                                className={`amountButton ${willAddAmount === amount ? 'selected' : ''}`}
                                                onClick={() => handleAmountChange(amount)}
                                            >
                                                {amount}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button className="addbutton confirm" onClick={() =>handleConfirmAddAmount(addingDomain)}>
                        <h1>Confirm</h1>
                    </button>

                    <button className="addbutton cancle" onClick={closeAddModal}>
                        <h1>Cancle</h1>
                    </button>

                </div>
            </div>
        )
    };

    return (
        <div className="two">
            <div className="showcrowding">
                {creatingLists.length > 0 ? (
                    <CrowdingLists creatingLists={creatingLists} />
                ) : (
                    <p>No items to display.</p>
                )}
            </div>
            {showAddAmountModal && <AddModal checingInfo={addingDomainInfo} />}
        </div>
    );
}

export default FundingRootInfo;
