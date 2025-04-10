/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/auction.json`.
 */
export type Auction = {
  "address": "C1z2SrwrPnN5WrhkXNoPnB6KBiCsp22bZJ2RtQfAMhuq",
  "metadata": {
    "name": "auction",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "checkFundingAccount",
      "discriminator": [
        33,
        17,
        89,
        199,
        208,
        99,
        134,
        155
      ],
      "accounts": [
        {
          "name": "web3NameService",
          "address": "EWVnJDmu8CRLPyuHQqxgR1oFB8WhXBXRENRr1skQZxA9"
        },
        {
          "name": "allRootRecordAccount",
          "writable": true
        },
        {
          "name": "willCreateRoot",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "address": "2NFji3XWVs2tb8btmGgkunjA9AFTr5x3DaTbsrZ7abGh"
        },
        {
          "name": "fundraisingStateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  101,
                  98,
                  51,
                  32,
                  65,
                  117,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "willCreateRoot"
              }
            ]
          }
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "crowdingAccountLists",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  110,
                  105,
                  113,
                  117,
                  101,
                  32,
                  119,
                  101,
                  98,
                  51,
                  32,
                  97,
                  117,
                  99,
                  116,
                  105,
                  111,
                  110,
                  32,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  32,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": {
              "name": "crowdInfo"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "crowdfundingAccount",
      "discriminator": [
        74,
        235,
        70,
        131,
        52,
        104,
        31,
        254
      ]
    },
    {
      "name": "fundingAccountRecord",
      "discriminator": [
        242,
        217,
        203,
        165,
        88,
        87,
        153,
        17
      ]
    }
  ],
  "types": [
    {
      "name": "crowdInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rootName",
            "type": "string"
          },
          {
            "name": "paidFees",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "crowdfundingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "raisedAmount",
            "type": "u64"
          },
          {
            "name": "fundingRoot",
            "type": "pubkey"
          },
          {
            "name": "fundingTarget",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "fundingAccountRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "accountLists",
            "type": "bytes"
          }
        ]
      }
    }
  ]
};
