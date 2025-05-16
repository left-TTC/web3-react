import { Schema, deserialize } from "borsh";
import { Connection, PublicKey } from "@solana/web3.js";

export enum Validation {
  None = 0,
  Solana = 1,
  Ethereum = 2,
  UnverifiedSolana = 3,
}

export const RECORD_DATA_LEN = 96;

export const getValidationLength = (validation: Validation) => {
  switch (validation) {
    case Validation.None:
      return 0;
    case Validation.Ethereum:
      return 20;
    case Validation.Solana:
      return 32;
    case Validation.UnverifiedSolana:
      return 32;
    default:
      throw new Error("Invalid validation enum");
  }
};

export class RecordHeaderState {
  stalenessValidation: number;
  rightOfAssociationValidation: number;
  contentLength: number;

  static schema: Schema = {
    struct: {
      stalenessValidation: "u16",
      rightOfAssociationValidation: "u16",
      contentLength: "u32",
    },
  };

  static LEN = 8; // 2 + 2 + 4 bytes

  constructor(obj: {
    stalenessValidation: number;
    rightOfAssociationValidation: number;
    contentLength: number;
  }) {
    this.stalenessValidation = obj.stalenessValidation;
    this.rightOfAssociationValidation = obj.rightOfAssociationValidation;
    this.contentLength = obj.contentLength;
  }

  static deserialize(data: Uint8Array): RecordHeaderState {
    return new RecordHeaderState(deserialize(this.schema, data, true) as any);
  }

  static async retrieve(
    connection: Connection,
    address: PublicKey
  ): Promise<RecordHeaderState> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
      throw new Error("Record header account not found");
    }

    return this.deserialize(
      accountInfo.data.slice(
        RECORD_DATA_LEN,
        RECORD_DATA_LEN + this.LEN
      )
    );
  }
}

export class RecordState {
  header: RecordHeaderState;
  data: Uint8Array;

  constructor(header: RecordHeaderState, data: Uint8Array) {
    this.data = data;
    this.header = header;
  }

  static deserialize(data: Uint8Array): RecordState {
    const offset = RECORD_DATA_LEN;
    const header = RecordHeaderState.deserialize(
      data.slice(offset, offset + RecordHeaderState.LEN)
    );

    return new RecordState(header, data.slice(offset + RecordHeaderState.LEN));
  }

  static getReadableData(data: Uint8Array): string {
    return new TextDecoder().decode(data);
  }

  static async retrieve(
    connection: Connection,
    address: PublicKey
  ): Promise<RecordState> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
      throw new Error("Record account not found");
    }

    return this.deserialize(accountInfo.data);
  }

  static async retrieveBatch(
    connection: Connection,
    addresses: PublicKey[]
  ): Promise<(RecordState | undefined)[]> {
    const accounts = await connection.getMultipleAccountsInfo(addresses);
    
    return accounts.map(account => 
      account ? this.deserialize(account.data) : undefined
    );
  }

  getContent(): Uint8Array {  
    const startOffset =
      getValidationLength(this.header.stalenessValidation) +
      getValidationLength(this.header.rightOfAssociationValidation);

    return this.data.slice(startOffset);
  }

  getStalenessId(): Uint8Array {
    const endOffset = getValidationLength(this.header.stalenessValidation);
    return this.data.slice(0, endOffset);
  }

  getRoAId(): Uint8Array {
    const startOffset = getValidationLength(this.header.stalenessValidation);
    const endOffset =
      startOffset +
      getValidationLength(this.header.rightOfAssociationValidation);

    return this.data.slice(startOffset, endOffset);
  }
}