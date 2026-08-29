# chamber-indexer

Ponder indexer for [loreum-org/chamber](https://github.com/loreum-org/chamber) on Sepolia. Hosts the Chamber directory GraphQL the app will consume (chamber#144 is wiring; this repo is discovery).

## What it indexes

Defaults match `contracts/deployments/sepolia.txt` in loreum-org/chamber.

| Source | Address | Start block | Why |
| --- | --- | --- | --- |
| Registry (May 2, 2026 proxy) | `0x7AECf59eAD4B054A58bD42Af8704d381FdD9E821` | `10777671` | App / `sepolia.txt` Registry. Five `createChamber` txs (blocks 10777917, 10778003, 10789272, 10903741, 10967086). |
| Factory (Aug 26, 2026) | `0x43aA92c8A26392f21F63cdA88B6BaB5031C40550` | `11571185` | Create’s in-repo default after chamber#147. No `createChamber` yet. |

Factory is on by default so a later Factory create is indexed without a Railway env change. `factory_ChamberCreateds.totalCount` stays `0` until someone creates.

**Not indexed:** 2025 legacy Registry `0xB028110234375A368Aa0b5fFB138ae1dDfb0b4cc` (start `7453704`, one chamber at `7453727`). Set `PONDER_REGISTRY_*` to point at it if you need that row.

## RPC (required for a non-empty directory)

Ponder 0.8 has no `maxBlockRange` knob. It will retry on a recognized “range too wide” error, but a node that **returns `[]` for ranges that have logs** will mark Sepolia ready with zero chambers.

**Set `PONDER_RPC_URL_11155111` to a dedicated Alchemy or Infura Sepolia HTTPS URL.**

Do not use:

- `https://ethereum-sepolia-rpc.publicnode.com` — `eth_getLogs` wider than 50_000 blocks fails (`exceed maximum block range: 50000`). Historical `eth_getLogs` on that host can also return `[]` for known `ChamberCreated` ranges; receipts for those txs can be missing while `eth_blockNumber` is at the tip.
- Origin-locked frontend keys (`VITE_*` / Next.js browser Alchemy apps).

A temporary public RPC that *can* return the five Registry logs (not for production load): `https://gateway.tenderly.co/public/sepolia` or `https://ethereum-sepolia.publicnode.com` (no `-rpc` infix; still 50k-capped).

## Railway (production)

Service: `chamber-indexer` on Loreum.org. Host: `https://chamber-indexer-production.up.railway.app`.

After this config is deployed, a human must set (values except the RPC secret):

| Variable | Value |
| --- | --- |
| `PONDER_RPC_URL_11155111` | Dedicated Alchemy/Infura Sepolia HTTPS URL (secret) |

Address/start defaults are in `ponder.config.ts`. Override only if you intend a different source:

| Variable | Default (no need to set) |
| --- | --- |
| `PONDER_REGISTRY_ADDRESS` | `0x7AECf59eAD4B054A58bD42Af8704d381FdD9E821` |
| `PONDER_REGISTRY_START_BLOCK` | `10777671` |
| `PONDER_FACTORY_ADDRESS` | `0x43aA92c8A26392f21F63cdA88B6BaB5031C40550` |
| `PONDER_FACTORY_START_BLOCK` | `11571185` |

Changing Registry/Factory address or start block creates new Ponder filters, so historical intervals should rebuild on deploy. If `_meta.status.sepolia.ready` is true and GraphQL is still empty, the previous publicnode backfill cached empty intervals — drop the Ponder Postgres schema (or the volume) and restart.

## Acceptance (after reindex)

```graphql
{
  chambers { totalCount }
  registry_ChamberCreateds { totalCount }
  factory_ChamberCreateds { totalCount }
  _meta { status }
}
```

| Field | Expected |
| --- | --- |
| `registry_ChamberCreateds.totalCount` | `5` |
| `chambers.totalCount` | `≥ 5` |
| `factory_ChamberCreateds.totalCount` | `0` until a Factory create |
| `_meta.status.sepolia.ready` | `true` |

## Local

```bash
cp .env.example .env.local   # set PONDER_RPC_URL_11155111
pnpm install
pnpm dev                     # or: pnpm start --schema local
```

`ponder start` requires `--schema` or `DATABASE_SCHEMA` (Ponder 0.8). Production already sets this.

`GET /health` and `GET /ready` are Ponder’s process probes (200 with an empty body). Use GraphQL `_meta.status.sepolia.ready` for sync.

Verified in this change with `PONDER_RPC_URL_11155111=https://gateway.tenderly.co/public/sepolia` and `pnpm start --schema local`: historical sync finished in ~8s, `registry_ChamberCreateds.totalCount` = 5, `chambers.totalCount` = 5, `factory_ChamberCreateds.totalCount` = 0.

## Out of scope

- Wiring loreum-org/chamber to this host (chamber#144 / draft #151).
- Landing copy (chamber#158).
