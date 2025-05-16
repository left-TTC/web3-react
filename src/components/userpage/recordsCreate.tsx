import { Record } from "@/utils/record/record"
import React, { useEffect, useState } from "react"

import "@/style/components/usr/recordsCreate.css"
import back from "@/assets/previous.png"
import { getHashedName, getNameAccountKey } from "@/utils/search/getNameAccountKey"
import { useRootDomain } from "../rootenvironment/rootenvironmentprovider"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { getDomainRecordKey } from "@/utils/record/getUsrRecord"
import { createRecordsInstruction } from "@/utils/record/createRecords"
import { Transaction } from "@solana/web3.js"
import { CENTRAL_STATE_RECORDS } from "@/utils/constants"


interface recordsCreateProps {
    creatingDomain: string
}



const RecordsCreate: React.FC<recordsCreateProps> = ({ creatingDomain }) => {

    const [recordType, setRecordType] = useState<Record | null>(null)
    const [createContent, setCreateContent] = useState<string>("");
    const [createProcess, setCreateProcess] = useState(0);
    
    const { activeRootDomainPubKey } = useRootDomain()
    const { publicKey: wallet, signTransaction} = useWallet()
    const { connection } = useConnection();

    const turnToLastProcess = () => {
        console.log("now page:", createProcess)
        if(createProcess == 0) return
        setCreateProcess(createProcess - 1)
    }

    const chooseAnRecord = (record: Record) => {
        setRecordType(record)
        setCreateProcess(createProcess + 1)
    }

    const createRecord = async() => {
        if(!recordType || !activeRootDomainPubKey || !wallet || !signTransaction)return;
        const domainKey = getNameAccountKey(
            getHashedName(creatingDomain), null, activeRootDomainPubKey
        )
        console.log("domainkey:", domainKey.toBase58())

        const recordKey = getDomainRecordKey(
            creatingDomain, recordType,  activeRootDomainPubKey
        )
        console.log("recordKey:", recordKey.toBase58())

        console.log("central:", CENTRAL_STATE_RECORDS.toBase58());

        console.log("recode:", recordType);
       
        console.log("recordHash:", getHashedName(recordType));

        const recordCreateInstruction = createRecordsInstruction(
            wallet, recordKey, domainKey, wallet, recordType, createContent
        );

        const transaction = new Transaction().add(recordCreateInstruction);
        const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet;

        const signedTx = await signTransaction(transaction);
        try{
            const txId = await connection.sendRawTransaction(signedTx.serialize());
            console.log("create records success:", txId)
        }catch(err){
            console.log("create record fail:", err)
        }
    }

    const renderStep = () => {
        switch (createProcess) {
            case 0:
                return (
                    <div style={{ display: 'flex', textAlign: 'center', flexDirection: 'column' }}>
                        <h1 style={{ fontSize: '20px' }}>Choose a record</h1>
                        <div className="recordButton">
                            {Object.values(Record).map((item, index) => (
                                <button key={index} className="button-item" onClick={() => chooseAnRecord(item)}>
                                    <h1>{item}</h1>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <button onClick={turnToLastProcess}>
                                <img src={back} style={{ width: '20px' }} />
                            </button>
                            <h1 style={{ marginLeft: '44%', fontSize: '22px', color: 'black', fontWeight: '600' }}>
                                {recordType}
                            </h1>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <input
                                type="text"
                                value={createContent}
                                onChange={(e) => setCreateContent(e.target.value)}
                                placeholder="input content"
                                className="contentInput"
                            />
                            <button className="createButton" onClick={() => createRecord()}>
                                Create
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div>
                        <h1 style={{ fontSize: '32px', color: 'black', fontWeight: '600' }}>ERROR</h1>
                    </div>
                );
        }
    };
    
      

    return(
        <div className="recordsmodal">
            <div className="recordsContent">
                {renderStep()}
            </div>
        </div>
    )
}

export default RecordsCreate