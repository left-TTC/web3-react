import { Connection, PublicKey } from "@solana/web3.js";
import { getHashedName, getNameAccountKey } from "./getNameAccountKey";
import { CENTRAL_STATE_AUCTION, CENTRAL_STATE_REGISTER } from "../constants";
import { deserializeReverse, NameRegistryState } from "@bonfida/spl-name-service";
import { deserialize } from "borsh";



export function getReverseKeyFromDomainKey(
    domainKey: PublicKey,
    reverseClass: PublicKey,
    parent: PublicKey | null,
  ){
    const hashedReverseLookup = getHashedName(domainKey.toBase58());
    const reverseLookupAccount = getNameAccountKey(
      hashedReverseLookup,
      reverseClass,
      parent,
    );
    return reverseLookupAccount;
};

export enum FindType {
    Root,
    Common,
}

export async function reverseLookup(
    connection: Connection,
    nameAccount: PublicKey,
    domainType: FindType,
    parent: PublicKey | null,
  ){
    let reverseClass: PublicKey;
    switch (domainType) {
        case FindType.Root:
            reverseClass = CENTRAL_STATE_AUCTION;
            if (parent)return;
            break;
        case FindType.Common:
            reverseClass = CENTRAL_STATE_REGISTER;
    }

    const reverseKey = getReverseKeyFromDomainKey(nameAccount, reverseClass, parent);
  
    const info =  await connection.getAccountInfo(reverseKey);
    if (!info) {
      throw new Error(`The name account does not exist`);
    }
  
    const res = new NameRegistryState(
        deserialize(NameRegistryState.schema, info.data) as any,
    );
  
    res.data = info.data?.slice(NameRegistryState.HEADER_LEN);
  
    return deserializeReverse(res.data, !!parent);
}


// export async function getMultipleReverseLookup(
//     connection: Connection,
//     nameAccount: PublicKey,
//     domainType: FindType,
//     parent: PublicKey | null,
// ){
//   let reverseClass: PublicKey;
//   switch (domainType) {
//       case FindType.Root:
//           reverseClass = CENTRAL_STATE_AUCTION;
//           if (parent)return;
//           break;
//       case FindType.Common:
//           reverseClass = CENTRAL_STATE_REGISTER;
//   }

//   const reverseKeys = await
// }