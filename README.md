# chamber-indexer

Ponder indexer for [loreum-org/chamber](https://github.com/loreum-org/chamber) on Sepolia. The Chamber app reads display state from this GraphQL API; it calls the chain directly only to check parameters and send a transaction.

## State tables

On each Chamber event the indexer re-reads the chamber's own views at that block (`src/lib/state.ts`, through Multicall3) and upserts current state. Board ranking, quorum and proposal status therefore match the contract instead of being re-derived in TypeScript. Views missing from older implementations are stored as `null`.

| Table | Refreshed on | Source views |
| --- | --- | --- |
| `chamber` | vault, seat, proposal submit/execute, pause, upgrade events | `totalAssets`, `totalSupply`, `getQuorum`, `getSeats`, `getSize`, `getReachableDirectorCount`, `getTransactionCount`, `paused`, `VERSION`, ETH balance, ERC-1967 slot |
| `boardSeat` | Delegate / Undelegate, seat events, executed proposals, membership NFT Transfer of a board tokenId | `getTop(getSize())`, `ownerOf`, `getSeatedAt` |
| `delegation` | DelegationUpdated, Delegate, Undelegate | event amount / `getHolderDelegation` |
| `proposal` | submit, deadline, metadata, confirm, revoke, cancel, execute | `getTransaction`, `getCancelled`, `getCancelConfirmations`, `getTransactionDeadline`, `getTransactionRequiredQuorum`, `getTransactionMetadata`, `getTransactionCalldata` (falls back to SubmitTransaction `data`) |
| `proposalVote` | ConfirmTransaction, RevokeConfirmation, CancelTransaction | `getConfirmation`, `getCancelConfirmation` |
| `seatUpdate` | SetSeats, ExecuteSetSeats, SeatUpdateCancelled, SeatsRecovered, InertSeatCleaned, executed proposals | `getSeatUpdate` |
| `directorOperator` | DirectorOperatorSet | event + `getDirectorOperatorScope`, `getDirectorOperatorLiveAt` |
| `chamberHolder` | share Transfer | event |
| `chamberEvent` | every Chamber event | event args as JSON |

Time-based checks (proposal expiry, seating maturity, session-key liveness) are left to the client: compare stored `deadline` / `seatedAt` / `liveAt` with the head from `_meta { status }`. See `src/chamber.graphql` for the queries the app uses.

`abis/ChamberAbi.ts` is generated from the chamber repo's forge build; regenerate it when the contract events or views change.

## What it indexes

Defaults match `contracts/deployments/sepolia.txt` in loreum-org/chamber.

| Source | Address | Start block | Why |
| --- | --- | --- | --- |
| Registry (May 2, 2026 proxy) | `0x7AECf59eAD4B054A58bD42Af8704d381FdD9E821` | `10777671` | App / `sepolia.txt` Registry. Five `createChamber` txs (blocks 10777917, 10778003, 10789272, 10903741, 10967086). |
| Factory (Aug 26, 2026) | `0x43aA92c8A26392f21F63cdA88B6BaB5031C40550` | `11571185` | Create’s in-repo default after chamber#147. |

Each chamber's membership NFT is also indexed (`RegistryNft` / `FactoryNft`): directors change on ERC-721 transfer with no Chamber event.

Factory is on by default so a later Factory create is indexed without a Railway env change.

**Not indexed:** 2025 legacy Registry `0xB028110234375A368Aa0b5fFB138ae1dDfb0b4cc` (start `7453704`, one chamber at `7453727`). Set `PONDER_REGISTRY_*` to point at it if you need that row.

## RPC (required for a non-empty directory)

Ponder 0.8 has no `maxBlockRange` knob. It will retry on a recognized “range too wide” error, but a node that **returns `[]` for ranges that have logs** will mark Sepolia ready with zero chambers.

**Set `PONDER_RPC_URL_11155111` to a dedicated Alchemy or Infura Sepolia HTTPS URL.**

Do not use:

- `https://ethereum-sepolia-rpc.publicnode.com` — `eth_getLogs` wider than 50_000 blocks fails (`exceed maximum block range: 50000`). Historical `eth_getLogs` on that host can also return `[]` for known `ChamberCreated` ranges; receipts for those txs can be missing while `eth_blockNumber` is at the tip.
- Origin-locked frontend keys (`VITE_*` / Next.js browser Alchemy apps).

A temporary public RPC that *can* return the five Registry logs (not for production load): `https://gateway.tenderly.co/public/sepolia` or `https://ethereum-sepolia.publicnode.com` (no `-rpc` infix; still 50k-capped).

**RPC cost:** state refreshes add a few `eth_call`s (one Multicall3 batch) per indexed event, made once by the indexer rather than by every open browser tab. Ponder caches them, so a re-sync against a warm cache does not repeat them.

## Railway (production)

Service: `chamber-indexer` on Loreum.org. Host: `https://chamber-indexer-production.up.railway.app`.

After this config is deployed, a human must set (values except the RPC secret). This schema adds tables, so the deploy re-syncs from the start blocks.

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
| `factory_ChamberCreateds.totalCount` | `≥ 1` |
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
