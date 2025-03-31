import "../../style/components/domainIntroduce.css";
import star from "../../assets/star.svg"
import { calculateDomainPrice, getSeedAndKey, WEB3_NAME_SERVICE_ID } from "@/utils/aboutquery";
import { Buffer } from "buffer";
import { AccountInfo, Keypair} from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getHashedName } from "@/utils/aboutquery"
import { useAnchorWallet, useWallet,  } from '@solana/wallet-adapter-react'
import { useNameService } from "../program/name-service-provider";
import { useWalletModal } from "@solana/wallet-adapter-react-ui"



interface introduceProps {
    domainName: string;
    domainInfo: AccountInfo<Buffer> | null;
}

const Showdomain: React.FC<introduceProps> = ({ domainName, domainInfo }) => {
    // Define local variables for left and right content
    let leftContent;
    let rightContent;

    // Get price and get a complete domain name
    const price = calculateDomainPrice(domainName);
    const showDomainName = completeName(domainName);

    // Get values from context
    const { nameProgram } = useNameService();
    const wallet = useAnchorWallet();
    const { connected } = useWallet()
    const { setVisible: setModalVisible } = useWalletModal()

    // Prepare domain class and other necessary values
    const hashedNameUint8 = getHashedName(domainName);
    const hashedName = Buffer.from(hashedNameUint8);

    const { nameAccountKey } = getSeedAndKey(
        WEB3_NAME_SERVICE_ID, hashedNameUint8, null
    );

    // Function to create a domain (triggered on button click)
    const createNameTest = async () => {
        //try to reconnect wallet
        if (!connected) {
            try {
                console.log('Wallet successfully connected')
                setModalVisible(true)
            } catch (err) {
                console.error('Failed to connect wallet:', err)
            }
        }

        if (nameProgram && wallet) {
            console.log(nameAccountKey.toBase58());
            console.log("payer:", wallet.publicKey.toBase58());

            // Define lamports and space for the domain
            const lamports = new BN(10000000);
            const space = 0; 
            const owner = wallet.publicKey;

            const {nameAccountKey: recordAccountKey} = getSeedAndKey(
                nameProgram.programId, getHashedName(owner.toBase58()), null
            )

            const ipfsHash = "QmPu4ZT2zPfyVY8CA2YBzqo9HfAV79nDuuf177tMrQK1py";
            const ipfsBytes = Buffer.from(ipfsHash, 'utf-8');

            const baseData = {
                lamports: lamports,
                name: domainName,
                space: space,
                owner: owner,
                ipfs: ipfsBytes,
            }

            try {
                const tx = await nameProgram.methods
                    .create(baseData)
                    .accounts({
                        nameAccount: nameAccountKey,
                        recordAccount: recordAccountKey,
                        payer: wallet.publicKey,
                        rootDomainOpt: null,
                    })
                    .rpc();
                console.log('Transaction successful:', tx);
            } catch (err) {
                console.error('Error creating name:', err);
            }
        } else {
            console.log("Wallet not connected or nameProgram not available");
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
                <h2>{showDomainName}</h2>
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

function completeName(domain: string){
    if(domain.includes(".")){
        return domain
    }else{
        return (domain + ".web3")
    }
}
