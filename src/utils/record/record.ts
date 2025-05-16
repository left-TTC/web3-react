import { RecordState } from "./recordHeader";


export enum Record {
    IPFS = "IPFS",
    ARWV = "ARWV",
    SOL = "SOL",
    ETH = "ETH",
    BTC = "BTC",
    LTC = "LTC",
    DOGE = "DOGE",
    Email = "email",
    Url = "url",
    Discord = "discord",
    Github = "github",
    Reddit = "reddit",
    Twitter = "twitter",
    Telegram = "telegram",
    Pic = "pic",
    SHDW = "SHDW",
    POINT = "POINT",
    BSC = "BSC",
    Injective = "INJ",
    Backpack = "backpack",
    A = "A",
    AAAA = "AAAA",
    CNAME = "CNAME",
    TXT = "TXT",
    Background = "background",
    BASE = "BASE",
    IPNS = "IPNS",
    WECHAT = "WECHAT",
}


export interface RecordResult {
    retrievedRecord: RecordState;
    record: Record;
    deserializedContent: string;
}


