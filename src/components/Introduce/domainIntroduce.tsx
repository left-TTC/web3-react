import "../../style/components/domainIntroduce.css";
import star from "../../assets/star.svg"
import { Buffer } from "buffer";
import { AccountInfo, PublicKey, Transaction} from "@solana/web3.js";
import { useConnection, useWallet,  } from '@solana/wallet-adapter-react'
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { calculateDomainPrice, createDomainInstruction } from "@/utils/register/createDomainInstruction";
import { useEffect, useState } from "react";
import { getHashedName, getNameAccountKey } from "@/utils/search/getNameAccountKey";
import { useRootDomain } from "../rootenvironment/rootenvironmentprovider";
import { Numberu32 } from "@bonfida/spl-name-service";
import { CENTRAL_STATE_REGISTER } from "@/utils/constants";



interface introduceProps {
    domainName: string;
    domainInfo: AccountInfo<Buffer> | null;
}

export interface nameCreate {
    name: string;
    root: PublicKey;
    hasedName: Buffer; 
    ipfs: number[] | null;
    owner: PublicKey;
}

const Showdomain: React.FC<introduceProps> = ({ domainName, domainInfo }) => {
    // Define local variables for left and right content
    let leftContent;
    let rightContent;

    const { publicKey: wallet, signTransaction, connected} = useWallet();
    const { setVisible: setModalVisible } = useWalletModal();
    const { activeRootDomain, activeRootDomainPubKey, rootDomains, rootDomainsPubKey} = useRootDomain();
    const { connection } = useConnection();

    const [price, setPrice] = useState("calculating");

    useEffect(() => {
        const fetchPrice = async() => {
            const thePrice = await calculateDomainPrice();
            setPrice(thePrice.toString())
        };

        fetchPrice();
    }, [domainName])

    const domainArray = handleQueryDomain(domainName);
    // Prepare domain class and other necessary values
    const hashedName = getHashedName(domainArray[0]);
    // const hashedName = Buffer.from(hashedNameUint8);
    let rootOpt;
    console.log("domain:", domainArray[0])
    console.log("root:", domainArray[1]);
    if(domainArray[1] == activeRootDomain){
        rootOpt = activeRootDomainPubKey;
    }else{
        if (rootDomains.includes(domainArray[1])){
            rootOpt = getNameAccountKey(getHashedName(domainArray[1]), null, null);
            if (!rootDomainsPubKey.includes(rootOpt)){
                throw new Error("no this root name")
            }
        }else{
            throw new Error("no this root domain")
        }
    }

    if(!rootOpt)return;

    const nameAccountKey = getNameAccountKey(
        hashedName, null, rootOpt
    )

    console.log("nameaccount:", nameAccountKey.toBase58())

    const reverseLookup = getNameAccountKey(
        getHashedName(nameAccountKey.toBase58()), CENTRAL_STATE_REGISTER, null
    )

    // Function to create a domain (triggered on button click)
    const createNameTest = async () => {

        if (!connected) {
            try {
                console.log('Wallet successfully connected')
                setModalVisible(true)
            } catch (err) {
                console.error('Failed to connect wallet:', err)
            }
        }

        if(!wallet || !signTransaction)return;

        console.log("root:", rootOpt.toBase58())
        console.log("list:", rootDomainsPubKey[0].toBase58())

        //test
        const space = new Numberu32(1024);
        const createTx = createDomainInstruction(
            rootOpt, 
            nameAccountKey, 
            reverseLookup, 
            CENTRAL_STATE_REGISTER, 
            wallet, 
            wallet, 
            wallet,
            null,
            domainArray[0],
            space
        );
        const transaction = new Transaction().add(createTx);
        const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet;

        const signedTx = await signTransaction(transaction);

        try{
            const TX = await connection.sendRawTransaction(signedTx.serialize());
            console.log("success:", TX)
        }catch(err){
            console.log("fail:", err)
        }
    };

    // Conditional rendering based on domainInfo
    if (domainInfo === null) {
        leftContent = (
            <div className="RightBox">
                <div className="okBox">
                    <div className="avaBox">
                        <h1>Available domain</h1>
                    </div>
                    <button className="starBox">
                        <img src={star} width="20" alt="star" />
                    </button>
                </div>
                <h2>{domainName}</h2>
                <h3>{price} USDC</h3>
                <div className="buyBox">
                    <button className="dir" onClick={createNameTest}>
                        <h1>Buy Now</h1>
                    </button>
                    <button className="wait">
                        <h1>Add to Cart</h1>
                    </button>
                </div>
            </div>
        );

        rightContent = <div className="LeftBox"></div>;
    } else {
        leftContent = <div className="RightBox"></div>;
        rightContent = <div className="LeftBox"></div>;
    }

    return (
        <div className="domainShowShell">
            {leftContent}
            {rightContent}
        </div>
    );
};

export default Showdomain;

function handleQueryDomain(input: string){
    const rawDomain = input;

    if (rawDomain.includes(".")){
        const [part1, part2] = rawDomain.split(".");
        return [part1,part2]
    }else{
        const defaultClass = "web3";
        return [rawDomain, defaultClass]
    }
}
