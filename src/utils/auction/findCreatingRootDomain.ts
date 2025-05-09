import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { CENTRAL_STATE_AUCTION, CREATE_ROOT_FEE, WEB3_AUCTION_ID } from "../constants";
import { AuctionRecord } from "./auctionRecord";
import { Numberu64 } from "@bonfida/spl-name-service";
import { getAuctionRecordKey, getHashedName, getNameAccountKey } from "../search/getNameAccountKey";
import { createRootInstruction } from "./createRootDomainInstruction";

export class AuctionKey {
    key: PublicKey;
    name: string;
    state: Numberu64;

    constructor(accountKey: PublicKey, name: string, state: Numberu64){
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
                const rootNameAccount = getNameAccountKey(
                    getHashedName(this.info.name), null, null,
                );
                const rootReverseLookup = getNameAccountKey(
                    getHashedName(rootNameAccount.toBase58()), CENTRAL_STATE_AUCTION, null,
                )

                return createRootInstruction(
                    rootRecordAccount,
                    usrKey,
                    rootNameAccount,
                    rootReverseLookup,
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
    let returnArr: AuctionKey[] = [];
    
    const allRecordAccounts = await AuctionRecord.retrieveBatch(connection, accounts);

    let cretingRootAccount: AuctionKey[] = [];
    if(allRecordAccounts){
        for (const record of allRecordAccounts){
            if (record && record.amount < CREATE_ROOT_FEE){
                const OK = new AuctionKey(record.rootNameKey, record.name, record.amount)
                cretingRootAccount.push(OK)
            }
        }
    }

    return returnArr
}