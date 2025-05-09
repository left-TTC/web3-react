import { PublicKey } from "@solana/web3.js";
import { HASH_PREFIX, WEB3_AUCTION_ID, WEB3_NAME_SERVICE_ID } from "../constants";
import { sha256 } from "js-sha256";


export function getHashedName(name: string):Buffer {
    const input = HASH_PREFIX + name;
    const hashedHex = sha256(input);
    const hashedBuffer = Buffer.from(hashedHex, "hex");
    return hashedBuffer;
}

export function getNameAccountKey(
    hashed_name: Buffer,
    nameClass: PublicKey | null,
    nameParent: PublicKey | null,
): PublicKey {
    const seeds = [hashed_name];
    if (nameClass) {
      seeds.push(nameClass.toBuffer());
    } else {
      seeds.push(Buffer.alloc(32));
    }
    if (nameParent) {
      seeds.push(nameParent.toBuffer());
    } else {
      seeds.push(Buffer.alloc(32));
    }
    const [nameAccountKey] = PublicKey.findProgramAddressSync(
      seeds,
      WEB3_NAME_SERVICE_ID,
    );
    return nameAccountKey;
};

export function getAuctionRecordKey(
    hashed_name: Buffer,
    nameClass: PublicKey | null,
    nameParent: PublicKey | null,
): PublicKey {
    const seeds = [hashed_name];
    if (nameClass) {
      seeds.push(nameClass.toBuffer());
    } else {
      seeds.push(Buffer.alloc(32));
    }
    if (nameParent) {
      seeds.push(nameParent.toBuffer());
    } else {
      seeds.push(Buffer.alloc(32));
    }
    const [nameAccountKey] = PublicKey.findProgramAddressSync(
      seeds,
      WEB3_AUCTION_ID,
    );
    return nameAccountKey;
};