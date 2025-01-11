import { parseAbiItem } from "abitype";
import { createConfig, factory } from "ponder";

import { http } from "viem";

import { RegistryAbi } from "./abis/RegistryAbi";
import { ChamberAbi } from "./abis/ChamberAbi";

const chamberCreatedEvent = parseAbiItem(
  "event ChamberCreated(address indexed chamber, uint256 seats, string name, string symbol, address erc20Token, address erc721Token)",
);

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
          address: "0xB028110234375A368Aa0b5fFB138ae1dDfb0b4cc",
        }
      },
      startBlock: 7453704,
    },
    Chamber: {
      abi: ChamberAbi,
      network: {
        sepolia: {
          address: factory({
            address: "0xB028110234375A368Aa0b5fFB138ae1dDfb0b4cc",
            event: chamberCreatedEvent,
            parameter: "chamber",
          }),
        }
      },
      startBlock: 7453704,
    },
  },
});
