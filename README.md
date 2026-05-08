# scripts-solana

Scripts for creating SPL tokens and NFTs on Solana.

---

## Setup

### 1. Add your wallet

Place your devnet wallet keypair at the project root:

```
root/
└── devnet-wallet.json
```

### 2. Install dependencies

```bash
npm install
```

### 3. Copy the env file

```bash
cp .env.example .env
```

By default `.env` points to devnet. See the **Backup** section below if devnet is down.

---

## SPL Token

Run these in order. Each script prints the address or signature you need to paste into the next one.

| Command | What it does |
|---|---|
| `npm run spl:init` | Creates a new mint account |
| `npm run spl:metadata` | Attaches a name, symbol, and URI to the mint |
| `npm run spl:mint` | Creates your token account and mints tokens into it |
| `npm run spl:transfer` | Sends tokens to another wallet |

---

## NFT

Add your image at the project root (`image.jpeg`), then run in order.

> Need a quick rug? Generate one at **https://bergabman.github.io/generug_v2/**, download it, and use that as your NFT image.


| Command | What it does |
|---|---|
| `npm run nft:image` | Uploads your image to Irys, prints the image URI |
| `npm run nft:metadata` | Uploads the metadata JSON to Irys, prints the metadata URI |
| `npm run nft:mint` | Mints the NFT on-chain using the metadata URI |

Paste the URI printed by each step into the next script before running it.

---

## Backup — if devnet is not working

Use **Surfpool** (a local Solana validator) instead of devnet, and the **web app** instead of Irys.

### Step 1 — Upload image and metadata using the web app

Go to **https://nft-uploader-nine.vercel.app**

1. Upload your image → copy the image URL
2. Fill in the metadata form (name, description, traits) → copy the metadata URL
3. Paste the metadata URL into `src/nft/nft_mint.ts`:

```typescript
const metadataUri = "https://nft-uploader-nine.vercel.app/api/metadata/<your-id>";
```

Skip `nft:image` and `nft:metadata` entirely — go straight to `nft:mint`.

---

### Step 2 — Switch to Surfpool (local validator, backup for devnet)

**Edit `.env`** — comment out devnet and uncomment Surfpool:

```bash
# SOLANA_RPC_URL=https://api.devnet.solana.com
# SOLANA_WS_URL=wss://api.devnet.solana.com

SOLANA_RPC_URL=http://127.0.0.1:8899
SOLANA_WS_URL=ws://127.0.0.1:8900
```

**Switch Solana CLI to localnet:**

```bash
solana config set --url localhost
```

**Start Surfpool:**

```bash
surfpool start
```

**Fund your wallet on localnet:**

```bash
solana airdrop 5 devnet-wallet.json
```

**Run the mint:**

```bash
npm run nft:mint
```

**Check your NFT** on Metaplex Explorer (make sure to select `localhost` as the network):
https://core.metaplex.com/explorer/<asset-address>?env=localhost

> Note: Surfpool resets every time it restarts — you'll need to airdrop SOL again each session.
