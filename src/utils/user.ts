import { Connection, PublicKey } from "@solana/web3.js"
import { decodeNameRecordHeader, DEVNET_URL, getHashedName, getSeedAndKey, WEB3_NAME_SERVICE_ID } from "./aboutquery"
import { AccountInfo } from "@solana/web3.js";


export async function findUserInfo(
    userKey: PublicKey,
    nameService: PublicKey,
    root: null | PublicKey,
    connection: Connection){
    
    try{
        const {nameAccountKey: userRecordKey} = getSeedAndKey(
            nameService, getHashedName(userKey.toBase58()), root
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
        const domains = cutDomains(userRecord.domains)
        console.log(domains);
        return domains
    }else{
        throw new Error("Invalid")
    }
}

function cutDomains(domainStr: string){
    const lastDotIndex = domainStr.lastIndexOf(".");

    if(lastDotIndex){
        const substringWithoutZeros = domainStr.substring(0, lastDotIndex).replace(/0+$/, "");
        const result = substringWithoutZeros.split(".");
        return result
    }else{
        throw new Error("Invalid domain string");
    }
}

interface RecordHeader {
    root: string,
    domains: string,
}

function decodeRecordHeader(data: Uint8Array): RecordHeader{

    const DISCRIMINATOR = 8;
    const PUBKEY_LENGTH = 32;
    const VEC_LENGTH_PREFIX = 4;

    const length = data.byteLength;
    console.log(length)

    let offset = DISCRIMINATOR;

    const root = new PublicKey(data.slice(offset, offset + PUBKEY_LENGTH)).toBase58();
    offset += PUBKEY_LENGTH;

    offset += VEC_LENGTH_PREFIX;

    const domain = data.slice(offset, length);
    const domains = domain.toString();

    return {
        root,
        domains, 
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
