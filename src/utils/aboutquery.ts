import { sha256 } from 'js-sha256';
import { Buffer } from 'buffer'; // To handle binary data in Node.js
import { PublicKey, Connection, Keypair } from '@solana/web3.js'; 
import idl from "../anchor/nameService/IDL.json"

const HASH_PREFIX = "WEB3 Name Service";

const DEVNET_URL = "https://api.devnet.solana.com";

const ROOT_CLASS = new PublicKey("52F3LuKrH19f8JATdXn1w9F3kFQceK3n5ticQmbjVs78");

export const WEB3_NAME_SERVICE_ID = new PublicKey("BWK7ZQWjQ9fweneHfsYmof7znPr5GyedCWs2J8JhHxD3");

export const WEB3_ROOT = new PublicKey("52F3LuKrH19f8JATdXn1w9F3kFQceK3n5ticQmbjVs78");



export function getHashedName(name: string){
    const rawHash = HASH_PREFIX + name;
    const hashValue = sha256(rawHash);
    return new Uint8Array(Buffer.from(hashValue, 'hex'));
}

export function getSeedAndKey(
    programid: PublicKey, hashedName: Uint8Array, domainClass: PublicKey, rootOpt: null | PublicKey ){
    
    let seeds = new Uint8Array([...hashedName]);
    seeds = new Uint8Array([...seeds, ...domainClass.toBytes()]);
    
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


export async function query_domain(
    name: string, programid: PublicKey, domainClass: PublicKey, rootOpt: PublicKey | null) {
    try{
        const hashedName = getHashedName(name);
        const {nameAccountKey} = getSeedAndKey(
            programid, hashedName, domainClass, rootOpt);

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
            const secretKey = Uint8Array.from([0, 212, 141, 200, 155, 38, 30, 99, 207, 137, 15, 97, 0, 119, 24, 140, 56, 8, 57, 174, 84, 215, 171, 1, 228, 73, 78, 138, 87, 148, 227, 101, 59, 192, 52, 60, 61, 238, 13, 30, 197, 128, 52, 53, 39, 140, 183, 188, 96, 130, 50, 237, 152, 174, 225, 240, 196, 203, 83, 147, 18, 2, 64, 43])
            const domainClass = Keypair.fromSecretKey(secretKey);
            console.log("domainClass:", domainClass.publicKey.toBase58())
            return accountInfo;
        }else{
            console.log("not exist");
            return null;
        }
    }catch(err){
        console.log("err happened when quering:", err)
    }
}

export function checkClass(className: string){
    return ROOT_CLASS;
}


export function isCheckDomain(){
    return false
}


export function calculateDomainPrice(domain: string){
    return 20
}

interface NameRecordHeader {
    owner: string; // 转换为公钥字符串
    root: string; // 转换为公钥字符串
    class: string; // 转换为公钥字符串
    ipfs: string | null; // 转换为 IPFS CID 字符串
}

function decodeNameRecordHeader(data: Uint8Array): NameRecordHeader {

    // 解析 owner (32 bytes)
    const owner = new PublicKey(data.slice(0, 32)).toBase58();

    // 解析 root (32 bytes)
    const root = new PublicKey(data.slice(32, 64)).toBase58();

    // 解析 class (32 bytes)
    const classKey = new PublicKey(data.slice(64, 96)).toBase58();

    // 解析 ipfs (46 bytes)
    const ipfsExists = data[96] === 1; // Option<[u8; 46]> 的第一个字节表示是否存在
    const ipfs = ipfsExists ? new TextDecoder().decode(data.slice(97, 143)) : null; // 将字节数组转换为字符串

    return {
        owner,
        root,
        class: classKey,
        ipfs,
    };
}