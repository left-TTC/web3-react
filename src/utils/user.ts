import { Connection, PublicKey } from "@solana/web3.js"
import { decodeNameRecordHeader, getHashedName, getSeedAndKey, getUsrRecordAccount, WEB3_NAME_SERVICE_ID } from "./aboutquery"
// import { AccountInfo } from "@solana/web3.js";


export async function findUserInfo(
    userKey: PublicKey,
    nameService: PublicKey,
    root: null | PublicKey,
    connection: Connection){
    
    try{
        const userRecordKey = getUsrRecordAccount(
            nameService, userKey, root
        )
        console.log(userRecordKey.toBase58());
        console.log("finding:", userKey.toBase58());
    
        const accountInfo = await connection.getAccountInfo(userRecordKey);
    
        if(accountInfo){
            console.log("exist")
            return accountInfo;
        }else{
            console.log("not exist");
            return null;
        }
    }catch(err){
        console.log("err happened when quering:", err)
    }
}

export function getUserDomain(
    accountData: Buffer<ArrayBufferLike>, usr: PublicKey){
    const userRecord = decodeRecordHeader(accountData);

    if (userRecord.root = usr.toBase58()){
        console.log(userRecord.domains);
        return userRecord.domains
    }else{
        throw new Error("Invalid")
    }
}


interface RecordHeader {
    root: string,
    domains: string[],
}

export function decodeRecordHeader(data: Uint8Array): RecordHeader{

    const DISCRIMINATOR = 8;   
    const PUBKEY_LENGTH = 32; 
    const VEC_LENGTH_PREFIX = 4; 

    let offset = DISCRIMINATOR;

    const root = new PublicKey(data.slice(offset, offset + PUBKEY_LENGTH)).toBase58();
    offset += PUBKEY_LENGTH;

    const domainsDataLength = new DataView(
        data.slice(offset, offset + VEC_LENGTH_PREFIX).buffer
    ).getUint32(0, true);
    offset += VEC_LENGTH_PREFIX;

    const domainsBytes = data.slice(offset, offset + domainsDataLength);

    const textDecoder = new TextDecoder("utf-8");
    const domainsStr = textDecoder.decode(domainsBytes);
    const domains = domainsStr.split('.').filter(Boolean); 

    return {
        root,
        domains
    };
}

export async function fetchAccountIpfs(
    connection: Connection, domain: string, root: PublicKey){
    
    const {nameAccountKey: queryAccount} = getSeedAndKey(
        WEB3_NAME_SERVICE_ID, getHashedName(domain), null);

    try{
        const accountInfo = await connection.getAccountInfo(queryAccount);
        if (accountInfo){
            const decode =  decodeNameRecordHeader(accountInfo.data);
            if (decode.owner = root.toBase58()){
                return decode.ipfs;
            }else{
                throw new Error("invallid owner");
            }
        }else{
            throw new Error("can't get accountinfo");
        }
    }catch{

    }
}
