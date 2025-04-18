/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/web3_name_service.json`.
 */
export type Web3NameService = {
  "address": "77tWhvBTKvZVHudKKLV9EpzwFoTrGAJL9gwuNUA9MaRY",
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
          "name": "recordAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "data.owner"
              },
              {
                "kind": "arg",
                "path": "data.root"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "rootDomainOpt",
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
          "name": "nameAccount",
          "writable": true
        },
        {
          "name": "nameUpdateSigner",
          "signer": true
        },
        {
          "name": "rootDomain"
        }
      ],
      "args": [
        {
          "name": "updateIpfs",
          "type": {
            "array": [
              "u8",
              46
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "nameAccount",
      "discriminator": [
        3,
        176,
        39,
        53,
        115,
        8,
        84,
        81
      ]
    },
    {
      "name": "recordAccount",
      "discriminator": [
        228,
        61,
        107,
        126,
        20,
        6,
        79,
        241
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
            "name": "name",
            "type": "string"
          },
          {
            "name": "root",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "hasedName",
            "type": "bytes"
          },
          {
            "name": "ipfs",
            "type": {
              "option": {
                "array": [
                  "u8",
                  46
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "nameAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "root",
            "type": "pubkey"
          },
          {
            "name": "ipfs",
            "type": {
              "option": {
                "array": [
                  "u8",
                  46
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "recordAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "root",
            "type": "pubkey"
          },
          {
            "name": "domains",
            "type": "bytes"
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
    }
  ]
};
