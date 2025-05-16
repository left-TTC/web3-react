import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from 'react';

import "@/style/pages/user.css"

import { useRootDomain } from "@/components/rootenvironment/rootenvironmentprovider";
import { getUsrAllDomainsByRoot } from "@/utils/search/getAllDomains";
import { FindType, getMultipleReverseLookup } from "@/utils/search/reverseLookup";
import AccountInfo from "@/components/userpage/accountInfo";
import DomainManage from "@/components/userpage/domainManage";
import RecordsCreate from "@/components/userpage/recordsCreate";


export default function Userpage(){
    const { publicKey: wallet} = useWallet();
    const { connection } = useConnection();
    const { activeRootDomain, activeRootDomainPubKey } = useRootDomain()


    const [addRecordModal, setAddRecordModal] = useState(false);
    const [recordingDomain, setRecordingDomain] = useState("");
    const [usrDomain, setUsrDomain] = useState<string[]>([]);

    const addRecords = (domain: string) => {
        console.log("click to create records")
        setAddRecordModal(true)
        setRecordingDomain(domain)
    }

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
            <DomainManage usrDomain={usrDomain} activeRootDomainkey={activeRootDomainPubKey} clickOpenRecordsModal={(domain: string) => addRecords(domain)} />
            {addRecordModal && 
            <RecordsCreate creatingDomain={recordingDomain} />
            }
        </div>
    )

}