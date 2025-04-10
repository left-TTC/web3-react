import { Auction } from "@/components/program/anchor/auction/idl";
import { Web3NameService } from "@/components/program/anchor/nameService/idl";
import { BN, Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getHashedName, getSeedAndKey } from "./aboutquery";


export interface createRootInfo{
    raisedAmount: number,
    creatingKey: PublicKey,
    target: number,
}


export async function checkAuctionAccountLists(programId: PublicKey, connection: Connection){
    const SEED = Buffer.from("unique web3 auction account list");

    const [crowdingAccountPubkey, bump] = await PublicKey.findProgramAddressSync(
        [SEED],
        programId,
    );

    const accountInfo = await connection.getAccountInfo(crowdingAccountPubkey);

    try{
        if (accountInfo){
            const data= decodeAuctionList(accountInfo.data);
            return data;
        }else{
            throw new Error("can't find auction record list");
        }
    }catch(err){
        console.log(err)
    }
}

export function decodeAuctionList(data: Buffer<ArrayBufferLike>){
    const actualData = data.slice(8+4); 

    const datastr = new TextDecoder().decode(actualData);

    const parsedData = datastr.split('.').filter(item => item !== "");

    console.log('Parsed data:', parsedData);
    console.log('length:', parsedData.length);

    return parsedData;
}

export function decodeFundingRootData(data: Buffer<ArrayBufferLike>){

    if (data.length < 56) {
        throw new Error('Invalid data length');
    }

    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    let offset = 8; 

    const raisedAmount = Number(view.getBigUint64(offset, true));
    offset += 8;

    const fundingRoot = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;

    const target = Number(view.getBigUint64(offset, true));

    let re: createRootInfo = {
        raisedAmount: raisedAmount,
        creatingKey: fundingRoot,
        target: target,
    };
    return re;
}


export async function createRootAccount(
    root: string, 
    auction: Program<Auction> | null, 
    wallet: AnchorWallet | undefined, 
    nameService: Program<Web3NameService> | null,
    initBalance: number,){

    if (auction && wallet && nameService){
        const {nameAccountKey: willCreateRootAcount} = getSeedAndKey(
            nameService.programId, getHashedName(root), null);
    
        const {nameAccountKey: auctionRecordAccount} = getSeedAndKey(
            nameService.programId, getHashedName(auction.programId.toBase58()), null);
    
        const data = {
            rootName: root,
            paidFees: new BN(initBalance)
        }
    
        try{
            const tx = await auction.methods
                .checkFundingAccount(data)
                .accounts({
                    willCreateRoot: willCreateRootAcount,
                    caller: wallet.publicKey,
                    allRootRecordAccount: auctionRecordAccount,
                })
                .rpc()
                console.log('Transaction successful:', tx);
        }catch(err){
            console.error('Error creating name:', err);
        }
    }
}