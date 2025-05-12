import { Numberu64 } from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";
import { deserialize, serialize } from "borsh";


interface DeserializedAuctionRecord {
    rootNameKey: Uint8Array;
    amount: bigint;
    name: Uint8Array;
}

export class AuctionRecord {
    static HEADER_LEN = 40; // 32 bytes for PublicKey + 8 bytes for u64

    rootNameKey: PublicKey;
    amount: number;
    name: string;

    static schema = {
        struct: {
            rootNameKey: {
                array: {
                    type: "u8",
                    len: 32,
                },
            },
            amount: "u64",
            name: { 
                array: {
                    type: "u8",
                    len: 32,
                },
            },
        }
    };

    constructor(obj: { 
        rootNameKey: Uint8Array; 
        amount: bigint | number;
        name: string;
    }) {
        this.rootNameKey = new PublicKey(obj.rootNameKey);
        this.amount = obj.amount as number;
        this.name = obj.name;
    }

    static deserialize(data: Buffer): AuctionRecord {
        if (data.length < AuctionRecord.HEADER_LEN) {
            throw new Error(`Data too short, expected at least ${AuctionRecord.HEADER_LEN} bytes`);
        }

        const { rootNameKey, amount, name } = deserialize(
            AuctionRecord.schema,
            data
        ) as DeserializedAuctionRecord;

        console.log("name data:", name)

        const buffer = Buffer.from(name); 
        const vecLength = buffer.readUInt32LE(0); 
        const nameBuffer = buffer.slice(4, 4 + vecLength);
        const nameStr = nameBuffer.toString("utf-8").replace(/\0+$/, '');

        return new AuctionRecord({
            rootNameKey,
            amount,
            name: nameStr
        });
    }

    static async retrieve(
        connection: Connection,
        recordAccountKey: PublicKey,
    ): Promise<AuctionRecord> {
        const info = await connection.getAccountInfo(recordAccountKey);
        if (!info?.data) {
            throw new Error(`The record account does not exist or has no data`);
        }
        
        return AuctionRecord.deserialize(info.data);
    }

    static async retrieveBatch(
        connection: Connection,
        recordAccountKeys: PublicKey[],
    ): Promise<(AuctionRecord | null)[]> {
        const accounts = await connection.getMultipleAccountsInfo(recordAccountKeys);
        return accounts.map(account => {
            try {
                return account?.data ? AuctionRecord.deserialize(account.data) : null;
            } catch (error) {
                console.error('Failed to deserialize account:', error);
                return null;
            }
        });
    }

    serialize(): Buffer {
        const nameBuffer = Buffer.alloc(32, 0);
        Buffer.from(this.name, 'utf-8').copy(nameBuffer);

        const serializedData = serialize(AuctionRecord.schema, {
            rootNameKey: this.rootNameKey.toBytes(),
            amount: new Numberu64(this.amount).toBuffer(),
            name: nameBuffer
        });
    
        return Buffer.from(serializedData);
    }

}