import { Numberu64 } from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";


export const HASH_PREFIX = "WEB3 Name Service";

export const DEVNET_URL = "https://api.devnet.solana.com";

export const WEB3_NAME_SERVICE_ID = new PublicKey(
    "8YXaA8pzJ4xVPjYY8b5HkxmPWixwpZu7gVcj8EvHxRDC"
);

export const WEB3_RECORDS_ID = new PublicKey(
    "J5EgeEXm3Y7Bqi51GSCBeY7bsvnQhKnWr2Lc94B95xdQ"
);

export const WEB3_REGISTER_ID = new PublicKey(
    "E8AHgynPE6GrUmMDPcYryfAD6akXqpiQ29ME2ZBNkDZ2"
);

export const WEB3_AUCTION_ID = new PublicKey(
    "9JzGVN9y1BgjCWKp4nJmeUnud3FGsP1zKV4VaarqwucZ"
);

export const VAULT = new PublicKey(
    "2NFji3XWVs2tb8btmGgkunjA9AFTr5x3DaTbsrZ7abGh"
)

export const [CENTRAL_STATE_RECORDS] = PublicKey.findProgramAddressSync(
    [WEB3_RECORDS_ID.toBuffer()],
    WEB3_RECORDS_ID
);

export const [CENTRAL_STATE_AUCTION] = PublicKey.findProgramAddressSync(
    [WEB3_RECORDS_ID.toBuffer()],
    WEB3_RECORDS_ID
);

export const [CENTRAL_STATE_REGISTER] = PublicKey.findProgramAddressSync(
    [WEB3_RECORDS_ID.toBuffer()],
    WEB3_RECORDS_ID
);

export const CREATE_ROOT_FEE = new Numberu64(10000);

