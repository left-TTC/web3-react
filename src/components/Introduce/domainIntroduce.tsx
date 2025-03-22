import "../../style/components/domainIntroduce.css";
import star from "../../assets/star.svg"
import { calculateDomainPrice, getSeedAndKey, WEB3_NAME_SERVICE_ID } from "@/utils/aboutquery";
import { Buffer } from "buffer";
import { AccountInfo, Keypair, PublicKey, SystemProgram} from "@solana/web3.js";
import { BN, Program, AnchorProvider,  } from "@coral-xyz/anchor";
import { getHashedName } from "@/utils/aboutquery"
import { useConnection, useWallet, Wallet, useAnchorWallet,   } from '@solana/wallet-adapter-react'
import { Web3NameService } from "../../anchor/nameService/idl";
import idl from "../../anchor/nameService/IDL.json"
import { useCluster } from "../cluster/cluster-data-access";


import testClassKeyPair from "/home/f/wallet/captain-solana-wallet.json";
import testPayerKeypair from "/home/f/wallet/left-solana-wallet.json";

import * as anchor from "@coral-xyz/anchor";



interface introduceProps {
    domainName: string;
    domainInfo: AccountInfo<Buffer> | null;
}

const Showdomain: React.FC<introduceProps> = ({ domainName, domainInfo }) => {
    let leftContent;
    let rightContent;

    //get info form context

    const price = calculateDomainPrice(domainName);
    const showDomainName = completeName(domainName);
    const anchorWallet = useAnchorWallet();
    const {connection} = useConnection();
    const cluster = useCluster();
    
      
    

    const createNameTest = async() => {
        if(anchorWallet != undefined){
            
            if (anchorWallet){
                const provider = new AnchorProvider(
                    connection,
                    anchorWallet,
                    { commitment: 'confirmed' }
                  );
                const program: anchor.Program<Web3NameService> = new anchor.Program(idl, provider);
                const secretKey = Uint8Array.from(testClassKeyPair)
                const domainClass = Keypair.fromSecretKey(secretKey);
                console.log("domainClass:", domainClass.publicKey.toBase58())
                const hashedNameUint8 = getHashedName(domainName)
                const hashedName = Buffer.from(hashedNameUint8);
                const {nameAccountKey} = getSeedAndKey(
                    WEB3_NAME_SERVICE_ID, hashedNameUint8, domainClass.publicKey, null)
                console.log(cluster)
                console.log(nameAccountKey.toBase58())
                console.log("payer:", anchorWallet.publicKey.toBase58())

                const lamports = new BN(10000000); 
                const space = 500; 
                const owner = anchorWallet.publicKey;
                const baseData = {
                    lamports: lamports,
                    hashedName: hashedName,
                    space: space,
                    owner: owner,
                    ipfs: null,
                };
                if (program != null){
                    try{
                    const tx = await program.methods
                    .create(baseData)
                    .accounts({
                        nameAccount: nameAccountKey,
                        payer: anchorWallet.publicKey,
                        domainClass: domainClass.publicKey,
                        rootDomainOpt: undefined,
                    })
                    .signers([domainClass])
                    .rpc()
                    }catch(err){
                        console.log(err)
                    }
                }
                    }

                
                };
    }

    //means domain is available
    if (domainInfo === null){
        leftContent = 
            <div className="RightBox">
                <div className="okBox">
                    <div className="avaBox">
                        <h1>Available domain</h1>
                    </div>
                    <button className="starBox">
                        <img src={star} width="20"/>
                    </button>
                </div>
                <h2>{showDomainName}</h2>
                <h3>{price} USDC</h3>
                <div className="buyBox">
                    <button className="dir" onClick={createNameTest}>
                        <h1>buy now</h1>
                    </button>
                    <button className="wait">
                        <h1>add to cart</h1>
                    </button>
                </div>
            </div>
        rightContent = 
            <div className="LeftBox">

            </div>
    }else{
        leftContent = 
            <div className="RightBox">

            </div>
        rightContent = 
            <div className="LeftBox">

            </div>
    }


    return(
        <div className="domainShowShell">
            {leftContent}
            {rightContent}
        </div>
    )
}

export default Showdomain;

function completeName(domain: string){
    if(domain.includes(".")){
        return domain
    }else{
        return (domain + ".web3")
    }
}

export const useSolanaProgram = () => {
    
}