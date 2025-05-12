import { Connection, PublicKey } from "@solana/web3.js";
import { Record } from "./record";
import { getHashedName, getNameAccountKey } from "../search/getNameAccountKey";
import { CENTRAL_STATE_RECORDS } from "../constants";
import { RecordResult } from "@bonfida/spl-name-service";





export function getDomainRecordKey(
    domain: string,
    recordType: Record,
    parentNameKey: PublicKey,
): PublicKey {
    const domainNameAccount = getNameAccountKey(
        getHashedName(domain), null, parentNameKey
    )

    const recordName = getNameAccountKey(
        getHashedName(recordType), CENTRAL_STATE_RECORDS, domainNameAccount
    )

    return recordName;
}


export async function getDomainRecords(
    connection: Connection,
    domain: string,
    records: Record[],
    domainParent: PublicKey,
): Promise<(RecordResult | undefined)[]> {
    const recordKeys = records.map((record) => getDomainRecordKey(domain, record, domainParent))

}