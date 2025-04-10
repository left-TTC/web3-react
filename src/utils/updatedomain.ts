import { Web3NameService } from "@/components/program/anchor/nameService/idl";
import { revisingDomainInfo } from "@/pages/user";
import { Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { decodeNameRecordHeader, getHashedName, getSeedAndKey, queryDomain } from "./aboutquery";



export async function updateIPFS(
    wallet: AnchorWallet, 
    nameprogram: Program<Web3NameService>, 
    usrInfo: revisingDomainInfo,
){
    //Confirm ownership
    const root = usrInfo.root;
    const changeDomain = usrInfo.name;

    try{
        const domainInfo = await queryDomain(
            changeDomain, nameprogram.programId, null
        )

        if (!domainInfo){
            throw new Error("can't find info about the account");
        }else{
            const decodeDomainInfo = decodeNameRecordHeader(domainInfo.data);
            
            if (decodeDomainInfo.owner != wallet.publicKey.toBase58()){
                throw new Error("not your domain");
            }else {
                //update the ipfs here:
                let {nameAccountKey} = getSeedAndKey(
                    nameprogram.programId, getHashedName(changeDomain), null);
                const {nameAccountKey: asRoot} = getSeedAndKey(
                    nameprogram.programId, getHashedName("xyz"), null
                )

                if (!usrInfo.ipfs){
                    throw new Error("to bytes err");
                }else{
                    const dataUint8 = stringToByteArray(usrInfo.ipfs);
                    const dataArray = Array.from(dataUint8);
                    try {
                        const tx = await nameprogram.methods
                            .update(dataArray)
                            .accounts({
                                nameAccount: nameAccountKey,
                                nameUpdateSigner: wallet.publicKey,
                                rootDomain: asRoot,
                            })
                            .remainingAccounts([ 
                                {
                                    pubkey: nameAccountKey,
                                    isWritable: true,  
                                    isSigner: false,
                                },
                                {
                                    pubkey: asRoot,
                                    isWritable: false, 
                                    isSigner: false
                                }
                            ])
                            .rpc();
                        console.log('update Transaction successful:', tx)
                    }catch(err){
                        console.log(err)
                    }
                }
            }
        }
    }catch{

    }
}

function stringToByteArray(input: string): Uint8Array {
    const encoder = new TextEncoder();
    let encoded = encoder.encode(input);

    let fixedSizeArray = new Uint8Array(46);
    fixedSizeArray.set(encoded.slice(0, 46)); // 取前 46 字节
    return fixedSizeArray;
}