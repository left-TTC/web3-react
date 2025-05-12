import { Connection, PublicKey } from "@solana/web3.js";
import { CENTRAL_STATE_AUCTION, CENTRAL_STATE_REGISTER, WEB3_AUCTION_ID, WEB3_NAME_SERVICE_ID } from "../constants";
import { getHashedName, getNameAccountKey } from "./getNameAccountKey";



export async function getUsrAllDomainsByRoot(
    connection: Connection,
    usrKey: PublicKey,
    rootKey: PublicKey,
): Promise<PublicKey[]> {
    const filters = [
        {
          memcmp: {
            offset: 32,
            bytes: usrKey.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: rootKey.toBase58(),
          },
        },
      ];

    const accounts = await connection.getProgramAccounts(WEB3_NAME_SERVICE_ID, {
        filters,
        dataSlice: { offset: 0, length: 0},
    });

    return accounts.map((a) => a.pubkey);
}

export async function getAllRootDomain(
    connection: Connection
): Promise<PublicKey[]> {
    const filters = [
        {
          memcmp: {
            offset: 32,
            bytes: CENTRAL_STATE_REGISTER.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: PublicKey.default.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 64,
            bytes: PublicKey.default.toBase58(),
          },
        },
      ];

    const accounts = await connection.getProgramAccounts(WEB3_NAME_SERVICE_ID, {
        filters,
        dataSlice: { offset: 0, length: 0},
    });

    return accounts.map((a) => a.pubkey);
}


