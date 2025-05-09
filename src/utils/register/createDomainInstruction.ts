import { Numberu32 } from "@bonfida/spl-name-service";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from "@solana/web3.js";
import { RegisterInstruction } from "./instruction";
import { VAULT, WEB3_NAME_SERVICE_ID, WEB3_REGISTER_ID } from "../constants";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";




export async function calculateDomainPrice(
    
){
    return 20;
}


export function createDomainInstruction(
    rootAccount: PublicKey,
    nameAccount: PublicKey,
    reverseLookup: PublicKey,
    centralState: PublicKey,
    buyer: PublicKey,
    domainOwner: PublicKey,
    feePayer: PublicKey,
    referrerAccountOpt: PublicKey | null,
    name: string,
    space: Numberu32
): TransactionInstruction {
    const buffers = [
        Buffer.from(Uint8Array.from([RegisterInstruction.Create])),
        new Numberu32(Buffer.from(name).length).toBuffer(),
        Buffer.from(name, 'utf8'),
        space.toBuffer(),
        //referrer_idx_opt
        Buffer.from([0]),
    ];

    const data = Buffer.concat(buffers)

    const keys = [
        { pubkey: WEB3_NAME_SERVICE_ID, isSigner: false, isWritable: false },
        { pubkey: rootAccount, isSigner: false, isWritable: false },
        { pubkey: nameAccount, isSigner: false, isWritable: true },
        { pubkey: reverseLookup, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: centralState, isSigner: false, isWritable: false },

        { pubkey: buyer, isSigner: true, isWritable: true },
        { pubkey: domainOwner, isSigner: false, isWritable: false },
        { pubkey: feePayer, isSigner: true, isWritable: true },

        { pubkey: PublicKey.default, isSigner: false, isWritable: true },
        { pubkey: PublicKey.default, isSigner: false, isWritable: false },
        { pubkey: VAULT, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: PublicKey.default, isSigner: false, isWritable: false },
      ];

    if (referrerAccountOpt) {
        keys.push({
            pubkey: referrerAccountOpt,
            isSigner: false,
            isWritable: true,
        });
    } else {
        keys.push({
            pubkey: PublicKey.default,
            isSigner: false,
            isWritable: false,
        });
    }
    
        // 4. 创建指令
        return new TransactionInstruction({
        programId: WEB3_REGISTER_ID,
        keys,
        data,
    });
}










