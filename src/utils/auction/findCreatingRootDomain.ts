import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { CENTRAL_STATE_AUCTION, CENTRAL_STATE_REGISTER, CREATE_ROOT_FEE, WEB3_AUCTION_ID } from "../constants";
import { AuctionRecord } from "./auctionRecord";
import { Numberu64 } from "@bonfida/spl-name-service";
import { getAuctionRecordKey, getHashedName, getNameAccountKey } from "../search/getNameAccountKey";
import { createRootInstruction } from "./createRootDomainInstruction";

export class AuctionKey {
    key: PublicKey;
    name: string;
    state: number;

    constructor(accountKey: PublicKey, name: string, state: number){
        this.key = accountKey;
        this.name = name;
        this.state = state;
    }
}

export interface creatingRoot {
    info: AuctionKey,
    addAmount: (addAmount: number, usrKey: PublicKey) => TransactionInstruction | undefined,
}

export async function findCreatingRootDomains(
    connection: Connection
): Promise<creatingRoot[]> {
    const accounts = await connection.getProgramAccounts(WEB3_AUCTION_ID, {
        dataSlice: { offset: 0, length: 0},
        filters: [
            { dataSize: 72 } 
        ]
    });

    const createdAccounts =  accounts.map((a) => a.pubkey)

    const creatingAuctionKeys = await getCreatingInfos(createdAccounts, connection);

    return creatingAuctionKeys.map((auctionRecord) => ({
        info: auctionRecord,
        addAmount: function(addAmount: number, usrKey: PublicKey){
            try{
                const rootRecordAccount = getAuctionRecordKey(
                    getHashedName(this.info.name), null, null,
                );
                console.log("record:", rootRecordAccount.toBase58())
                const rootNameAccount = getNameAccountKey(
                    getHashedName(this.info.name), null, null,
                );
                console.log("rootName:", rootNameAccount.toBase58())
                const rootReverseLookup = getNameAccountKey(
                    getHashedName(rootNameAccount.toBase58()), CENTRAL_STATE_AUCTION, null,
                )
                console.log("centarl is:", CENTRAL_STATE_AUCTION.toBase58())
                console.log("rootReverse:", rootReverseLookup.toBase58())

                const createFeeSaverAccount = getAuctionRecordKey(
                    getHashedName(this.info.name), CENTRAL_STATE_AUCTION, CENTRAL_STATE_AUCTION
                );
                console.log("fee_saver:", createFeeSaverAccount.toBase58());

                return createRootInstruction(
                    rootRecordAccount,
                    usrKey,
                    rootNameAccount,
                    rootReverseLookup,
                    createFeeSaverAccount,
                    addAmount,
                    this.info.name
                )
            }catch(err){
                console.log(err)
            }
            console.log("add sucessfully")
        }
    }))
}

export async function getCreatingInfos(
    accounts: PublicKey[],
    connection: Connection,
): Promise<AuctionKey[]> {
    
    const allRecordAccounts = await AuctionRecord.retrieveBatch(connection, accounts);

    let cretingRootAccount: AuctionKey[] = [];
    if(allRecordAccounts){
        for (const record of allRecordAccounts){
            console.log("amount:", record?.amount)
            console.log("fee:", (CREATE_ROOT_FEE as any))
            if (record && record.amount <= CREATE_ROOT_FEE){
                console.log("name:", record.name)
                const OK = new AuctionKey(record.rootNameKey, record.name, record.amount)
                cretingRootAccount.push(OK)
            }
        }
    }

    return cretingRootAccount
}