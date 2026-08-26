import { parseAbiItem } from "abitype";
import { createConfig, factory } from "ponder";
import type { Address } from "viem";
import { http, isAddress } from "viem";

import { ChamberAbi } from "./abis/ChamberAbi";
import { FactoryAbi } from "./abis/FactoryAbi";
import { RegistryAbi } from "./abis/RegistryAbi";

/**
 * Sepolia Registry (legacy discovery). Factory is not deployed yet
 * (loreum-org/chamber#138). Set these to index Factory deploys:
 *
 *   PONDER_FACTORY_ADDRESS=0x...
 *   PONDER_FACTORY_START_BLOCK=7453704   # optional; defaults to Registry start
 *
 * When PONDER_FACTORY_ADDRESS is unset, Factory / FactoryChamber sources
 * are omitted so `ponder dev` still runs Registry-only.
 */
const REGISTRY_ADDRESS = "0xB028110234375A368Aa0b5fFB138ae1dDfb0b4cc" as const;
const REGISTRY_START_BLOCK = 7453704;

const factoryAddress = optionalAddress(process.env.PONDER_FACTORY_ADDRESS);
const factoryStartBlock = optionalBlock(
  process.env.PONDER_FACTORY_START_BLOCK,
  REGISTRY_START_BLOCK,
);

const registryChamberCreatedEvent = parseAbiItem(
  "event ChamberCreated(address indexed chamber, uint256 seats, string name, string symbol, address erc20Token, address erc721Token)",
);

const factoryChamberCreatedEvent = parseAbiItem(
  "event ChamberCreated(address indexed chamber, address indexed asset, address indexed nft, uint256 seats, string name, string symbol, address creator)",
);

function optionalAddress(value: string | undefined): Address | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  if (!isAddress(trimmed)) {
    throw new Error(
      `Invalid PONDER_FACTORY_ADDRESS '${trimmed}'. Expected a 20-byte hex address.`,
    );
  }
  return trimmed;
}

function optionalBlock(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(
      `Invalid PONDER_FACTORY_START_BLOCK '${value}'. Expected a non-negative integer.`,
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
          address: REGISTRY_ADDRESS,
        },
      },
      startBlock: REGISTRY_START_BLOCK,
    },
    // Present for codegen/types. Empty network = not indexed until the env is set.
    Factory: {
      abi: FactoryAbi,
      network: factoryAddress
        ? {
            sepolia: {
              address: factoryAddress,
              startBlock: factoryStartBlock,
            },
          }
        : {},
      startBlock: factoryStartBlock,
    },
    Chamber: {
      abi: ChamberAbi,
      network: {
        sepolia: {
          address: factory({
            address: REGISTRY_ADDRESS,
            event: registryChamberCreatedEvent,
            parameter: "chamber",
          }),
        },
      },
      startBlock: REGISTRY_START_BLOCK,
    },
    // Same Chamber ABI, discovered from Factory ChamberCreated (different event).
    // Ponder 0.8 accepts one factory() per contract, so this is a second source.
    FactoryChamber: {
      abi: ChamberAbi,
      network: factoryAddress
        ? {
            sepolia: {
              address: factory({
                address: factoryAddress,
                event: factoryChamberCreatedEvent,
                parameter: "chamber",
              }),
              startBlock: factoryStartBlock,
            },
          }
        : {},
      startBlock: factoryStartBlock,
    },
  },
});
