import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from 'react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import "@/style/pages/user.css"
import { findUserInfo } from "@/utils/user";
import { useNameService } from "@/components/program/name-service-provider";
import DomainBlock from "@/components/userpage/domiansshow";

export default function Userpage(){
    const { publicKey, connected, disconnect, connect } = useWallet();
    const [ isWalletConnected, setIsWalletConnected] = useState(false);
    const [ hasPrompted, setHasPrompted] = useState(false);
    const { setVisible: setModalVisible } = useWalletModal();
    const { nameProgram } = useNameService();
    const { connection } = useConnection();

    useEffect(() => {
        setIsWalletConnected(connected);
    }, [connected]);

    let account;
    if (publicKey){
        const accountBase58 = publicKey.toBase58();
        account =  accountBase58.slice(0, 5) + '....' + accountBase58.slice(-5);
    }

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
                    <DomainBlock ownerKey={publicKey} connection={connection} />
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

    return(
        <div>
            {content}
        </div>
    )

}