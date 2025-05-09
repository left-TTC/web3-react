
// import { BN, Program } from "@coral-xyz/anchor";
// import { AnchorWallet } from "@solana/wallet-adapter-react";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { getHashedName, getSeedAndKey, getUsrRecordAccount } from "./aboutquery";
// // import { buffer } from "stream/consumers";


// export interface createRootInfo{
//     raisedAmount: number,
//     creatingKey: PublicKey,
//     target: number,
// }

// export async function getRecordListsPda(programId: PublicKey){
//     const SEED = Buffer.from("web3 auction account list");

//     const [crowdingAccountPubkey, _] = await PublicKey.findProgramAddressSync(
//         [SEED],
//         programId,
//     );

//     return crowdingAccountPubkey
// }

// export async function checkAuctionAccountLists(programId: PublicKey, connection: Connection){
//     const crowdingAccountPubkey = await getRecordListsPda(programId)

//     const accountInfo = await connection.getAccountInfo(crowdingAccountPubkey);

//     try{
//         if (accountInfo){
//             console.log("origin:", accountInfo.data)
//             return accountInfo.data;
//         }else{
//             throw new Error("can't find auction record list");
//         }
//     }catch(err){
//         console.log(err)
//     }
// }

// export async function checkFundingStateAccount(
//     programId: PublicKey, rootDomainPda: PublicKey){
    
//     const seeds = [
//         Buffer.from("web3 Auction"),
//         rootDomainPda.toBuffer(),
//     ];

//     try{
//         const [address, _] = await PublicKey.findProgramAddressSync(seeds, programId);

//         return address
//     }catch(err){
//         console.log(err)
//     }
// }


// export function decodeAuctionList(data: Buffer<ArrayBufferLike>){
//     const actualData = data.slice(8+4); 

//     const datastr = new TextDecoder().decode(actualData);

//     const parsedData = datastr.split('.').filter(item => item !== "");

//     return parsedData;
// }



// export function decodeFundingRootData(data: Buffer<ArrayBufferLike>){

//     if (data.length < 56) {
//         throw new Error('Invalid data length');
//     }

//     const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
//     let offset = 8; 

//     const raisedAmount = Number(view.getBigUint64(offset, true));
//     offset += 8;

//     const fundingRoot = new PublicKey(data.slice(offset, offset + 32));
//     offset += 32;

//     const target = Number(view.getBigUint64(offset, true));

//     let re: createRootInfo = {
//         raisedAmount: raisedAmount,
//         creatingKey: fundingRoot,
//         target: target,
//     };
//     return re;
// }


// export async function createRootAccount(
//     root: string, 
//     auction: Program<Auction> | null, 
//     wallet: AnchorWallet | undefined, 
//     nameService: Program<Web3NameService> | null,
//     connection: Connection,
// ){
//     if (auction && wallet && nameService){
//         const {nameAccountKey: willCreateRootAcount} = getSeedAndKey(
//             nameService.programId, getHashedName(root), null);

//         console.log("auction id:", auction.programId.toBase58())

//         const recordPda = await getRecordListsPda(auction.programId);

//         const recordRootAccountInfo = await checkAuctionAccountLists(auction.programId, connection);

//         const bufferRoot = new TextEncoder().encode(root);
//         console.log("add legth:", bufferRoot.length)

//         let magnification = 0;
//         let origin32 = 0;

//         if (recordRootAccountInfo){
//             const addNum = checkWheatherAddSpace(
//                 recordRootAccountInfo, bufferRoot
//             );

//             origin32 = Math.floor(recordRootAccountInfo.length / 32)

//             magnification = addNum + origin32;
//             console.log("magnification", magnification);
//         }else{
            
//         }
    
//         try{
//             if (magnification > origin32){
//                 console.log("realloc frist");

//                 const magNum = new BN(magnification);

//                 const reallocTx = await auction.methods
//                     .listRealloc(magNum)
//                     .accounts({
//                         payer: wallet.publicKey,
//                     })
//                     .rpc()
//                     console.log('Realloc successful:', reallocTx);
//             }
//             const tx = await auction.methods
//                 .createFunding(root)
//                 .accounts({
//                     willCreateRoot: willCreateRootAcount,
//                     caller: wallet.publicKey,
//                 })
//                 .remainingAccounts([
//                     {
//                         pubkey: recordPda,
//                         isSigner: false,
//                         isWritable: true,
//                     }
//                 ])
//                 .rpc()
//                 console.log('Transaction successful:', tx);
//         }catch(err){
//             console.error('Error creating name:', err);
//         }
//     }else{
//         throw new Error("element missed");
//     }
// }

// export function checkWheatherAddSpace(
//     accountData: Buffer<ArrayBufferLike> | null, 
//     bufferRoot: Uint8Array<ArrayBufferLike>,
// ){
//     if (accountData){
//         let lastIndexDot = -1;

//         console.log("account data length:", accountData.length);
//         console.log("account data:", accountData);

//         let iIndex = 0;
//         for (let i = accountData.length -1; i >= 0; i--){
//             if (accountData[i] === 46){
//                 lastIndexDot = i;
//                 break;
//             }
//             iIndex ++;
//         }

//         console.log("the last dot:", lastIndexDot);

//         if (lastIndexDot === -1){
//             if (iIndex != accountData.length){
//                 throw new Error("error");
//             }
//             return 0;
//         }

//         let freeSpace = 0;
//         for (let i = lastIndexDot + 1; i < accountData.length; i++) {
//             if (accountData[i] === 0) {
//                 freeSpace++;
//             } else {
//                 break; 
//             }
//         }

//         console.log("free space:", freeSpace);

//         let overSizeSpace = bufferRoot.length + 1 - freeSpace;

//         console.log("oversizeSpace:", overSizeSpace);
        
//         if (overSizeSpace <= 0){
//             console.log("Space is enough");
//             return 0
//         }else{
//             const magnification = Math.floor(overSizeSpace/32) + 1;
//             console.log("add num:", magnification * 32);
//             return magnification
//         }

//     }else{
//         throw new Error("can't find the account data");
//     }
// }

// // const test = async () => {
// //     console.log("this is realloc test");
// //     if(auctionProgram && wallet){
// //         try{
// //             const tx = await auctionProgram.methods
// //             .testRealloc()
// //             .accounts({
// //                 payer: wallet.publicKey
// //             })
// //             .rpc();
// //             console.log("realloc success:", tx)
// //         }catch(err){
// //             console.log(err)
// //         }
// //     }
// // }

// export async function addFundingAmount(
//     auction: Program<Auction> | null, 
//     wallet: AnchorWallet | undefined, 
//     nameService: Program<Web3NameService> | null,
//     willAddAmount: number,
//     addingRootName: string,
// ){
//     if (auction && wallet && nameService){

//         const addAmount = new BN(willAddAmount);

//         const {nameAccountKey: willCreateRootPda} = getSeedAndKey(
//             nameService.programId, getHashedName(addingRootName), null
//         )
//         console.log("will create pda:", willCreateRootPda.toBase58());

//         const allRootRecordPda = getUsrRecordAccount(
//             nameService.programId, auction.programId, null
//         )
//         console.log("will create record pda:", allRootRecordPda.toBase58());

//         const {nameAccountKey: ifroot} = getSeedAndKey(
//             nameService.programId, getHashedName(auction.programId.toBase58()), null
//         )
//         console.log("if record pda:", ifroot.toBase58());

//         console.log("web3 name service:", nameService.programId.toBase58())

//         const rootFundStateAccount = await checkFundingStateAccount(auction.programId, willCreateRootPda);

//         if(rootFundStateAccount){
//             try{
//                 const addTx = await auction.methods
//                     .addFunding(addAmount, addingRootName)
//                     .accounts({
//                         willCreateRoot: willCreateRootPda,
//                         allRootRecordAccount: allRootRecordPda,
//                         payer: wallet.publicKey,
//                     })
//                     .remainingAccounts([
//                         {
//                             pubkey: allRootRecordPda,
//                             isSigner: false,
//                             isWritable: true,
//                         }
//                     ])
//                     .rpc()

//                 console.log('Transaction successful:', addTx);

//                 return addTx;
                
//             }catch(err){
//                 console.log('Transaction fail:', err);
//             }
//         }else{
//             throw new Error("no this account");
//         }
//     }
// }