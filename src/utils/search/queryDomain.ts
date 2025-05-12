import { PublicKey, Connection} from '@solana/web3.js'; 
import { getHashedName, getNameAccountKey } from './getNameAccountKey';


export async function queryDomain(
    name: string,
    rootOpt: PublicKey,
    connection: Connection,
) {
    try{
        const hashedName = getHashedName(name);
        const nameAccountKey = getNameAccountKey(
            hashedName, null, rootOpt,);

        console.log("PDA:", nameAccountKey.toBase58());

        const accountInfo = await connection.getAccountInfo(nameAccountKey);

        if(accountInfo){
            console.log("exist");
            const accountData = accountInfo.data
            console.log(accountData)
            return accountInfo;
        }else{
            console.log("not exist");
            return null;
        }
    }catch(err){
        console.log("err happened when quering:", err)
    }
}

