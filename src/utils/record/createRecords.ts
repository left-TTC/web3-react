import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { Record } from "./record";
import { Numberu32 } from "@bonfida/spl-name-service";
import { CENTRAL_STATE_RECORDS, WEB3_NAME_SERVICE_ID, WEB3_RECORDS_ID } from "../constants";

export enum RecordsTypes {
    AllocateRecord,
    AllocateAndPostRecord,
    EditRecord,
    ValidateSolanaSignature,
    ValidateEthereumSignature,
    DeleteRecord,
    WriteRoa,
    UnverifyRoa,
}

export function createRecordsInstruction(
    feePayer: PublicKey,
    recordKey: PublicKey,
    domainKey: PublicKey,
    domainOwner: PublicKey,
    record: Record,
    content: string,
): TransactionInstruction {
        const buffers = [
            Buffer.from(Uint8Array.from([RecordsTypes.AllocateAndPostRecord])),
            new Numberu32(Buffer.from(record).length).toBuffer(),
            Buffer.from(record, 'utf-8'),
            new Numberu32(Buffer.from(content).length).toBuffer(),
            Buffer.from(content, 'utf-8')
        ];

    const data = Buffer.concat(buffers)

    const keys = [
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: WEB3_NAME_SERVICE_ID, isSigner: false, isWritable: false },
        { pubkey: feePayer, isSigner: true, isWritable: true },
        { pubkey: recordKey, isSigner: false, isWritable: true },
        { pubkey: domainKey, isSigner: false, isWritable: true },
        { pubkey: domainOwner, isSigner: true, isWritable: true },
        { pubkey: CENTRAL_STATE_RECORDS, isSigner: false, isWritable: false },
    ];

    return new TransactionInstruction({
        programId: WEB3_RECORDS_ID,
        keys,
        data,
    })
}