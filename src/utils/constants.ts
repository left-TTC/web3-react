
import { PublicKey } from "@solana/web3.js";


export const HASH_PREFIX = "WEB3 Name Service";

export const DEVNET_URL = "https://api.devnet.solana.com";

export const WEB3_NAME_SERVICE_ID = new PublicKey(
    "8YXaA8pzJ4xVPjYY8b5HkxmPWixwpZu7gVcj8EvHxRDC"
);

export const WEB3_RECORDS_ID = new PublicKey(
    "Fvsk2JxGzcaaEL4eh4nZpWZjXT5XsD3dK2PpxqmbFbDv"
);

export const WEB3_REGISTER_ID = new PublicKey(
    "E8AHgynPE6GrUmMDPcYryfAD6akXqpiQ29ME2ZBNkDZ2"
);

export const WEB3_AUCTION_ID = new PublicKey(
    "9qQuHLMAJEehtk47nKbY1cMAL1bVD7nQxno4SJRDth7"
);

export const VAULT = new PublicKey(
    "2NFji3XWVs2tb8btmGgkunjA9AFTr5x3DaTbsrZ7abGh"
)

export const [CENTRAL_STATE_RECORDS] = PublicKey.findProgramAddressSync(
    [WEB3_RECORDS_ID.toBuffer()],
    WEB3_RECORDS_ID
);

export const [CENTRAL_STATE_AUCTION] = PublicKey.findProgramAddressSync(
    [WEB3_AUCTION_ID.toBuffer()],
    WEB3_AUCTION_ID
);

export const [CENTRAL_STATE_REGISTER] = PublicKey.findProgramAddressSync(
    [WEB3_REGISTER_ID.toBuffer()],
    WEB3_REGISTER_ID
);

export const CREATE_ROOT_FEE = 10000;

