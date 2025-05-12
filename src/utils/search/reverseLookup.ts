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

    console.log("reversing:", nameAccount.toBase58())

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


export async function getMultipleReverseLookup(
    connection: Connection,
    nameAccounts: PublicKey[],
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

  let reverseKeys: PublicKey[] = [];
  for(const nameAccount of nameAccounts){
    const reverse = getReverseKeyFromDomainKey(nameAccount, reverseClass, parent);
    reverseKeys.push(reverse);
  }

  if(reverseKeys.length === 0)return;

  const infos = await connection.getMultipleAccountsInfo(reverseKeys);

  let returns: string[] = []
  for (const info of infos){
    if (info){
        const res = new NameRegistryState(
            deserialize(NameRegistryState.schema, info.data) as any,
        );
        res.data = info.data?.slice(NameRegistryState.HEADER_LEN);

        returns.push(deserializeReverse(res.data, !!parent))
    }else{
        returns.push("");
    }
  }

  return returns
}