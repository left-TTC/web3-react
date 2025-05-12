import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from 'react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import "@/style/pages/user.css"
import { useRootDomain } from "@/components/rootenvironment/rootenvironmentprovider";
import { getUsrAllDomainsByRoot } from "@/utils/search/getAllDomains";
import { FindType, getMultipleReverseLookup } from "@/utils/search/reverseLookup";
import AccountInfo from "@/components/userpage/accountInfo";
import DomainManage from "@/components/userpage/domainManage";


export default function Userpage(){
    const { publicKey: wallet, connected, signTransaction} = useWallet();
    const { connection } = useConnection();
    const { activeRootDomain, activeRootDomainPubKey } = useRootDomain()


    const [ isWalletConnected, setIsWalletConnected] = useState(false);
    const [ usrDomain, setUsrDomain ] = useState<string[]>([]);

    useEffect(() => {
        if (wallet){
            setIsWalletConnected(true);
        }
    }, [wallet])

    useEffect(() => {
        const fetchUsrDomain = async() => {
            if (!wallet || ! activeRootDomainPubKey)return;
            const usrDomainKeys = await getUsrAllDomainsByRoot(
                connection, wallet, activeRootDomainPubKey
            );

            const domainsString =  await getMultipleReverseLookup(
                connection, usrDomainKeys, FindType.Common, null
            )

            console.log(domainsString)
            
            if(domainsString){
                setUsrDomain(domainsString)
            }else{
                setUsrDomain([])
            }

            console.log("find:", domainsString)
        } 

        fetchUsrDomain()
    }, [activeRootDomainPubKey])


    return(
        <div className="toptab">
            <AccountInfo wallet={wallet} />
            <h1 style={{
                fontSize: '26px',
                marginTop: '30px',
                fontWeight: '700',
                color: 'white'}}>Checking Domain: {activeRootDomain}</h1>
            <DomainManage usrDomain={usrDomain} activeRootDomainkey={activeRootDomainPubKey}  />
        </div>
    )

}