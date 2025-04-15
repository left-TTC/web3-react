import { Auction } from "@/components/program/anchor/auction/idl";
import { Web3NameService } from "@/components/program/anchor/nameService/idl";
import { BN, Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getHashedName, getSeedAndKey, getUsrRecordAccount } from "./aboutquery";


export interface createRootInfo{
    raisedAmount: number,
    creatingKey: PublicKey,
    target: number,
}

export async function checkAuctionAccountLists(programId: PublicKey, connection: Connection){
    const SEED = Buffer.from("web3 auction account list");

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

export async function checkFundingStateAccount(
    programId: PublicKey, rootDomainPda: PublicKey){
    
    const seeds = [
        Buffer.from("web3 Auction"),
        rootDomainPda.toBuffer(),
    ];

    try{
        const [address, _] = await PublicKey.findProgramAddressSync(seeds, programId);

        return address
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
    nameService: Program<Web3NameService> | null){

    if (auction && wallet && nameService){
        const {nameAccountKey: willCreateRootAcount} = getSeedAndKey(
            nameService.programId, getHashedName(root), null);

        console.log("auction id:", auction.programId.toBase58())
    
        try{
            const tx = await auction.methods
                .createFunding(root)
                .accounts({
                    willCreateRoot: willCreateRootAcount,
                    caller: wallet.publicKey,
                })
                .rpc()
                console.log('Transaction successful:', tx);
        }catch(err){
            console.error('Error creating name:', err);
        }
    }
}

export async function addFundingAmount(
    auction: Program<Auction> | null, 
    wallet: AnchorWallet | undefined, 
    nameService: Program<Web3NameService> | null,
    willAddAmount: number,
    addingRootName: string,
){
    if (auction && wallet && nameService){

        const addAmount = new BN(willAddAmount);

        const {nameAccountKey: willCreateRootPda} = getSeedAndKey(
            nameService.programId, getHashedName(addingRootName), null
        )
        console.log("will create pda:", willCreateRootPda.toBase58());

        const allRootRecordPda = getUsrRecordAccount(
            nameService.programId, auction.programId, null
        )
        console.log("will create record pda:", allRootRecordPda.toBase58());

        const {nameAccountKey: ifroot} = getSeedAndKey(
            nameService.programId, getHashedName(auction.programId.toBase58()), null
        )
        console.log("if record pda:", ifroot.toBase58());

        console.log("web3 name service:", nameService.programId.toBase58())

        const rootFundStateAccount = await checkFundingStateAccount(auction.programId, willCreateRootPda);

        if(rootFundStateAccount){
            try{
                const addTx = await auction.methods
                    .addFunding(addAmount, addingRootName)
                    .accounts({
                        willCreateRoot: willCreateRootPda,
                        allRootRecordAccount: allRootRecordPda,
                        payer: wallet.publicKey,
                    })
                    .remainingAccounts([
                        {
                            pubkey: allRootRecordPda,
                            isSigner: false,
                            isWritable: true,
                        }
                    ])
                    .rpc()

                console.log('Transaction successful:', addTx);

                return addTx;
                
            }catch(err){
                console.log('Transaction fail:', err);
            }
        }else{
            throw new Error("no this account");
        }
    }
}