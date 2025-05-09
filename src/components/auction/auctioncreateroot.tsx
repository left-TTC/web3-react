import "../../style/components/auction/auctioncreateroot.css"
import { useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// import { createRootAccount } from "@/utils/auction";


const AuctionCreateRoot = () => {
    const { connection } = useConnection();

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
        try {
            // await 
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


