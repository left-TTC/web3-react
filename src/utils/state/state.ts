// import { IdlAccounts, Program, Provider } from "@coral-xyz/anchor";
// import { Web3NameService } from "../../anchor/nameService/idl";
// import idl from "../../anchor/nameService/IDL.json";
// import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

// const programId = new PublicKey("BWK7ZQWjQ9fweneHfsYmof7znPr5GyedCWs2J8JhHxD3");
// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// export const program = new Program<Web3NameService>(idl, programId, {
//     connection,
//   });

// export const [counterPDA] = PublicKey.findProgramAddressSync(
//     [Buffer.from("counter")],
//     program.programId,
// );