import { sha256 } from 'js-sha256';
import { Buffer } from 'buffer'; // To handle binary data in Node.js
import { PublicKey, Connection } from '@solana/web3.js'; 

const HASH_PREFIX = "WEB3 Name Service";

const DEVNET_URL = "https://api.devnet.solana.com";

const ROOT_CLASS = new PublicKey("52F3LuKrH19f8JATdXn1w9F3kFQceK3n5ticQmbjVs78");

export const WEB3_NAME_SERVICE_ID = new PublicKey("BWK7ZQWjQ9fweneHfsYmof7znPr5GyedCWs2J8JhHxD3");

export const WEB3_ROOT = new PublicKey("52F3LuKrH19f8JATdXn1w9F3kFQceK3n5ticQmbjVs78");



function getHashedName(name: string){
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
