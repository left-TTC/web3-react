import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Buffer } from 'buffer';
import { sha256 } from 'js-sha256';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Numberu32 } from "@bonfida/spl-name-service"
import {  TOKEN_PROGRAM_ID } from "@solana/spl-token";




import {allocateAndPostRecordInstruction, editRecordInstruction} from "./code"

export const SNS_RECORDS_ID = new PublicKey(
  "J5EgeEXm3Y7Bqi51GSCBeY7bsvnQhKnWr2Lc94B95xdQ"
);

export const [CENTRAL_STATE_SNS_RECORDS] = PublicKey.findProgramAddressSync(
  [SNS_RECORDS_ID.toBuffer()],
  SNS_RECORDS_ID
);

export function allocateAndPostRecord(
  feePayer: PublicKey,
  recordKey: PublicKey,
  domainKey: PublicKey,
  domainOwner: PublicKey,
  nameProgramId: PublicKey,
  record: string,
  content: Buffer,
  programId: PublicKey
) {
  const ix = new allocateAndPostRecordInstruction({
    record,
    content: Array.from(content),
  }).getInstruction(
    programId,
    SystemProgram.programId,
    nameProgramId,
    feePayer,
    recordKey,
    domainKey,
    domainOwner,
    CENTRAL_STATE_SNS_RECORDS
  );
  return ix;
};

export function editRecord(
  feePayer: PublicKey,
  recordKey: PublicKey,
  domainKey: PublicKey,
  domainOwner: PublicKey,
  nameProgramId: PublicKey,
  record: string,
  content: Buffer,
  programId: PublicKey
) {
  const ix = new editRecordInstruction({
    record,
    content: Array.from(content),
  }).getInstruction(
    programId,
    SystemProgram.programId,
    nameProgramId,
    feePayer,
    recordKey,
    domainKey,
    domainOwner,
    CENTRAL_STATE_SNS_RECORDS
  );
  return ix;
};





export default function Tetspage() {
  const { connection } = useConnection();
  const { publicKey, signTransaction} = useWallet();

  const [willCreate, setWillCreate] = useState("");

  const [usrDomain, setUsrDomain] = useState<PublicKey[]>([]);
  const [domain, setDomain] = useState<string[]>([]);

  const tets1 = async (name: string) => {
    console.log("test1 start")
    if (!publicKey || !signTransaction)return;

    const [centralState, _] = await PublicKey.findProgramAddressSync(
      [REGISTER.toBytes()],
      REGISTER,
    )

    console.log(centralState.toBase58());

    const {pubkey: nameAccount} = _deriveSync(name, ROOT_DOMAIN_ACCOUNT);
    console.log("name:", nameAccount.toBase58());
    const reverseLookup = getNameAccountKeySync(getHashedNameSync(nameAccount.toBase58()), centralState);

    const space = new Numberu32(1024);
    // const l = await connection.getMinimumBalanceForRentExemption(1024);

    // const lamports = new Numberu32(l);
    const ts = createDomainInstruction(nameAccount, reverseLookup, centralState, publicKey, publicKey, publicKey, null, name,  space);
    const transaction = new Transaction().add(ts);
    const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

    const signedTx = await signTransaction(transaction);
    try{
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      console.log("success:", txid)
    }catch(err){
      console.log("fail:", err)
    }
  }

  const tes2 = async() => {
    if(!publicKey)return;
    const theD = await test2(publicKey, connection);
    let domains: string[] = [];
    setUsrDomain(theD)
    for(let i = 0; i < theD.length; i++){
      console.log("reversing:", usrDomain[i]);
      const value = await reverseLookup(connection, usrDomain[i]);
      domains[i] = value;
    }
    setDomain(domains)
  }

  const [ipfsModal, SetIpfsModal] = useState(false);
  const [changingKey, setChangingKey] = useState<PublicKey>();
  const [changingName, setChangingName] = useState("error");

  const openModal = (key: PublicKey) => {
    SetIpfsModal(true);
    setChangingKey(key);
    const index = usrDomain.indexOf(key);
    setChangingName(domain[index]);
  }

  const closeModal = () => {
    SetIpfsModal(false)
  }

  const [inputIpfs, setInputIpfs] = useState("");


  //QmPu4ZT2zPfyVY8CA2YBzqo9HfAV79nDuuf177tMrQK1py
  const test3 = async(nameAccount: PublicKey | undefined, ipfs: string) => {
    console.log("test3 start")
    if (!publicKey || !signTransaction || !nameAccount)return;
    
    const content = Buffer.from(ipfs, 'utf-8');

    const recordKey = getRecordV2Key(changingName, Record.IPFS);
    console.log("record:", recordKey.toBase58());

    const recordix = allocateAndPostRecord(publicKey,recordKey ,nameAccount, publicKey, NAME_PROGRAM_ID, Record.IPFS, content, RECORD);

    const transaction = new Transaction().add(recordix);

    const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

    const signedTx = await signTransaction(transaction);
    try{
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      console.log("success:", txid)
    }catch(err){
      console.log("fail:", err)
    }

  }

  const [showCidModal, setShowCidModal] = useState(false);
  const [showingCid, setShowingCid] = useState("error");
  const [cidModalName, setCidModalName] = useState("error")

  const test4 = async(domain: string) => {
    console.log("checking:",domain);
    const result = await getCid(domain, connection);

    if (result[0]){
      const cid = Buffer.from(result[0].retrievedRecord.data).toString("utf-8");
      console.log(cid);
      setShowingCid(cid);
    }
   
    setCidModalName(domain)
    setShowCidModal(true);
  }

  const test5 = async(newipfs: string) => {
    console.log("test5, edit cid")
    if (!publicKey || !signTransaction )return;

    const content = Buffer.from(newipfs, 'utf-8');

    if(cidModalName == "error")return;

    const recordKey = getRecordV2Key(cidModalName, Record.IPFS);
    console.log("record:", recordKey.toBase58());

    const {pubkey: nameAccount} = _deriveSync(cidModalName, ROOT_DOMAIN_ACCOUNT);
    console.log("name:", nameAccount.toBase58());

    const recordix = editRecord(publicKey, recordKey, nameAccount, publicKey, NAME_PROGRAM_ID, Record.IPFS, content, RECORD);

    const transaction = new Transaction().add(recordix);

    const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

    const signedTx = await signTransaction(transaction);
    try{
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      console.log("success:", txid)
    }catch(err){
      console.log("fail:", err)
    }
    //QmPu4ZT2zPfyVY8CA2YBzqo9HfAV79nDuuf177tMrQK1py
    //QmRfwUcWnXXfHp3GjScrvoR1hufiKyhSPgV3aYWnXbuW5b

  }

  const [wantChangeCid, setWantChangeCid] = useState("");

  return (
    <div style={{ marginTop: '200px', color: "black", height: '1200px', display:'flex', flexDirection: 'column', gap:'20px' }}>
      <h1 style={{color: 'white'}}>Hello world</h1>
      <input
        type="text"
        value={willCreate}
        style={{color: 'black'}}
        onChange={(e) => setWillCreate(e.target.value)}
        placeholder="Test domain here"
      />
      <button style={{backgroundColor: 'blue'}} onClick={() => {tets1(willCreate);}}>create</button>
      <button style={{backgroundColor: 'white', color:'black'}} onClick={() => tes2()}>check my domain</button>
      {usrDomain.map((pubkey, index) => (
          <button key={index} style={{ marginBottom: '10px', padding: '5px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} onClick={() => openModal(pubkey)}>
            <span>{pubkey.toBase58()}</span>
          </button>
        ))}
      {domain.map((domain, index) => (
        <button key={index} style={{ marginBottom: '10px', padding: '5px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} onClick={() => test4(domain)}>
          <span>{domain}</span>
        </button>
      ))}
      <button onClick={() => reverseTest()} style={{backgroundColor: 'red'}}>TEST</button>

      {ipfsModal && 
         <div 
         style={{
           position: 'fixed', 
           top: 0, 
           left: 0, 
           right: 0, 
           bottom: 0, 
           backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景
           backdropFilter: 'blur(5px)', // 背景模糊效果
           display: 'flex',
           justifyContent: 'center', // 水平居中
           alignItems: 'center', // 垂直居中
           zIndex: 10, // 确保在最上层
         }}
       >
         <div 
           style={{
             position: 'relative',
             backgroundColor: 'white', // 弹出层背景色
             padding: '20px',
             borderRadius: '8px', // 圆角效果
             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 弹出层阴影
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             gap: '20px'
           }}
         >
           <h2>Test: Modify your Ipfs Here</h2>
           <h1>you are Modifying:{changingKey? changingKey.toBase58() : "error"}</h1>
           <h3>its name: {changingName}.sol</h3>
           <input
            type="text"
            value={inputIpfs}
            style={{color: 'black'}}
            onChange={(e) => setInputIpfs(e.target.value)}
            placeholder="type ipfs"
          />
          <button style={{backgroundColor: 'blue', color: 'white'}} onClick={() => test3(changingKey, inputIpfs)}>Modify</button>
           <button onClick={closeModal} style={{backgroundColor: 'red', color: 'white'}}>close</button>
         </div>
       </div>
      }

      {showCidModal && 
         <div 
         style={{
           position: 'fixed', 
           top: 0, 
           left: 0, 
           right: 0, 
           bottom: 0, 
           backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景
           backdropFilter: 'blur(5px)', // 背景模糊效果
           display: 'flex',
           justifyContent: 'center', // 水平居中
           alignItems: 'center', // 垂直居中
           zIndex: 10, // 确保在最上层
         }}
       >
         <div 
           style={{
             position: 'relative',
             backgroundColor: 'white', // 弹出层背景色
             padding: '20px',
             borderRadius: '8px', // 圆角效果
             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 弹出层阴影
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             gap: '20px'
           }}
         >
           <h2>{cidModalName}.sol cid: {showingCid}</h2>
           <input
            type="text"
            value={wantChangeCid}
            style={{color: 'black'}}
            onChange={(e) => setWantChangeCid(e.target.value)}
            placeholder="type ipfs"
          />
          <button style={{backgroundColor: 'blue', color: 'white'}} onClick={() => test5(wantChangeCid)}>Chanege</button>
           <button onClick={() => setShowCidModal(false)} style={{backgroundColor: 'red', color: 'white'}}>close</button>
         </div>
       </div>
      }
    </div>
  )
}

//----------------test function create-------------------

async function test2(publicKey: PublicKey, connection: Connection) {
  return getAllDomains(connection, publicKey)
}

const TEST = new PublicKey("jCebN34bUfdeUYJT13J1yG16XWQpt5PDx6Mse9GUqhR");

async function reverseTest() {
  const [centralState, _] = await PublicKey.findProgramAddressSync(
    [TEST.toBytes()],
    TEST,
  )

  console.log("reverse:", centralState.toBase58())
}


//---------------------------------------------------------------

import { NameRegistryState } from "@bonfida/spl-name-service";
import { deserializeReverse } from "@bonfida/spl-name-service"
import { deserialize } from "borsh";


export async function reverseLookup(
  connection: Connection,
  nameAccount: PublicKey,
  parent?: PublicKey,
){
  const reverseKey = await getReverseKeyFromDomainKey(nameAccount, parent);

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

export async function getReverseKeyFromDomainKey(
  domainKey: PublicKey,
  parent?: PublicKey,
){
  const [REVERSE_LOOKUP_CLASS, _] = await PublicKey.findProgramAddressSync(
    [REGISTER.toBytes()],
    REGISTER
  )
  const hashedReverseLookup = getHashedNameSync(domainKey.toBase58());
  const reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    REVERSE_LOOKUP_CLASS,
    parent,
  );
  return reverseLookupAccount;
};



export function createDomainInstruction(
  nameAccount: PublicKey,
  reverseLookup: PublicKey,
  centralState: PublicKey,
  buyer: PublicKey,
  domainOwner: PublicKey,
  feePayer: PublicKey,
  referrerAccountOpt: PublicKey | null,
  name: string,
  // lamports: Numberu64,
  space: Numberu32
): TransactionInstruction {
  // 1. 构造指令数据
  const buffers = [
    Buffer.from(Uint8Array.from([13])),
    new Numberu32(Buffer.from(name).length).toBuffer(),
    Buffer.from(name, 'utf8'),
    space.toBuffer(),
    Buffer.from([0]),
  ];

  const data = Buffer.concat(buffers)

  console.log("Serialized buffer:", data);


  // 2. 构建账户列表 (严格按程序要求的顺序)
  const keys = [
    // 基础账户
    { pubkey: NAME_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: ROOT_DOMAIN_ACCOUNT, isSigner: false, isWritable: false },
    { pubkey: nameAccount, isSigner: false, isWritable: true },
    { pubkey: reverseLookup, isSigner: false, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: centralState, isSigner: false, isWritable: false },
    
    // 签名账户
    { pubkey: buyer, isSigner: true, isWritable: true },
    { pubkey: domainOwner, isSigner: false, isWritable: false },
    { pubkey: feePayer, isSigner: true, isWritable: true },
    
    // 状态账户
    { pubkey: PublicKey.default, isSigner: false, isWritable: true },
    { pubkey: PublicKey.default, isSigner: false, isWritable: false },
    { pubkey: vault, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: rentSysvarPublicKey, isSigner: false, isWritable: false },
    { pubkey: PublicKey.default, isSigner: false, isWritable: false },
  ];

  // 3. 处理可选账户
  if (referrerAccountOpt) {
    keys.push({
      pubkey: referrerAccountOpt,
      isSigner: false,
      isWritable: true,
    });
  } else {
    // 如果不提供可选账户，填充默认值
    keys.push({
      pubkey: PublicKey.default,
      isSigner: false,
      isWritable: false,
    });
  }

  // 4. 创建指令
  return new TransactionInstruction({
    programId: REGISTER,
    keys,
    data,
  });
}


//--------------------function 1-------------------

export const ROOT_DOMAIN_ACCOUNT = new PublicKey(
    "2ELNsRn2XaqMXZBsRicAcpbksXeC8qn5AiCcnRHbjroP",
  );

export const NAME_PROGRAM_ID = new PublicKey(
  "8YXaA8pzJ4xVPjYY8b5HkxmPWixwpZu7gVcj8EvHxRDC",
);

const REGISTER = new PublicKey("E8AHgynPE6GrUmMDPcYryfAD6akXqpiQ29ME2ZBNkDZ2")

const RECORD = new PublicKey("J5EgeEXm3Y7Bqi51GSCBeY7bsvnQhKnWr2Lc94B95xdQ");

const rentSysvarPublicKey = new PublicKey('SysvarRent111111111111111111111111111111111');

const vault = new PublicKey("2NFji3XWVs2tb8btmGgkunjA9AFTr5x3DaTbsrZ7abGh");





  export enum RecordVersion {
    V1 = 1,
    V2 = 2,
  }
  
  export const getDomainKeySync = (domain: string, record?: RecordVersion) => {
    //remove suffix
    if (domain.endsWith(".sol")) {
      domain = domain.slice(0, -4);
    }

    //origin: 2pMnqHvei2N5oDcVGCRdZx48gqti199wr5CsyTTafsbo
    const recordClass =
      record === RecordVersion.V2 ? CENTRAL_STATE_SNS_RECORDS : undefined;
    //
    const splitted = domain.split(".");
    //like fmc.aaa.sol
    if (splitted.length === 2) {
      //get record version --- 0 means no record
      const prefix = Buffer.from([record ? record : 0]).toString();

      //0x01fmc
      const sub = prefix.concat(splitted[0]);
      //get The highest-level domain a user can create
      const { pubkey: parentKey } = _deriveSync(splitted[1]);
      //get the record accouts or sub domain's PDA
      const result = _deriveSync(sub, parentKey, recordClass);
      return { ...result, isSub: true, parent: parentKey };
    } else if (splitted.length === 3 && !!record) {
      //like i.fmc.aaa.sol
      //     0 1   2

      // Parent key(the common domain account)
      const { pubkey: parentKey } = _deriveSync(splitted[2]);
      // Sub domain(if is the level 3-  the num should be 0)
      const { pubkey: subKey } = _deriveSync("\0".concat(splitted[1]), parentKey);
      // Sub record
      const recordPrefix = record === RecordVersion.V2 ? `\x02` : `\x01`;
      const result = _deriveSync(
        recordPrefix.concat(splitted[0]),
        subKey,
        recordClass,
      );
      return { ...result, isSub: true, parent: parentKey, isSubRecord: true };
    } else if (splitted.length >= 3) {
      throw new Error("The domain is malformed");
    }
    const result = _deriveSync(domain, ROOT_DOMAIN_ACCOUNT);
    return { ...result, isSub: false, parent: undefined };
  };


  export const getNameAccountKeySync = (
    hashed_name: Buffer,
    nameClass?: PublicKey,
    nameParent?: PublicKey,
  ): PublicKey => {
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
      NAME_PROGRAM_ID,
    );
    return nameAccountKey;
  };

  export const getRecordV2Key = (domain: string, record: Record): PublicKey => {
    // get the parent key
    const { pubkey } = getDomainKeySync(domain);
    // means it's v2 record 
    const hashed = getHashedNameSync(record as string);
    return getNameAccountKeySync(hashed, CENTRAL_STATE_SNS_RECORDS, pubkey);
  };


  const _deriveSync = (
    name: string,
    parent: PublicKey = ROOT_DOMAIN_ACCOUNT,
    classKey?: PublicKey,
  ) => {
    let hashed = getHashedNameSync(name);
    let pubkey = getNameAccountKeySync(hashed, classKey, parent);
    return { pubkey, hashed };
  };

  export const HASH_PREFIX = "SPL Name Service";

  export const getHashedNameSync = (name: string): Buffer => {
    const input = HASH_PREFIX + name;
    const hashedHex = sha256(input);
    const hashedBuffer = Buffer.from(hashedHex, "hex");
    console.log(hashedBuffer.length);
    return hashedBuffer;
  };

//this is the types that record can be
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
  }

  


  //------------------------------ function 2 -----------------

  export async function getAllDomains(
    connection: Connection,
    wallet: PublicKey,
  ): Promise<PublicKey[]> {
    const filters = [
      {
        memcmp: {
          offset: 32,
          bytes: wallet.toBase58(),
        },
      },
      {
        memcmp: {
          offset: 0,
          bytes: ROOT_DOMAIN_ACCOUNT.toBase58(),
        },
      },
    ];
    const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
      filters,
      // Only the public keys matter, not the data
      dataSlice: { offset: 0, length: 0 },
    });
    return accounts.map((a) => a.pubkey);
  }


  async function getCid(domain: string, connection: Connection){
    const a = [Record.IPFS]
    const re = getMultipleRecordsV2(connection, domain, a);
    return re;
  }

  export async function getMultipleRecordsV2(
    connection: Connection,
    domain: string,
    records: Record[],
    options: GetRecordV2Options = {},
  ): Promise<(RecordResult | undefined)[]> {
    const pubkeys = records.map((record) => getRecordV2Key(domain, record));
    const retrievedRecords = await SnsRecord.retrieveBatch(connection, pubkeys);
  
    if (options.deserialize) {
      return retrievedRecords.map((e, idx) => {
        if (!e) return undefined;
        return {
          retrievedRecord: e,
          record: records[idx],
          deserializedContent: deserializeRecordV2Content(
            e.getContent(),
            records[idx],
          ),
        };
      });
    }
  
    return retrievedRecords.map((e, idx) => {
      if (!e) return undefined;
      return {
        retrievedRecord: e,
        record: records[idx],
      };
    });
  }

  export interface GetRecordV2Options {
    deserialize?: boolean;
  }

  export interface RecordResult {
    retrievedRecord: SnsRecord;
    record: Record;
    deserializedContent?: string;
  }

  import { Record as SnsRecord } from "@bonfida/sns-records";
  import { deserializeRecordV2Content } from "@bonfida/spl-name-service";


  