import { Schema, deserialize } from "borsh";

import {
    Address,
    GetAccountInfoApi,
    GetMultipleAccountsApi,
    Rpc,
    fetchEncodedAccount,
    fetchEncodedAccounts,
  } from "@solana/kit";

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

    // The total length of the struct is calculated as the sum of:
    // - `stalenessValidation`: 2 bytes (`u16`)
    // - `rightOfAssociationValidation`: 2 bytes (`u16`)
    // - `contentLength`: 4 bytes (`u32`)
    static LEN = 8;

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
        rpc: Rpc<GetAccountInfoApi>,
        address: Address
    ): Promise<RecordHeaderState> {
        const recordHeaderAccount = await fetchEncodedAccount(rpc, address);

        if (!recordHeaderAccount.exists) {
        throw new Error("Record header account not found");
        }

        return this.deserialize(
        recordHeaderAccount.data.slice(
            RECORD_DATA_LEN,
            RECORD_DATA_LEN + this.LEN
        )
        );
    }
}