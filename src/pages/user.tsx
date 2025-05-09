import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from 'react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import "@/style/pages/user.css"
// import { findUserInfo } from "@/utils/user";
import DomainBlock from "@/components/userpage/domiansshow";
import { updateIPFS } from "@/utils/updatedomain";

export interface revisingDomainInfo{
    name: string,
    root: string,
    ipfs: string | null,
}

export default function Userpage(){
    // const { publicKey, connected} = useWallet();
    // const [ isWalletConnected, setIsWalletConnected] = useState(false);
    const [ hasPrompted, setHasPrompted] = useState(false);
    const { setVisible: setModalVisible } = useWalletModal();
    const { connection } = useConnection();

    


    return(
        <div>
            
        </div>
    )

}