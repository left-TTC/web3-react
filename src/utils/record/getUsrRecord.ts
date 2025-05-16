import { Connection, PublicKey } from "@solana/web3.js";
import { Record, RecordResult } from "./record";
import { getHashedName, getNameAccountKey } from "../search/getNameAccountKey";
import { CENTRAL_STATE_RECORDS } from "../constants";
import { RecordState } from "./recordHeader";


//IPFS.domain.root 
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
    const retrievedRecords = await RecordState.retrieveBatch(connection, recordKeys);

    const shouldReturn = retrievedRecords.map((currentRecord, index) => {
        if(!currentRecord) return undefined;
        console.log(currentRecord.data)
        const result: RecordResult = {
            retrievedRecord: currentRecord,
            record: records[index],
            deserializedContent: RecordState.getReadableData(currentRecord.data),
        }
        return result
    })

    return shouldReturn;
}