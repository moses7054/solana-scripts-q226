import "dotenv/config";
import { address, appendTransactionMessageInstruction, appendTransactionMessageInstructions, assertIsTransactionWithBlockhashLifetime, createKeyPairSignerFromBytes, createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, getSignatureFromTransaction, sendAndConfirmTransactionFactory, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners } from "@solana/kit";
import wallet from "../../devnet-wallet.json";
import { findAssociatedTokenPda, getCreateAssociatedTokenInstructionAsync, getMintToInstruction, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";

const rpc = createSolanaRpc(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com");

const token_decimals = 1_000_000n;

//paste your mint address got from spl_init.ts
const mint = address("Hbf5fkVGzcxqwdhHbdMjD5UBTZ6LuGvx689UnAEoUfy9");

(async () => {

    try {
        const signer = await createKeyPairSignerFromBytes(
            new Uint8Array(wallet)
        );

    const [ata] = await findAssociatedTokenPda({
        mint,
        owner: signer.address,
        tokenProgram: TOKEN_PROGRAM_ADDRESS
    })
    console.log(`Your ata is : ${ata}`)

    const createAtaIx = await getCreateAssociatedTokenInstructionAsync({
        payer: signer,
        mint,
        owner: signer.address
    });

    const mintToIx = getMintToInstruction({
        mint,
        token: ata,
        mintAuthority: signer,
        amount: 1n * token_decimals
    });

    const {value: latestBlockhash} = await rpc.getLatestBlockhash().send();

    const msg = createTransactionMessage({ version: 0});
    
    const msgWithPayer = setTransactionMessageFeePayerSigner(signer, msg);
    
    const msgWithLiftime = setTransactionMessageLifetimeUsingBlockhash(
            latestBlockhash,
            msgWithPayer
        )

    const txMessage = appendTransactionMessageInstructions(
        [createAtaIx, mintToIx],
        msgWithLiftime
    )

    const signedTx = await signTransactionMessageWithSigners(txMessage);

    assertIsTransactionWithBlockhashLifetime(signedTx);
    
    const signature = getSignatureFromTransaction(signedTx);

    const sendAndConfirm = sendAndConfirmTransactionFactory({
            rpc, rpcSubscriptions
        });
    
        
    await sendAndConfirm(signedTx, {commitment: "confirmed"});

    console.log(`mint txid: ${signature}`);
    }
    catch (error)
    {
        console.log(error);
    }
    
})()



// Your ata is : 6obyKFZ1DcS7HTFkEkdYzxWUmuTBcF2WvTR6ANQBW3F4
// mint txid: 3NAyN6JZFXGWqAdhaR7Uxex1s1uFKmYtQQTN8mZA4HQh93Q9EM7ZyHS1MYg3gXbEyTNUWYKZPs4Nc3Rfg8kGaimP