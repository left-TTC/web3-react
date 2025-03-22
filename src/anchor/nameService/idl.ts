/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/web3_name_service.json`.
 */
export type Web3NameService = {
    "address": "BWK7ZQWjQ9fweneHfsYmof7znPr5GyedCWs2J8JhHxD3",
    "metadata": {
      "name": "web3NameService",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "create",
        "discriminator": [
          24,
          30,
          200,
          40,
          5,
          28,
          7,
          119
        ],
        "accounts": [
          {
            "name": "nameAccount",
            "writable": true
          },
          {
            "name": "systemAccount",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "payer",
            "signer": true
          },
          {
            "name": "domainClass",
            "signer": true
          },
          {
            "name": "rootDomainOpt",
            "signer": true,
            "optional": true
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": {
                "name": "baseData"
              }
            }
          }
        ]
      },
      {
        "name": "delete",
        "discriminator": [
          165,
          204,
          60,
          98,
          134,
          15,
          83,
          134
        ],
        "accounts": [
          {
            "name": "nameAccount"
          },
          {
            "name": "submitAccount",
            "signer": true
          },
          {
            "name": "refundTarget"
          }
        ],
        "args": []
      },
      {
        "name": "transfer",
        "discriminator": [
          163,
          52,
          200,
          231,
          140,
          3,
          69,
          186
        ],
        "accounts": [
          {
            "name": "class",
            "signer": true
          },
          {
            "name": "nameAccount"
          },
          {
            "name": "submitAccount",
            "signer": true
          },
          {
            "name": "rootDomainAccount"
          }
        ],
        "args": [
          {
            "name": "transfer",
            "type": {
              "defined": {
                "name": "transferInfo"
              }
            }
          }
        ]
      },
      {
        "name": "update",
        "discriminator": [
          219,
          200,
          88,
          176,
          158,
          63,
          253,
          127
        ],
        "accounts": [
          {
            "name": "nameAccount"
          },
          {
            "name": "nameUpdateSigner",
            "signer": true
          },
          {
            "name": "rootDomain",
            "signer": true,
            "optional": true
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": {
                "name": "updateData"
              }
            }
          }
        ]
      }
    ],
    "types": [
      {
        "name": "baseData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "lamports",
              "type": "u64"
            },
            {
              "name": "hashedName",
              "type": "bytes"
            },
            {
              "name": "space",
              "type": "u32"
            },
            {
              "name": "owner",
              "type": "pubkey"
            },
            {
              "name": "ipfs",
              "type": {
                "option": "bytes"
              }
            }
          ]
        }
      },
      {
        "name": "transferInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "pubkey"
            }
          ]
        }
      },
      {
        "name": "updateData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "ipfs",
              "type": "bytes"
            }
          ]
        }
      }
    ]
  };
  