/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/auction.json`.
 */
export type Auction = {
  "address": "9avSzeSypv1UnYMJX5Rjp9NrCJGCqxhPwPtaG9mpvcyz",
  "metadata": {
    "name": "auction",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addFunding",
      "discriminator": [
        26,
        98,
        31,
        139,
        109,
        181,
        179,
        134
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "address": "2NFji3XWVs2tb8btmGgkunjA9AFTr5x3DaTbsrZ7abGh"
        },
        {
          "name": "web3NameService",
          "address": "7jCvwtaAUda4SMYh24uuAS8nCYxDaKv5EuaP3qvXJYPs"
        },
        {
          "name": "crowdingAccountLists",
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
        },
        {
          "name": "allRootRecordAccount",
          "writable": true
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
          "name": "willCreateRoot",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "add",
          "type": "u64"
        },
        {
          "name": "fundingName",
          "type": "string"
        }
      ]
    },
    {
      "name": "createFunding",
      "discriminator": [
        172,
        83,
        73,
        92,
        146,
        70,
        36,
        140
      ],
      "accounts": [
        {
          "name": "willCreateRoot"
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
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
        },
        {
          "name": "vault",
          "writable": true,
          "address": "2NFji3XWVs2tb8btmGgkunjA9AFTr5x3DaTbsrZ7abGh"
        }
      ],
      "args": [
        {
          "name": "rootName",
          "type": "string"
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
