// This file is auto-generated. DO NOT EDIT
import { serialize } from "borsh";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export interface AccountKey {
  pubkey: PublicKey;
  isSigner: boolean;
  isWritable: boolean;
}
export class allocateAndPostRecordInstruction {
  tag: number;
  record: string;
  content: number[];
  static schema = {
    struct: {
      tag: "u8",
      record: "string",
      content: { array: { type: "u8" } },
    },
  };
  constructor(obj: { record: string; content: number[] }) {
    this.tag = 1;
    this.record = obj.record;
    this.content = obj.content;
  }
  serialize(): Uint8Array {
    return serialize(allocateAndPostRecordInstruction.schema, this);
  }
  getInstruction(
    programId: PublicKey,
    systemProgram: PublicKey,
    splNameServiceProgram: PublicKey,
    feePayer: PublicKey,
    record: PublicKey,
    domain: PublicKey,
    domainOwner: PublicKey,
    centralState: PublicKey
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: splNameServiceProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: feePayer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: record,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domain,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domainOwner,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: centralState,
      isSigner: false,
      isWritable: false,
    });
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
export class validateEthereumSignatureInstruction {
  tag: number;
  validation: number;
  signature: number[];
  expectedPubkey: number[];
  static schema = {
    struct: {
      tag: "u8",
      validation: "u8",
      signature: { array: { type: "u8" } },
      expectedPubkey: { array: { type: "u8" } },
    },
  };
  constructor(obj: {
    validation: number;
    signature: number[];
    expectedPubkey: number[];
  }) {
    this.tag = 4;
    this.validation = obj.validation;
    this.signature = obj.signature;
    this.expectedPubkey = obj.expectedPubkey;
  }
  serialize(): Uint8Array {
    return serialize(validateEthereumSignatureInstruction.schema, this);
  }
  getInstruction(
    programId: PublicKey,
    systemProgram: PublicKey,
    splNameServiceProgram: PublicKey,
    feePayer: PublicKey,
    record: PublicKey,
    domain: PublicKey,
    domainOwner: PublicKey,
    centralState: PublicKey
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: splNameServiceProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: feePayer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: record,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domain,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domainOwner,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: centralState,
      isSigner: false,
      isWritable: false,
    });
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
export class allocateRecordInstruction {
  tag: number;
  contentLength: number;
  record: string;
  static schema = {
    struct: {
      tag: "u8",
      contentLength: "u32",
      record: "string",
    },
  };
  constructor(obj: { contentLength: number; record: string }) {
    this.tag = 0;
    this.contentLength = obj.contentLength;
    this.record = obj.record;
  }
  serialize(): Uint8Array {
    return serialize(allocateRecordInstruction.schema, this);
  }
  getInstruction(
    programId: PublicKey,
    systemProgram: PublicKey,
    splNameServiceProgram: PublicKey,
    feePayer: PublicKey,
    record: PublicKey,
    domain: PublicKey,
    domainOwner: PublicKey,
    centralState: PublicKey
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: splNameServiceProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: feePayer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: record,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domain,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domainOwner,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: centralState,
      isSigner: false,
      isWritable: false,
    });
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
export class validateSolanaSignatureInstruction {
  tag: number;
  staleness: boolean;
  static schema = {
    struct: {
      tag: "u8",
      staleness: "bool",
    },
  };
  constructor(obj: { staleness: boolean }) {
    this.tag = 3;
    this.staleness = obj.staleness;
  }
  serialize(): Uint8Array {
    return serialize(validateSolanaSignatureInstruction.schema, this);
  }
  getInstruction(
    programId: PublicKey,
    systemProgram: PublicKey,
    splNameServiceProgram: PublicKey,
    feePayer: PublicKey,
    record: PublicKey,
    domain: PublicKey,
    domainOwner: PublicKey,
    centralState: PublicKey,
    verifier: PublicKey
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: splNameServiceProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: feePayer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: record,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domain,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domainOwner,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: centralState,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: verifier,
      isSigner: true,
      isWritable: true,
    });
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
export class editRecordInstruction {
  tag: number;
  record: string;
  content: number[];
  static schema = {
    struct: {
      tag: "u8",
      record: "string",
      content: { array: { type: "u8" } },
    },
  };
  constructor(obj: { record: string; content: number[] }) {
    this.tag = 2;
    this.record = obj.record;
    this.content = obj.content;
  }
  serialize(): Uint8Array {
    return serialize(editRecordInstruction.schema, this);
  }
  getInstruction(
    programId: PublicKey,
    systemProgram: PublicKey,
    splNameServiceProgram: PublicKey,
    feePayer: PublicKey,
    record: PublicKey,
    domain: PublicKey,
    domainOwner: PublicKey,
    centralState: PublicKey
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: splNameServiceProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: feePayer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: record,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domain,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domainOwner,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: centralState,
      isSigner: false,
      isWritable: false,
    });
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
export class deleteRecordInstruction {
  tag: number;
  static schema = {
    struct: {
      tag: "u8",
    },
  };
  constructor() {
    this.tag = 5;
  }
  serialize(): Uint8Array {
    return serialize(deleteRecordInstruction.schema, this);
  }
  getInstruction(
    programId: PublicKey,
    systemProgram: PublicKey,
    splNameServiceProgram: PublicKey,
    feePayer: PublicKey,
    record: PublicKey,
    domain: PublicKey,
    domainOwner: PublicKey,
    centralState: PublicKey
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: splNameServiceProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: feePayer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: record,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domain,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domainOwner,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: centralState,
      isSigner: false,
      isWritable: false,
    });
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
export class writeRoaInstruction {
  tag: number;
  roaId: number[];
  static schema = {
    struct: {
      tag: "u8",
      roaId: { array: { type: "u8" } },
    },
  };
  constructor(obj: { roaId: number[] }) {
    this.tag = 6;
    this.roaId = obj.roaId;
  }
  serialize(): Uint8Array {
    return serialize(writeRoaInstruction.schema, this);
  }
  getInstruction(
    programId: PublicKey,
    systemProgram: PublicKey,
    splNameServiceProgram: PublicKey,
    feePayer: PublicKey,
    record: PublicKey,
    domain: PublicKey,
    domainOwner: PublicKey,
    centralState: PublicKey
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: splNameServiceProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: feePayer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: record,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domain,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domainOwner,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: centralState,
      isSigner: false,
      isWritable: false,
    });
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
export class unverifyRoaInstruction {
  tag: number;
  static schema = {
    struct: {
      tag: "u8",
    },
  };
  constructor() {
    this.tag = 7;
  }
  serialize(): Uint8Array {
    return serialize(unverifyRoaInstruction.schema, this);
  }
  getInstruction(
    programId: PublicKey,
    systemProgram: PublicKey,
    splNameServiceProgram: PublicKey,
    feePayer: PublicKey,
    record: PublicKey,
    domain: PublicKey,
    centralState: PublicKey,
    verifier: PublicKey
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: splNameServiceProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: feePayer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: record,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: domain,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: centralState,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: verifier,
      isSigner: true,
      isWritable: true,
    });
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}



