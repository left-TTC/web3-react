import "../../style/components/auction/auctioncreateroot.css"
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAuctionRecordKey, getHashedName } from "@/utils/search/getNameAccountKey";
import { createRootFundInstruction } from "@/utils/auction/createRootDomainInstruction";
import { Transaction } from "@solana/web3.js";
import { CENTRAL_STATE_AUCTION } from "@/utils/constants";
// import { createRootAccount } from "@/utils/auction";


const AuctionCreateRoot = () => {
    const { connection } = useConnection();
    const { publicKey: wallet, signTransaction} = useWallet()

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

    const clinkToCreate = async (wantCreateRoot: string) => {
        if (!wallet || !signTransaction)return;

        console.log("start, name is:", wantCreateRoot)

        const rootRecordAccount = getAuctionRecordKey(
            getHashedName(wantCreateRoot), null, null
        )

        console.log("rootRecord:", rootRecordAccount.toBase58());

        const createFeeSaverAccount = getAuctionRecordKey(
            getHashedName(wantCreateRoot), CENTRAL_STATE_AUCTION, CENTRAL_STATE_AUCTION
        );
        console.log("fee_saver:", createFeeSaverAccount.toBase58());


        const fundtx = createRootFundInstruction(
            rootRecordAccount,
            wallet,
            createFeeSaverAccount,
            wantCreateRoot,
        )

        try {
            const transaction = new Transaction().add(fundtx);
            const { blockhash } = await connection.getLatestBlockhash();
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = wallet;

            const signedTx = await signTransaction(transaction);

            const txId = await connection.sendRawTransaction(signedTx.serialize());

            console.log("transaction success:", txId);
        } catch (err) {
            console.error("Error creating root:", err);
        }

        closeCreateRootModal();
    };

    const [wantCreateRootName, setWantCreateRoorName] = useState("");

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
                <button className="createButton" onClick={() => clinkToCreate(wantCreateRootName)}>
                    <h1>create</h1>
                </button>
            </div>
        </div>
    );

    return (
        <div className="show">
            {create}
            {showCreateRoot && createRoot}
        </div>
    );
};

export default AuctionCreateRoot;


