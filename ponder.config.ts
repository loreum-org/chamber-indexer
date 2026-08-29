import { parseAbiItem } from "abitype";
import { createConfig, factory } from "ponder";
import type { Address } from "viem";
import { http, isAddress } from "viem";

import { ChamberAbi } from "./abis/ChamberAbi";
import { FactoryAbi } from "./abis/FactoryAbi";
import { RegistryAbi } from "./abis/RegistryAbi";

/**
 * Sepolia sources — must match loreum-org/chamber `contracts/deployments/sepolia.txt`
 * (loreum-org/chamber#159).
 *
 * Registry (May 2, 2026 TransparentUpgradeableProxy, DeployRegistry broadcast
 * block 0xa47447 / 10777671). This is the Registry the Chamber app uses.
 * Five `createChamber` txs: 10777917, 10778003, 10789272, 10903741, 10967086.
 *
 * Factory (Aug 26, 2026, DeployFactory broadcast block 0xb08ff1 / 11571185,
 * tx 0x6e87eb26fe311dfa2b73a0ad10865e3abc631d53ee0abd4ed18a69098bc0c614).
 * Create uses this as the in-repo default after chamber#147. No `createChamber`
 * yet — `factory_ChamberCreateds` stays 0 until someone creates. Indexed by
 * default so new Factory chambers appear without a Railway env change.
 *
 * Legacy Registry (not indexed): 0xB028110234375A368Aa0b5fFB138ae1dDfb0b4cc
 * from 7453704, one `createChamber` at 7453727. Override
 * PONDER_REGISTRY_* to index it instead.
 *
 * RPC: set PONDER_RPC_URL_11155111 to a dedicated Alchemy/Infura Sepolia
 * HTTPS URL (not an origin-locked frontend key, not publicnode).
 * `https://ethereum-sepolia-rpc.publicnode.com` rejects eth_getLogs wider
 * than 50_000 blocks (`exceed maximum block range: 50000`) and can return
 * `[]` for ranges that have events. Ponder then marks sepolia ready with
 * an empty directory.
 */
const DEFAULT_REGISTRY_ADDRESS =
  "0x7AECf59eAD4B054A58bD42Af8704d381FdD9E821" as const;
const DEFAULT_REGISTRY_START_BLOCK = 10_777_671;

const DEFAULT_FACTORY_ADDRESS =
  "0x43aA92c8A26392f21F63cdA88B6BaB5031C40550" as const;
const DEFAULT_FACTORY_START_BLOCK = 11_571_185;

const registryAddress = addressFromEnv(
  process.env.PONDER_REGISTRY_ADDRESS,
  DEFAULT_REGISTRY_ADDRESS,
  "PONDER_REGISTRY_ADDRESS",
);
const registryStartBlock = blockFromEnv(
  process.env.PONDER_REGISTRY_START_BLOCK,
  DEFAULT_REGISTRY_START_BLOCK,
  "PONDER_REGISTRY_START_BLOCK",
);

const factoryAddress = addressFromEnv(
  process.env.PONDER_FACTORY_ADDRESS,
  DEFAULT_FACTORY_ADDRESS,
  "PONDER_FACTORY_ADDRESS",
);
const factoryStartBlock = blockFromEnv(
  process.env.PONDER_FACTORY_START_BLOCK,
  DEFAULT_FACTORY_START_BLOCK,
  "PONDER_FACTORY_START_BLOCK",
);

const registryChamberCreatedEvent = parseAbiItem(
  "event ChamberCreated(address indexed chamber, uint256 seats, string name, string symbol, address erc20Token, address erc721Token)",
);

const factoryChamberCreatedEvent = parseAbiItem(
  "event ChamberCreated(address indexed chamber, address indexed asset, address indexed nft, uint256 seats, string name, string symbol, address creator)",
);

function addressFromEnv(
  value: string | undefined,
  fallback: Address,
  envName: string,
): Address {
  if (value === undefined || value.trim() === "") return fallback;
  const trimmed = value.trim();
  if (!isAddress(trimmed)) {
    throw new Error(
      `Invalid ${envName} '${trimmed}'. Expected a 20-byte hex address.`,
    );
  }
  return trimmed;
}

function blockFromEnv(
  value: string | undefined,
  fallback: number,
  envName: string,
): number {
  if (value === undefined || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(
      `Invalid ${envName} '${value}'. Expected a non-negative integer.`,
    );
  }
  return parsed;
}

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_11155111),
    },
  },
  contracts: {
    Registry: {
      abi: RegistryAbi,
      network: {
        sepolia: {
          address: registryAddress,
        },
      },
      startBlock: registryStartBlock,
    },
    Factory: {
      abi: FactoryAbi,
      network: {
        sepolia: {
          address: factoryAddress,
          startBlock: factoryStartBlock,
        },
      },
      startBlock: factoryStartBlock,
    },
    Chamber: {
      abi: ChamberAbi,
      network: {
        sepolia: {
          address: factory({
            address: registryAddress,
            event: registryChamberCreatedEvent,
            parameter: "chamber",
          }),
        },
      },
      startBlock: registryStartBlock,
    },
    // Same Chamber ABI, discovered from Factory ChamberCreated (different event).
    // Ponder 0.8 accepts one factory() per contract, so this is a second source.
    FactoryChamber: {
      abi: ChamberAbi,
      network: {
        sepolia: {
          address: factory({
            address: factoryAddress,
            event: factoryChamberCreatedEvent,
            parameter: "chamber",
          }),
          startBlock: factoryStartBlock,
        },
      },
      startBlock: factoryStartBlock,
    },
  },
});
