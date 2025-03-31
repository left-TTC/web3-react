import { sha256 } from 'js-sha256';
import { Buffer } from 'buffer'; // To handle binary data in Node.js
import { PublicKey, Connection, Keypair } from '@solana/web3.js'; 

const HASH_PREFIX = "WEB3 Name Service";

export const DEVNET_URL = "https://api.devnet.solana.com";

export const WEB3_NAME_SERVICE_ID = new PublicKey("2zwHkEcbGRfzif4iCtpNgQntPgZDRhAukteiuDeAcjYU");

export const WEB3_ROOT = new PublicKey("52F3LuKrH19f8JATdXn1w9F3kFQceK3n5ticQmbjVs78");



export function getHashedName(name: string){
    const rawHash = HASH_PREFIX + name;
    const hashValue = sha256(rawHash);
    return new Uint8Array(Buffer.from(hashValue, 'hex'));
}

export function getSeedAndKey(
    programid: PublicKey, hashedName: Uint8Array, rootOpt: null | PublicKey ){
    
    let seeds = new Uint8Array([...hashedName]);
    
    const rootDomain = rootOpt || PublicKey.default;
    seeds = new Uint8Array([...seeds, ...rootDomain.toBytes()]);

    const seedChunks = [];
    for (let i = 0; i < seeds.length; i += 32) {
        const chunk = seeds.slice(i, i + 32);
        seedChunks.push(chunk);
    }

    const [nameAccountKey, bump] = PublicKey.findProgramAddressSync(
        seedChunks,
        programid
    );

    seeds = new Uint8Array([...seeds, bump]);

    return {nameAccountKey, seeds};
}


export async function queryDomain(
    name: string, programid: PublicKey,rootOpt: PublicKey | null) {
    try{
        const hashedName = getHashedName(name);
        const {nameAccountKey} = getSeedAndKey(
            programid, hashedName, rootOpt);

        if (!nameAccountKey) {
            throw new Error("Failed to generate PDA");
        }

        console.log("PDA:", nameAccountKey.toBase58());
        
        const connection = new Connection(DEVNET_URL, 'confirmed');
        const accountInfo = await connection.getAccountInfo(nameAccountKey);

        if(accountInfo){
            console.log("exist");
            const accountData = accountInfo.data
            const a = decodeNameRecordHeader(accountData)
            console.log(a)
            return accountInfo;
        }else{
            console.log("not exist");
            return null;
        }
    }catch(err){
        console.log("err happened when quering:", err)
    }
}


export function isCheckDomain(){
    return false
}


export function calculateDomainPrice(domain: string){
    return 20
}


interface NameRecordHeader {
    owner: string;
    root: string; 
    ipfs: string | null; 
}

function decodeNameRecordHeader(data: Uint8Array): NameRecordHeader {

    const PUBKEY_LENGTH = 32;
    const OPTION_TAG_LENGTH = 1;
    const IPFS_LENGTH = 46;

    let offset = 0; 

    // 解析 owner (32 bytes)
    const owner = new PublicKey(data.slice(offset, offset + PUBKEY_LENGTH)).toBase58();
    offset += PUBKEY_LENGTH;

    // 解析 root (32 bytes)
    const root = new PublicKey(data.slice(offset, offset + PUBKEY_LENGTH)).toBase58();
    offset += PUBKEY_LENGTH;

    // 解析 ipfs (Option<[u8; 46]>)
    const ipfsExists = data[offset] === 1; // Option标记
    offset += OPTION_TAG_LENGTH;

    let ipfs: string | null = null;
    if (ipfsExists) {
        // 提取IPFS CID（假设存储的是UTF-8编码的字符串）
        const ipfsBytes = data.slice(offset, offset + IPFS_LENGTH);
        // 去除可能的填充空字节
        const nullByteIndex = ipfsBytes.findIndex(b => b === 0);
        const effectiveLength = nullByteIndex === -1 ? IPFS_LENGTH : nullByteIndex;
        ipfs = new TextDecoder().decode(ipfsBytes.slice(0, effectiveLength));
        offset += IPFS_LENGTH;
    }

    return {
        owner,
        root,
        ipfs,
    };
}