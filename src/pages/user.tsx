import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from 'react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import "@/style/pages/user.css"
import { findUserInfo } from "@/utils/user";
import { useNameService } from "@/components/program/name-service-provider";
import DomainBlock from "@/components/userpage/domiansshow";
import { updateIPFS } from "@/utils/updatedomain";

export interface revisingDomainInfo{
    name: string,
    root: string,
    ipfs: string | null,
}

export default function Userpage(){
    const { publicKey, connected, disconnect, connect } = useWallet();
    const [ isWalletConnected, setIsWalletConnected] = useState(false);
    const [ hasPrompted, setHasPrompted] = useState(false);
    const { setVisible: setModalVisible } = useWalletModal();
    const wallet = useAnchorWallet();
    const { nameProgram } = useNameService();
    const { connection } = useConnection();

    useEffect(() => {
        setIsWalletConnected(connected);
    }, [connection]);

    let account;
    if (publicKey){
        const accountBase58 = publicKey.toBase58();
        account =  accountBase58.slice(0, 5) + '....' + accountBase58.slice(-5);
    }


    const [reviseIpfsModal, setReviseIpfsModal] = useState(false);
    const [revisingDomain, setRevisingDomain] = useState<revisingDomainInfo | null>(null);

    const handleRevise = (domainInfo: revisingDomainInfo) => {
        setRevisingDomain(domainInfo);
        setReviseIpfsModal(true);
    };

    const closeModal = () => {
        setReviseIpfsModal(false);
        setRevisingDomain(null);
    };


    let content;
    if (connected){
        content = 
            <div className="connect">
                <div className="head">
                    <h1 className="acccount">{account}</h1>
                    <h2 className="acccount">aa</h2>
                </div>
                <div className="dashboard">
                    <h1>this is dashboard</h1>
                </div>
                <div className="domain">
                    <DomainBlock ownerKey={publicKey} connection={connection} onRevise={handleRevise}/>
                </div>
            </div>
    }else{
        if(!hasPrompted){
            setModalVisible(true)
            setHasPrompted(true)
        }
        
        content = 
            <div className="disconnect">
                <h1> please connect to your wallet</h1>
            </div>
    }


    const [newIpfsValue, setNewIpfsValue] = useState("");

    const handleReviseIpfs = (usrInfo: revisingDomainInfo) => {
        console.log(usrInfo);
        if(usrInfo.ipfs?.length != 46){
            alert("CID's length should be 46, make sure it's valid");
            return;
        }

        try {
            if (wallet && nameProgram){
                updateIPFS(wallet, nameProgram, usrInfo)
            }
        }catch{
            
        }
    }


    return(
        <div>
            {content}
            {reviseIpfsModal && revisingDomain &&
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modifyTitle">
                        <h1>modify your domain content</h1>
                    </div>
                    <div className="showRevisingName">
                        <p>Editing:</p>
                        <h1>{revisingDomain.name + "." + revisingDomain.root}</h1>
                    </div>
                    <div className="ipfsShow">
                        <h1>current:</h1>
                        <div className="ipfsShowbox">
                            {revisingDomain.ipfs &&
                                <h2>{revisingDomain.ipfs}</h2>
                            }
                            {!revisingDomain.ipfs &&
                                <h2>add an ipfs CID, then you can access it</h2>
                            }
                        </div>
                    </div>
                    <div className="inputBox">
                        {revisingDomain.ipfs &&
                            <h1>new:</h1>
                        }
                        {!revisingDomain.ipfs &&
                            <h1>add:</h1>
                        }
                        <input className="input" type="text" value={newIpfsValue} onChange={(e) => setNewIpfsValue(e.target.value)} placeholder="CID"/>
                    </div>
                    <div className="buttonBox">
                        {revisingDomain.ipfs &&
                            <button className="confrimButton" onClick={() => handleReviseIpfs(
                                {
                                    name: revisingDomain.name,
                                    root: revisingDomain.root,
                                    ipfs: newIpfsValue,
                                }
                            )}>Revise</button>
                        }
                        {!revisingDomain.ipfs &&
                            <button className="confrimButton">Add</button>
                        }
                        <button className="cancleButton" onClick={closeModal}>Cancle</button>
                    </div>
                </div>
            </div>
            }
        </div>
    )

}