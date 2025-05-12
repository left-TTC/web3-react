import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from "@solana/web3.js";
import { AuctionInstruction } from "./instruction";
import { Numberu32, Numberu64 } from "@bonfida/spl-name-service";
import { CENTRAL_STATE_AUCTION, CENTRAL_STATE_REGISTER, VAULT, WEB3_AUCTION_ID, WEB3_NAME_SERVICE_ID } from "../constants";





export function createRootFundInstruction(
    rootRecordAccount: PublicKey,
    feePayer: PublicKey, 
    createFeeSaverAccount: PublicKey,
    rootName: string,
): TransactionInstruction {
    const buffers = [
        Buffer.from(Uint8Array.from([AuctionInstruction.CreateRoot])),
        new Numberu32(Buffer.from(rootName).length).toBuffer(),
        Buffer.from(rootName, 'utf-8'),
    ];

    const data = Buffer.concat(buffers)

    const keys = [
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: VAULT, isSigner: false, isWritable: true },
        { pubkey: rootRecordAccount, isSigner: false, isWritable: true },

        { pubkey: feePayer, isSigner: true, isWritable: true },
        { pubkey: createFeeSaverAccount, isSigner: false, isWritable: true },
    ];

    return new TransactionInstruction({
        programId: WEB3_AUCTION_ID,
        keys,
        data,
    })
}


export function createRootInstruction(
    rootRecordAccount: PublicKey,
    feePayer: PublicKey,
    rootNameAccount: PublicKey,
    rootReverseLookup: PublicKey,
    createFeeSaverAccount: PublicKey,
    addAmount: number,
    rootName: string,
): TransactionInstruction {
    const buffers = [
        Buffer.from(Uint8Array.from([AuctionInstruction.DonateRoot])),
        new Numberu32(Buffer.from(rootName).length).toBuffer(),
        Buffer.from(rootName, 'utf-8'),
        new Numberu64(addAmount).toBuffer(),
    ];

    const data = Buffer.concat(buffers)

    const keys = [
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: VAULT, isSigner: false, isWritable: true },
        { pubkey: rootRecordAccount, isSigner: false, isWritable: true },
        { pubkey: feePayer, isSigner: true, isWritable: true },
        { pubkey: WEB3_NAME_SERVICE_ID, isSigner: false, isWritable: false },
        { pubkey: CENTRAL_STATE_REGISTER, isSigner: false, isWritable: false },
        { pubkey: rootNameAccount, isSigner: false, isWritable: true },
        { pubkey: rootReverseLookup, isSigner: false, isWritable: true },
        { pubkey: CENTRAL_STATE_AUCTION, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: createFeeSaverAccount, isSigner: false, isWritable: true },
    ];

    return new TransactionInstruction({
        programId: WEB3_AUCTION_ID,
        keys,
        data,
    })
}