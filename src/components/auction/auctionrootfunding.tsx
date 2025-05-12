import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";

import previous from "../../assets/previous.png";
import next from "../../assets/next.png";

import "../../style/components/auction/auctionfunding.css"
import { creatingRoot, findCreatingRootDomains } from "@/utils/auction/findCreatingRootDomain";
import { CREATE_ROOT_FEE } from "@/utils/constants";
import { Transaction } from "@solana/web3.js";

const FundingRootInfo = () => {
    const [showAddAmountModal, setShowAddAmountModal] = useState(false);

    const { connection } = useConnection();
    const {publicKey: wallet ,signTransaction} = useWallet();

    const [creatingLists, setCreatingLists] = useState<creatingRoot[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const lists = await findCreatingRootDomains(connection);
            console.log("find lists:", lists)
            setCreatingLists(lists);
        };

        fetchData();
    }, [wallet]);

    const [addingRoot, setAddingRoot] = useState<creatingRoot | null>(null);

    const addAmount = (addingroot: creatingRoot) => {
        setAddingRoot(addingroot);
        setShowAddAmountModal(true)
    }

    const CrowdingLists = ({ creatingLists }: { creatingLists: creatingRoot[] }) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const [currentRoot, setCurrentRoot] = useState<creatingRoot>(creatingLists[0])

        useEffect(() => {
            setCurrentRoot(creatingLists[currentIndex])
        }, [currentIndex])

        const nextItem = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % creatingLists.length);
        };

        const lastItem = () => {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? creatingLists.length - 1 : prevIndex - 1
            );
        };

        const calculateProgress = () => {
            const currentState = Number(currentRoot.info.state);
            const createFee = Number(CREATE_ROOT_FEE);
            return Math.min((currentState / createFee) * 100, 100);
          };

        const progress = calculateProgress();
        
        return (
            <div className="crowdingLists">
                <button onClick={lastItem} className="crowdButton">
                    <img src={previous} width={40} />
                </button>
                <div className="nowShow">
                    <h1>{currentRoot.info.name}</h1>
                    {currentRoot ? (
                        <div className="infoBlock">
                            <h1>{Number(CREATE_ROOT_FEE)}</h1>
                            <h2>Raised: {Number(currentRoot.info.state)}</h2>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <button className="donate" onClick={() => addAmount(currentRoot)}>
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
        checingInfo: creatingRoot | null; 
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
        
    
        const handleConfirmAddAmount = async() => {
            if (!checingInfo || !wallet || !signTransaction)return;
            
            const addTX = checingInfo.addAmount(willAddAmount, wallet);
            if (!addTX)return;

            const transaction = new Transaction().add(addTX);

            const { blockhash } = await connection.getLatestBlockhash();
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = wallet;

            const signedTx = await signTransaction(transaction);
            try{
                const TX = await connection.sendRawTransaction(signedTx.serialize());
                console.log("transaction success:", TX)
            }catch(err){
                console.log("fail:", err)
            }
            
            console.log("add")
            closeAddModal();
        };

        
        const amountOptions = [5000, 9000, 20000, 50000, 100000, checingInfo? (CREATE_ROOT_FEE  - Number(checingInfo.info.state) ):(200000)];

        return (
            <div className="addmodal">
                <div className="addBlock">
                    <div className="title">
                        <h1>you are checking:</h1>
                        <h2>{addingRoot?.info.name}</h2>
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
                    
                    <button className="addbutton confirm" onClick={() =>handleConfirmAddAmount()}>
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
            {showAddAmountModal && <AddModal checingInfo={addingRoot} />}
        </div>
    );
}

export default FundingRootInfo;
